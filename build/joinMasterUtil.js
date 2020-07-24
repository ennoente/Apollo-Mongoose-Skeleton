"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSQLTable = exports.knexToWhereClause = exports.getTableAlias = void 0;

var _app = require("./app");

const getTableAlias = (sqlASTNode, fieldName) => {
  const {
    children
  } = sqlASTNode; // First element of returned array

  const [childNode] = children.filter(child => child.fieldName === fieldName);
  if (childNode) return childNode.as;
  return null;
};

exports.getTableAlias = getTableAlias;

const knexToWhereClause = queryBuilderObj => {
  return queryBuilderObj.toSQL().toNative().sql.substring(14);
};

exports.knexToWhereClause = knexToWhereClause;

const getSQLTable = typeName => {
  const type = _app.GraphQLSchema._typeMap[typeName];
  if (!type) throw new Error(`Type ${typeName} not found in schema!`);
  return type._typeConfig.sqlTable;
};

exports.getSQLTable = getSQLTable;