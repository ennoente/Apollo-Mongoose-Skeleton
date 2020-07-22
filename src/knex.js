import knexInit from "knex";

const knex = knexInit({
    client: "mysql2",
    //client: "mysql",
    //version: "5.7",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "brabo_two",
    },
});

export default knex;