import assert from "assert";
import {filter} from "lodash";
import idx from "idx";

import {validateSqlAST, inspect, wrap} from "../util";
import {
    joinPrefix,
    thisIsNotTheEndOfThisBatch,
    whereConditionIsntSupposedToGoInsideSubqueryOrOnNextBatch,
    tableHasNoFilteredOneToManyJoin,
    nodeIsChildOfFilteredTable,
    getFilteredTableParentNode
} from "./shared";
import { queryASTToSqlAST } from "../query-ast-to-sql-ast";

export default async function stringifySqlAST(topNode, context, options) {
    validateSqlAST(topNode);

    let dialect = options.dialectModule;

    if (!dialect && options.dialect) {
        dialect = require("./dialects/" + options.dialect);
    }

    //console.log("IN stringifySqlAST. !!topNode.filteredOneToManyJoin", !!topNode.filteredOneToManyJoin);

    // recursively figure out all the selections, joins, and where conditions that we need
    let {selections, tables, wheres, orders} = await _stringifySqlAST(
        null,
        topNode, [],
        context, [], [], [], [],
        options.batchScope,
        dialect,
        options,

        !!topNode.filteredOneToManyJoin //assembleFilteredJoinSubselect
    );

    // make sure these are unique by converting to a set and then back to an array
    // e.g. we want to get rid of things like `SELECT user.id as id, user.id as id, ...`
    // GraphQL does not prevent queries with duplicate fields
    selections = [...new Set(selections)];

    // bail out if they made no selections
    if (!selections.length) return "";

    // put together the SQL query
    let sql = "SELECT\n  " + selections.join(",\n  ") + "\n" + tables.join("\n");

    wheres = filter(wheres);
    if (wheres.length) {
        sql += "\nWHERE " + wheres.join(" AND ");
    }

    if (orders.length) {
        sql += "\nORDER BY " + stringifyOuterOrder(orders, dialect.quote);
    }

    return sql;
}

async function _stringifySqlAST(
    parent,
    node,
    prefix,
    context,
    selections,
    tables,
    wheres,
    orders,
    batchScope,
    dialect,
    options,
    assembleFilteredJoinSubselect
) {
    const {quote: q} = dialect;
    const parentTable = node.fromOtherTable || (parent && parent.as);
    switch (node.type) {
        case "table":
            await handleTable(
                parent,
                node,
                prefix,
                context,
                selections,
                tables,
                wheres,
                orders,
                batchScope,
                dialect,
                options,

                assembleFilteredJoinSubselect
            );

            // recurse thru nodes
            //if (thisIsNotTheEndOfThisBatch(node, parent)
            //        && tableHasNoFilteredOneToManyJoin(node)) {
            //            console.log(`Table ${node.name} has no filtered OneToMany`)
            if (thisIsNotTheEndOfThisBatch(node, parent)) {
                for (let child of node.children) {
                    await _stringifySqlAST(
                        node,
                        child, [...prefix, node.as],
                        context,
                        selections,
                        tables,
                        wheres,
                        orders,
                        null,
                        dialect,
                        options,

                        assembleFilteredJoinSubselect
                    );
                }
            }

            break;
        case "union":
            await handleTable(
                parent,
                node,
                prefix,
                context,
                selections,
                tables,
                wheres,
                orders,
                batchScope,
                dialect,
                options
            );

            // recurse thru nodes
            if (thisIsNotTheEndOfThisBatch(node, parent)) {
                for (let typeName in node.typedChildren) {
                    for (let child of node.typedChildren[typeName]) {
                        await _stringifySqlAST(
                            node,
                            child, [...prefix, node.as],
                            context,
                            selections,
                            tables,
                            wheres,
                            orders,
                            null,
                            dialect,
                            options
                        );
                    }
                }
                for (let child of node.children) {
                    await _stringifySqlAST(
                        node,
                        child, [...prefix, node.as],
                        context,
                        selections,
                        tables,
                        wheres,
                        orders,
                        null,
                        dialect,
                        options
                    );
                }
            }

            break;

        case "column":
            if (node.permissions) {
                const result = node.permissions(context, node.args, parent.args);
                if (!result) break;
            }
            selections.push(
                `${q(parentTable)}.${q(node.name)} AS ${q(
                    joinPrefix(prefix) + node.as
                )}`
            );

            /*
            if (!assembleFilteredJoinSubselect && nodeIsChildOfFilteredTable(node)) {
                let _prefix = [...prefix];

                const indx = prefix.findIndex(item => item === '' + getFilteredTableParentNode(node).as);
                //console.log("indx", indx);

                _prefix = _prefix.slice(indx);

                console.log(`In !assemble...: Pushing to selections to parentTable ${getFilteredTableParentNode(node).as} the node.as=${node.as}`);
                selections.push(
                    `${q(getFilteredTableParentNode(node).as)}.${q(joinPrefix(_prefix) + node.as)} AS ${q(joinPrefix(prefix) + node.as)}`
                )
            } else {
                console.log(`Pushing to selections to parentTable ${parentTable} the node.name=${node.name}`);
                selections.push(
                    `${q(parentTable)}.${q(node.name)} AS ${q(
                        joinPrefix(prefix) + node.as
                    )}`
                );
            }
            */
            break;
        case "columnDeps":
            // grab the dependant columns
            for (let name in node.names) {
                selections.push(
                    `${q(parentTable)}.${q(name)} AS ${q(
                        joinPrefix(prefix) + node.names[name]
                    )}`
                );
            }
            break;
        case "composite":
            selections.push(
                `${dialect.compositeKey(parentTable, node.name)} AS ${q(
                    joinPrefix(prefix) + node.as
                )}`
            );
            break;
        case "expression":
            const expr = await node.sqlExpr(
                `${q(parentTable)}`,
                node.args || {},
                context,
                node
            );
            selections.push(`${expr} AS ${q(joinPrefix(prefix) + node.as)}`);
            break;
        case "noop":
            // we hit this with fields that don't need anything from SQL, they resolve independently
            return;
        default:
            throw new Error("unexpected/unknown node type reached: " + inspect(node));
    }
    return {selections, tables, wheres, orders};
}

function assembleFilterConditions(
    node,
    jAst,
    q,
    mode
) {
    const {filter} = node.args;
    assert(filter, 'No filter!?');

    if (filter.OR) {
        return _assembleFilterConditions(filter.OR, 'OR', jAst, node.as, q, '', mode);
    } else if (filter.AND) {
        return _assembleFilterConditions(filter.AND, 'AND', jAst, node.as,  q, '', mode);
    } else if (filter.compare) {
        return _assembleFilterConditions(filter, '', jAst, node.as, q, '', mode);
    } else {
        throw new Error(`Wrong filter option. Available are 'AND', 'OR' and 'compare'. Check the filter on the "${node.as}" field`);
    }
}

function _assembleFilterConditions(
    filterArr,
    chainOperator,
    jAst,
    joinTableAlias,
    q,
    sql,
    mode
) {
    let and = [];
    let or = [];
    let direct = [];

    // Could be just a single `compare` object. To iterate, wrap it
    filterArr = wrap(filterArr);

    // Iterate through the array
    filterArr.forEach(obj => {
        if (obj.compare) {
            direct.push(buildComparison(
                obj.compare,
                jAst,
                joinTableAlias,
                q,
                mode
            ));
        } else if (obj.AND) {
            and.push(obj.AND);
        } else if (obj.OR) {
            or.push(obj.OR);
        }
    });

    sql += ` ${direct.join(` ${chainOperator} `)} `

    and.forEach(andObj => {
        sql += `\n\t ${chainOperator} ( ${_assembleFilterConditions(andObj, 'AND', jAst, joinTableAlias, q, '', mode)} ) `
    })

    or.forEach(orObj => {
        sql += `\n\t ${chainOperator} ( ${_assembleFilterConditions(orObj, 'OR', jAst, joinTableAlias, q, '', mode)} ) `
    })

    return sql;
}

function buildComparison(
    compareObj,
    jAst,
    tableAlias,
    q,
    mode
) {
    const { key, operator, value } = compareObj;

    let parentNode = jAst;
    let currentNode = jAst;
    let renameParts = [];
    key.split('.').forEach(part => {
        currentNode = currentNode.children.find(child => child.fieldName === part);
        parentNode = currentNode.parent

        assert(currentNode, 'NO CURRENTNODE??!?!?!!?');

        renameParts.push(currentNode.as);
    });

    if (mode === 'where') {
        if (renameParts.length > 1)
            renameParts.splice(-2, 1);
        
        tableAlias = currentNode.parent.as;
    }

    const renamedKey = renameParts.join('__');
    
    switch (operator) {
        case 'seq':
            return `${q(tableAlias)}.${q(renamedKey)} = '${value}'`;

        case 'sneq':
            return `${q(tableAlias)}.${q(renamedKey)} != '${value}'`;

        case 'sct':
            return `${q(tableAlias)}.${q(renamedKey)} LIKE '%${value}%'`;

        case 'snct':
            return `${q(tableAlias)}.${q(renamedKey)} NOT LIKE '%${value}%'`;

        case 'gt':
            return `${q(tableAlias)}.${q(renamedKey)} > ${value}`;
        
        case 'gte':
            return `${q(tableAlias)}.${q(renamedKey)} >= ${value}`;

        case 'lt':
            return `${q(tableAlias)}.${q(renamedKey)} < ${value}`;
            
        case 'lte':
            return `${q(tableAlias)}.${q(renamedKey)} <= ${value}`;

        case '==':
            return `${q(tableAlias)}.${q(renamedKey)} = ${value}`;

        case 'ssw':
            return `${q(tableAlias)}.${q(renamedKey)} LIKE '${value}%'`;

        case 'sew':
            return `${q(tableAlias)}.${q(renamedKey)} LIKE '%${value}'`;

        default:
            throw new Error(`Comparison operator '${operator}' for filter field '${key}' inside '${tableAlias}' is not valid`);
    }
}

/*
function _assembleFilterConditions(
    filterObj,
    chainOperator,
    joinTableAlias,
    q,
    node,
    type,
    sql
) {
    let and;
    let or;
    let direct = [];

    for (let index in filterObj) {
        const obj = filterObj[index];

        if (obj.compare) {
            direct.push(buildComparison(obj.compare, joinTableAlias, q, node, type));
        } else if (obj.AND) {
            and = obj.AND;
        } else if (obj.OR) {
            or = obj.OR;
        }
    }

    sql += ` ${direct.join(` ${chainOperator} `)} `;

    if (and) {
        sql += ` ${chainOperator} ( ${_assembleFilterConditions(and, 'AND', joinTableAlias, q, '')} )`
    } else if (or) {
        sql += ` ${chainOperator} ( ${_assembleFilterConditions(or, 'OR', joinTableAlias, q, '')} )`
    }

    return sql;
}


/*
function renameComparisonKey(key, node) {
    const parts = key.split('.');       // [ 'manufacturer', 'name' ]  or  [ 'sysMachine', 'name' ]
    const aliasedParts = []; 

    //console.log("parts", parts);

    let currentNode = node;

    // Iterate through parts
    for (let partsIndex in parts) {
        let noChildFound = true;

        //console.log(`Current node fieldName: ${currentNode.fieldName}. Current part: ${parts[partsIndex]}`);
        //console.log('');

        // Check for children with the correct `fieldName` attribute
        for (let childrenIndex in currentNode.children) {
            let currentChild = currentNode.children[childrenIndex];
            //console.log("currentChild", currentChild);

            // Child was found -> continue
            if (currentChild.fieldName === parts[partsIndex]) {
                //console.log(`Found child ${currentChild.fieldName} for ${parts[partsIndex]}`)
                aliasedParts.push(currentChild.as);
                noChildFound = false;
                currentNode = currentChild;
                break;
            }
        }

        if (noChildFound)
            throw new Error(`Wrong filter key '${key}' for node '${node.fieldName}' with alias ${node.as}`);
    }

    
    //if (type === 'WHERE') {
    //    aliasedParts.splice(1);
    //}
    

    return aliasedParts.join('__');
}
*/


/*
function buildComparison({key, operator, value}, joinTableAlias, q, node, type) {
    // We need to rename the key to match Join Monster's aliases
    let renamedKey = renameComparisonKey(key, node, type);

    if (type === 'WHERE') {
        const parts = renamedKey.split('__');

        // This is part of the original table
        if (parts.length === 1) {
            joinTableAlias = node.as;
        } else {
            joinTableAlias = parts[0];
            renamedKey = parts.splice(1).join('__');
        }
    }

    switch (operator) {
        case 'seq':
            return `${q(joinTableAlias)}.${q(renamedKey)} = '${value}'`;

        case 'sneq':
            return `${q(joinTableAlias)}.${q(renamedKey)} != '${value}'`;

        case 'sct':
            return `${q(joinTableAlias)}.${q(renamedKey)} LIKE '%${value}%'`;

        case 'snct':
            return `${q(joinTableAlias)}.${q(renamedKey)} NOT LIKE '%${value}%'`;

        case 'gt':
            return `${q(joinTableAlias)}.${q(renamedKey)} > ${value}`;

        case 'lt':
            return `${q(joinTableAlias)}.${q(renamedKey)} < ${value}`;

        case '==':
            return `${q(joinTableAlias)}.${q(renamedKey)} = ${value}`;

        case 'ssw':
            return `${q(joinTableAlias)}.${q(renamedKey)} LIKE '${value}%'`;

        case 'sew':
            return `${q(joinTableAlias)}.${q(renamedKey)} LIKE '%${value}'`;

        default:
            throw new Error(`Comparison operator '${operator}' for filter field '${key}' inside '${joinTableAlias}' is not valid`);
    }
}
*/


/*
function _assembleLeftJoinFilterConditions(
    filter,
    chainOperator,       // OR or AND
    comparison,
    sql
) {
    if (comparison) {
        sql += ` ${chainOperator} ${comparison}`
    } else if (chainOperator === 'AND') {
        sql += ` ${chainOperator} ( ${_assembleLeftJoinFilterConditions(filter.AND, 'AND', null, sql)} ) `
    } else if (chainOperator === 'OR') {
        sql += ` ${chainOperator} ( ${_assembleLeftJoinFilterConditions(filter.OR, 'OR', null, sql)} ) `
    }

    return sql;
}
*/

/*
async function handleFilteredOneToManyJoin(
    parent,
    node,
    prefix,
    context,
    selections,
    tables,
    wheres,
    orders,
    batchScope,
    dialect,
    options
) {
    const _node = {...node};

    // Copy _node and keep the parent
    //const _node = { ...node, parent: node.parent };

    const {quote: q} = dialect;

    //console.log("node", node);
    //console.log("_node", _node);

    const stdJoinCondition = _node.sqlJoin(
        `${q(parent.as)}`,
        q(node.as),
        _node.args || {},
        context,
        _node
    );

    // Analyze the join condition and convert the used field names to their aliases
    assert(_node.filteredJoinDeps, `You have to specify 'filteredJoinDeps' on fields that are part of a sqlJoin. Check the '${_node.fieldName}' field inside the '${parent.fieldName}' field`);
    const {parentTableDeps, childTableDeps} = _node.filteredJoinDeps;
    for (let index in _node.filteredJoin) {

    }

    //_node['filteredJoin'] = _node['sqlJoin'];
    _node['sqlJoin'] = null;
    //_node['filteredOneToManyJoin'] = false;
    const sql = await stringifySqlAST(_node, context, options, parent);
    console.log("sql for complex join", sql);

    const joinFilterConditions = assembleFilterConditions(_node, q, 'LEFT_JOIN');

    //console.log("joinFilterConditions", joinFilterConditions);
    // ON ${q(_node.as)}.${q('sysMachine__name')} LIKE '%DER%'

    const filteredOneToManyJoin = `LEFT JOIN (
        ${sql}
    ) AS ${q(_node.as)}
        ON ${stdJoinCondition}
        ${joinFilterConditions ? ` AND ( ${joinFilterConditions} )` : ''}
    `;

    return filteredOneToManyJoin;
}
*/

async function handleFilteredWhere(
    selections,
    tables,
    wheres,
    node,
    q,
    args,
    context
) {
    const joinAst = node.filteredWhereMap;

    const { selections: additionalSelections, joinTables } = joinAstToLists(
        joinAst,
        q,
        args,
        context
    );

    const filterConditions = assembleFilterConditions(
        node,
        joinAst,
        q,
        'where'
    );

    selections.push(...additionalSelections);
    
    joinTables.forEach(joinObj => {
            tables.push(joinObj.sql);
    })

    wheres.push(filterConditions);
}

/*
function tableIsNotYetJoined(
    joinObj,
    sqlASTNode
) {
    console.log("sqlASTNode", sqlASTNode);
    console.log("joinObj", joinObj);

    sqlASTNode.children.forEach(child => {

    });
}
*/


async function handleFilteredJoin(
   node,
   q,
   args,
   context,
   standardJoinCondition
) {
    const joinAst = node.join;
    const { selections, joinTables } = joinAstToLists(
        joinAst,
        q,
        args,
        context
    );

    const joins = [];
    joinTables.forEach(joinTable => {
        joins.push(joinTable.sql);
    });

    const filterConditions = assembleFilterConditions(
        node,
        joinAst,
        q,
        'join'
    );

    const str = 
        `LEFT JOIN (
            SELECT
                ${q(node.as)}.*${selections.length > 0 ? ',' : ''}
                ${selections.join(',\n')}
            FROM ${node.name} ${q(node.as)}
                ${joins.join('\n')}
        ) AS ${q(node.as)}
            ON ${standardJoinCondition}
                AND ( ${filterConditions} )`

    return str;
}

function joinAstToLists(
    ast,
    q,
    args,
    context
) {
    const { selections, joinTables } = _joinAstToLists(
        ast,
        [ ast.as ],     // prefix (start with the prefix of the root table's alias)
        [],             // selections
        [],             // joins,
        q,
        args,
        context
    )

    return {
        selections: selections,
        //joins: joins
        joinTables: joinTables
    }
}

function _joinAstToLists(
    currentNode,
    prefix,
    selections,
    joins,
    q,
    args,
    context
) {
    //console.log(`Current prefix for currentNode.as=${currentNode.as}`);
    //console.log(prefix);
    //console.log(currentNode);
    //console.log("__");
    currentNode.children.forEach(child => {
        // The child is a column and is NOT a child of the root node
        if (child.type === 'column' && currentNode.parent) {
            selections.push(
                `${q(currentNode.as)}.${q(child.as)} AS ${q(joinPrefix(prefix) + child.as)}`
            )
        } else if (child.type === 'table' && child.children.length > 0) {
            if (child.sqlJoin) {
                const joinCondition = child.sqlJoin(
                    currentNode.as,
                    child.as,
                    args,
                    context,
                    child
                )

                joins.push({
                    as: child,
                    sql: `LEFT JOIN ${q(child.name)} ${q(child.as)} ON ${joinCondition}`
                });
            } else if (idx(child, _ => _.junction.sqlTable && idx(child, _ => _.junction.sqlJoins))) {
                //const joinCondition1 = await node.junction.sqlJoins[0](
                //    `${q()}`
                //)

                const joinCondition1 = child.junction.sqlJoins[0](
                    q(currentNode.as),
                    q(child.junction.as),
                    {},                         // TODO How to handle args and node?!
                    context,
                    null
                );

                const joinCondition2 = child.junction.sqlJoins[1](
                    q(child.junction.as),
                    q(child.as),
                    {},
                    context,
                    null
                );

                joins.push({
                    as: child.junction.as,
                    sql: `LEFT JOIN ${child.junction.sqlTable} ${q(child.junction.as)} ON ${joinCondition1}`
                }, {
                    as: child.as,
                    sql: `LEFT JOIN ${child.name} ${q(child.as)} ON ${joinCondition2}`
                });
            }

            _joinAstToLists(
                child,
                [ ...prefix, child.as ],
                selections,
                joins,
                q,
                args,
                context
            )
        }
    })

    return {
        selections: selections,
        //joins: joins,
        joinTables: joins
    }
}

async function handleTable(
    parent,
    node,
    prefix,
    context,
    selections,
    tables,
    wheres,
    orders,
    batchScope,
    dialect,
    options,
    assembleFilteredJoinSubselect
) {
    const {quote: q} = dialect;

    //const { filter } = node.args;
    //console.log("filter", filter);

    // generate the "where" condition, if applicable
    if (whereConditionIsntSupposedToGoInsideSubqueryOrOnNextBatch(node, parent)) {
        if (idx(node, (_) => _.junction.where)) {
            wheres.push(
                await node.junction.where(
                    `${q(node.junction.as)}`,
                    node.args || {},
                    context,
                    node
                )
            );
        }
        if (node.where) {
            wheres.push(
                await node.where(`${q(node.as)}`, node.args || {}, context, node)
            );
        }
    }

    if (thisIsNotTheEndOfThisBatch(node, parent)) {
        if (idx(node, (_) => _.junction.orderBy)) {
            orders.push({
                table: node.junction.as,
                columns: node.junction.orderBy,
            });
        }
        if (node.orderBy) {
            orders.push({
                table: node.as,
                columns: node.orderBy,
            });
        }
        if (idx(node, (_) => _.junction.sortKey)) {
            orders.push({
                table: node.junction.as,
                columns: sortKeyToOrderColumns(node.junction.sortKey, node.args),
            });
        }
        if (node.sortKey) {
            orders.push({
                table: node.as,
                columns: sortKeyToOrderColumns(node.sortKey, node.args),
            });
        }
    }

    /*
    if (node.filteredJoinDeps && assembleFilteredJoinSubselect) {
        const [parentTableDeps, childTableDeps] = node.filteredJoinDeps;

        if (parent)
            for (let index in parentTableDeps) {
                const field = parentTableDeps;
                selections.push(
                    `${q(parent.as)}.${q(field)} AS ${q(
                        joinPrefix(prefix) + field)
                    }`
                )
            }


        for (let index in childTableDeps) {
            const field = childTableDeps;
            selections.push(
                `${q(node.as)}.${q(field)} AS ${q(
                    joinPrefix(prefix) + field)}`
            )
        }
    }
     */

    // one-to-many using JOIN
    if (node.sqlJoin) {
        const joinCondition = await node.sqlJoin(
            `${q(parent.as)}`,
            q(node.as),
            node.args || {},
            context,
            node
        );

        // do we need to paginate? if so this will be a lateral join
        if (node.paginate) {
            await dialect.handleJoinedOneToManyPaginated(
                parent,
                node,
                context,
                tables,
                joinCondition
            );

            // limit has a highly similar approach to paginating
        } else if (node.limit) {
            node.args.first = node.limit;
            await dialect.handleJoinedOneToManyPaginated(
                parent,
                node,
                context,
                tables,
                joinCondition
            );
            // otherwise, just a regular left join on the table
        }
        /*
        else if (node.filteredOneToManyJoin) {
            tables.push(await handleFilteredOneToManyJoin(
                parent,
                node,
                prefix,
                context,
                selections,
                tables,
                wheres,
                orders,
                batchScope,
                dialect,
                options
            ));
        }
        */
       else if (node.filteredOneToManyJoin) {
            const complexJoin = await handleFilteredJoin(
                node,
                q,
                node.args || {},
                context,
                joinCondition
            );

            tables.push(complexJoin);
       } else {
            tables.push(`LEFT JOIN ${node.name} ${q(node.as)} ON ${joinCondition}`);
        }

        // many-to-many using batching
    } else if (idx(node, (_) => _.junction.sqlBatch)) {
        if (parent) {
            selections.push(
                `${q(parent.as)}.${q(node.junction.sqlBatch.parentKey.name)} AS ${q(
                    joinPrefix(prefix) + node.junction.sqlBatch.parentKey.as
                )}`
            );
        } else {
            const joinCondition = await node.junction.sqlBatch.sqlJoin(
                `${q(node.junction.as)}`,
                q(node.as),
                node.args || {},
                context,
                node
            );
            if (node.paginate) {
                await dialect.handleBatchedManyToManyPaginated(
                    parent,
                    node,
                    context,
                    tables,
                    batchScope,
                    joinCondition
                );
            } else if (node.limit) {
                node.args.first = node.limit;
                await dialect.handleBatchedManyToManyPaginated(
                    parent,
                    node,
                    context,
                    tables,
                    batchScope,
                    joinCondition
                );
            } else {
                tables.push(
                    `FROM ${node.junction.sqlTable} ${q(node.junction.as)}`,
                    `LEFT JOIN ${node.name} ${q(node.as)} ON ${joinCondition}`
                );
                // ensures only the correct records are fetched using the value of the parent key
                wheres.push(
                    `${q(node.junction.as)}.${q(
                        node.junction.sqlBatch.thisKey.name
                    )} IN (${batchScope.join(",")})`
                );
            }
        }

        // many-to-many using JOINs
    } else if (idx(node, (_) => _.junction.sqlTable)) {

        const joinCondition1 = await node.junction.sqlJoins[0](
            `${q(parent.as)}`,
            q(node.junction.as),
            node.args || {},
            context,
            node
        );
        const joinCondition2 = await node.junction.sqlJoins[1](
            `${q(node.junction.as)}`,
            q(node.as),
            node.args || {},
            context,
            node
        );

        if (node.paginate) {
            await dialect.handleJoinedManyToManyPaginated(
                parent,
                node,
                context,
                tables,
                joinCondition1,
                joinCondition2
            );
        } else if (node.limit) {
            node.args.first = node.limit;
            await dialect.handleJoinedManyToManyPaginated(
                parent,
                node,
                context,
                tables,
                joinCondition1,
                joinCondition2
            );
        } else {
            tables.push(
                `LEFT JOIN ${node.junction.sqlTable} ${q(
                    node.junction.as
                )} ON ${joinCondition1}`
            );
        }

        if (node.filteredManyToMany) {
            const complexJoin = await handleFilteredJoin(
                node,
                q,
                node.args || {},
                context,
                joinCondition2
            );

            tables.push(complexJoin);
        } else {
            tables.push(`LEFT JOIN ${node.name} ${q(node.as)} ON ${joinCondition2}`)
        }

        // one-to-many with batching
    } else if (node.sqlBatch) {
        if (parent) {
            selections.push(
                `${q(parent.as)}.${q(node.sqlBatch.parentKey.name)} AS ${q(
                    joinPrefix(prefix) + node.sqlBatch.parentKey.as
                )}`
            );
        } else if (node.paginate) {
            await dialect.handleBatchedOneToManyPaginated(
                parent,
                node,
                context,
                tables,
                batchScope
            );
        } else if (node.limit) {
            node.args.first = node.limit;
            await dialect.handleBatchedOneToManyPaginated(
                parent,
                node,
                context,
                tables,
                batchScope
            );
            // otherwite, just a regular left join on the table
        } else {
            tables.push(`FROM ${node.name} ${q(node.as)}`);
            wheres.push(
                `${q(node.as)}.${q(node.sqlBatch.thisKey.name)} IN (${batchScope.join(
                    ","
                )})`
            );
        }
        // otherwise, we aren't joining, so we are at the "root", and this is the start of the FROM clause
    } else if (node.paginate) {
        await dialect.handlePaginationAtRoot(parent, node, context, tables);
    } else if (node.limit) {
        node.args.first = node.limit;
        await dialect.handlePaginationAtRoot(parent, node, context, tables);
    } else {
        //assert((!parent && node.filteredWhere) || (!parent && node.filteredToplevelField),



        /*
        if (!parent && node.filteredWhere) {
            wheres.push(
                assembleFilterConditions(node, q, 'WHERE')
            )
        } else if (!parent && node.filteredToplevelField) {

        } else if (!parent) {

        }
         */

        tables.push(`FROM ${node.name} ${q(node.as)}`);

        if (node.filteredWhere) {
            handleFilteredWhere(
                selections,
                tables,
                wheres,
                node,
                q,
                node.args || {},
                context
            )
        }

        assert(!parent,
            `Object type for "${node.fieldName}" table must have a "sqlJoin" or "sqlBatch"`);
    }
}

// we need one ORDER BY clause on at the very end to make sure everything comes back in the correct order
// ordering inner(sub) queries DOES NOT guarantee the order of those results in the outer query
function stringifyOuterOrder(orders, q) {
    const conditions = [];
    for (let condition of orders) {
        for (let column in condition.columns) {
            const direction = condition.columns[column];
            conditions.push(`${q(condition.table)}.${q(column)} ${direction}`);
        }
    }
    return conditions.join(", ");
}

function sortKeyToOrderColumns(sortKey, args) {
    let descending = sortKey.order.toUpperCase() === "DESC";
    if (args && args.last) {
        descending = !descending;
    }
    const orderColumns = {};
    for (let column of wrap(sortKey.key)) {
        orderColumns[column] = descending ? "DESC" : "ASC";
    }
    return orderColumns;
}