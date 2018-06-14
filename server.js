const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// custom middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.')
        }
    });
    next();
});

// 'maintenance mode' blocking middleware w/ no next() call
// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         maintenanceMessage: 'The site is currently undergoing maintenance. Check back tomorrow.',
//     });
// });

app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('Hello Express!');
    // res.send({
    //     name: 'Jearl',
    //     likes: [
    //         'food',
    //         'cats',
    //         'beer'
    //     ]
    // });
    res.render('home.hbs', {
        welcomeMessage: 'Welcome to Some Website!',
        pageTitle: 'Home Page'
    });
});

app.get('/about', (req, res) => {
    // res.send('<h1>About Page</h1>');
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page'
    });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to complete request.',
    })
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});