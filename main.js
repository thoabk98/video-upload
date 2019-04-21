const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
//mysql 
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hthoa137",
    database: "demo"
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     /*Create a database named "mydb":*/
// });
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'hthoa137',
        database: 'demo'
    }
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.get('/ep/:id', function(req, res) {
    var currEp = req.params.id;
    //console.log("ID: ", useID);

    console.log(currEp);
    con.query("SELECT email FROM user WHERE id IN(SELECT userID FROM movies WHERE movie_id = ?)", [currEp], function(err, results, fields) {
        var useID = results[0].email;
        console.log(useID);
        res.render('pages/video', { currEp, useID });
    })

})

app.get('/', (req, res) => {
    res.send("Welcome!!!");
})
app.get('/main', function(req, res) {
    const arr = [1, 2, 3, 4];
    res.render('pages/demo', { videos: arr });
});

app.get('/login', function(req, res) {
    var message = "";
    res.render('pages/login', { message });
})

//mysql
app.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    con.query('SELECT * FROM user WHERE email = ? AND password=?', [email, password], function(err, results, fields) {
        if (err) throw err;
        if (results[0] != null) {
            console.log(results);
            const arr = [1, 2, 3, 4];
            res.render('pages/demo', { videos: arr });
        } else {
            var message = "Error";
            res.render('pages/login', { message });
        }
    })
})

// app.post('/login', function(req, res) {
//     var email = req.body.email;
//     var password = req.body.password;
//     var sql = knex('user').where({
//         'email': email,
//         'password': password
//     });
//     if (sql != null) {
//         const arr = [1, 2, 3, 4];
//         res.render('pages/demo', { videos: arr })
//     } else {
//         console.log("err");
//     }
// })


app.get('/signup', function(req, res) {
    res.render('pages/signup');
})

app.post('/signup', function(req, res) {

    var new_user = {
        "email": req.body.email,
        "password": req.body.password
    }
    con.query("INSERT INTO user SET ?", new_user, function(err, results, fields) {

        if (!err) {
            res.render('pages/login');
        } else {
            throw err;
        }
    })
})

// app.post('/signup', function(req, res) {

//     var email = req.body.email;
//     var password = req.body.password;
//     var sql = knex('user').insert({ "email": email }, { "password": password });
//     if (sql != null) {
//         res.render('pages/login')
//     } else {
//         console.log("error");
//     }
// })
app.listen(3000);