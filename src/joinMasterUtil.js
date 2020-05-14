import { GraphQLSchema } from './app';

export const getTableAlias = (sqlASTNode, fieldName) => {
    const { children } = sqlASTNode;

    // First element of returned array
    const [childNode] = children.filter(child => child.fieldName === fieldName);

    if (childNode)
        return childNode.as;

    return null;
}

export const knexToWhereClause = (queryBuilderObj) => {
    return queryBuilderObj.toSQL().toNative().sql.substring(14);
}

export const getSQLTable = (typeName) => {
    const type = GraphQLSchema._typeMap[typeName];
    if (!type) throw new Error(`Type ${typeName} not found in schema!`);

    return type._typeConfig.sqlTable;
}