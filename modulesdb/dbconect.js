const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'hthoa137',
        database: 'demo'
    }
});
module.exports = knex;