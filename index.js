const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fileUpload = require('express-fileupload');
const app = express();
const knex = require('./modulesdb/dbconect');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.send("Welcome!!!");
})

app.get('/main', (req, res) => {
    knex('movies').select('movie_id', 'title')
        .then((rows) => {
            res.render('pages/demo', { videos: rows });
        })

});
app.get('/ep/:id', (req, res) => {
    const currEp = req.params.id;
    knex('movies').where('movie_id', currEp).select('*')
        .then((result) => {
            const userID = result[0].userID;
            const link = result[0].link;
            const title = result[0].title;
            const link_sub = result[0].link_sub;
            console.log(result[0].link_sub);
            if (userID != null) {
                knex('user').where('id', userID).select('email')
                    .then(e => {
                        const useID = e[0].email;
                        console.log(useID);
                        res.render('pages/video', { currEp, useID, link, title, link_sub });
                    })
            } else {
                var useID = "Admin";
                res.render('pages/video', { currEp, useID, link, title, link_sub });
            }

        });
});
app.get('/login', (req, res) => {
    const message = "";
    res.render('pages/login', { message });

})
app.get('/signup', (req, res) => {
    res.render('pages/signup');
})
app.post('/login', (req, res) => {
    knex('user').where({ 'email': req.body.email, 'password': req.body.password }).select('id')
        .then((id) => {
            if (id[0] != null) {
                var arr = [];
                knex('movies').select('movie_id')
                    .then((rows) => {
                        var count = 0;
                        for (row of rows) {
                            arr[count] = row['movie_id'];
                            console.log(arr[count]);
                            count++;
                        }
                        res.render('pages/demo', { videos: arr });
                    })
            } else {
                const message = "error";
                res.render('pages/login', { message });
            }
        })
})
app.get('/upload', function(req, res) {
        res.render('pages/upload');
    })
    // app.post('/upload', (req, res) => {
    //     var form = new formidable.IncomingForm();
    //     const title = req.body.title;
    //     form.parse(req, function(err, fileds, file) {
    //         //console.log(file);
    //         const link = file.file.path;
    //         const link2 = "/video/" + file.file.name;
    //         const sub = file.sub.path;
    //         const sub2 = "/vtt/" + file.sub.name;
    //         fs.readFile(sub, (err, db) => {
    //             fs.writeFile(sub2, db, (err) => {
    //                 fs.unlink(sub, (err) => {
    //                     fs.readFile(link, function(err, data) {
    //                         fs.writeFile(link2, data, function(err) {
    //                             fs.unlink(link, function(err) {
    //                                 if (err) {
    //                                     res.status(500);
    //                                     res.json({ 'success': false });
    //                                 } else {
    //                                     knex('movies').insert({ "link": link2, "title": fileds.title, "link_sub": sub2 }).returning('movie_id')
    //                                         .then(i => {
    //                                             knex('movies').select('movie_id', 'title')
    //                                                 .then((rows) => {
    //                                                     res.render('pages/demo', { videos: rows });
    //                                                 })
    //                                         })
    //                                 }
    //                             });
    //                         });
    //                     });
    //                 })
    //             })
    //         })

//     })
// });

app.use(fileUpload());
app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    const sub = req.files.sub;
    const link_sub = "/vtt/" + req.files.sub.name;
    const video = req.files.file;
    const link_file = "/video/" + req.files.file.name;
    sub.mv(link_sub, (err) => {
        video.mv(link_file, (err) => {
            knex('movies').insert({ "link": link_file, "title": req.body.title, "link_sub": link_sub }).returning('movie_id')
                .then(i => {
                    knex('movies').select('movie_id', 'title')
                        .then((rows) => {
                            res.render('pages/demo', { videos: rows });
                        })
                })
        })

    })
});
app.listen(9000);