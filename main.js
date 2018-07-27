const express = require('express');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.get('/ep/:id', function(req, res) {
    var currEp = req.params.id;
    res.render('pages/video', { currEp });
    console.log(currEp);
})

app.get('/', (req, res) => {
    res.send("Test");
})
app.get('/main', function(req, res) {
    const arr = [1, 2, 3, 4];
    res.render('pages/demo', { videos: arr });
});
app.listen(3000);