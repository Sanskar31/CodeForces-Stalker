/*
All Imports
*/
const express= require('express');
const path= require('path');
const bodyParser = require('body-parser');

const app= express();

/*
Setting View Engine
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/userRoutes');

app.use(userRoutes);

app.get("/", (req, res, next) => {
    res.render('home', {
        done: 0,
        nick: ""
    });
});

app.listen(3000, (result) => {
    console.log('Connected!');
});