import { addJmType } from 'join-monster-modularizer';

addJmType('Document', {
    sqlTable: 'document',
    uniqueKey: 'id',
    fields: {
        name: {
            sqlColumn: 'name'
        },
        fileSize: {
            sqlColumn: 'file_size'
        },
        path: {
            sqlColumn: 'path'
        }
    }
})
