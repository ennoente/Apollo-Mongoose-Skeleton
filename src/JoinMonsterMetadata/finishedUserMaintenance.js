import { extendJmQuery, addJmType, extendJmMutation } from 'join-monster-modularizer';

addJmType('FinishedUserMaintenance', {
    sqlTable: 'user_finished_maintenance',
    uniqueKey: 'id',
    fieldMappings: {
        maintenanceId: 'user_maintenance_id',
        maintenanceName: 'user_maintenance_name',
        maintenanceDescription: 'user_maintenance_description',

        userId: 'sys_user_id',
        username: 'username',

        machineName: 'machine_name',
        machineDescription: 'machine_description',
        machineBarcode: 'machine_barcode',

        comment: 'comment',
        successful: 'successful',
        finishedAt: 'finished_at'
    },
    fields: {
        maintenanceId: {
            sqlColumn: 'user_maintenance_id'
        },
        maintenanceName: {
            sqlColumn: 'user_maintenance_name'
        },
        maintenanceDescription: {
            sqlColumn: 'user_maintenance_description'
        },
        userId: {
            sqlColumn: 'sys_user_id'
        },
        username: {
            sqlColumn: 'username',
        },
        machineName: {
            sqlColumn: 'machine_name'
        },
        machineDescription: {
            sqlColumn: 'machine_description'
        },
        machineBarcode: {
            sqlColumn: 'machine_barcode'
        },
        comment: {
            sqlColumn: 'comment'
        },
        successful: {
            sqlColumn: 'successful'
        },
        finishedAt: {
            sqlColumn: 'finished_at'
        }
    }
});

extendJmMutation('createFinishedUserMaintenance', {
    refType: 'FinishedUserMaintenance'
}, true);



