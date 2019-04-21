const knex = require('./dbconect');

function getAll() {
    var arr = [];
    knex('movies').select('movie_id')
        .then((rows) => {
            var count = 0;
            for (row of rows) {
                arr[count] = row['movie_id'];
                //console.log(arr[count]);
                count++;
            }
            return arr;
        })
}
module.exports = getAll;