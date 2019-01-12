const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // uses key value pairs
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


// creating middleware; next exists to let the program know when you're done; you can have as much middleware as you'd like
app.use((req, res, next) => {
    var now = new Date().toString(); // time stamp to log requests by time
    // go to http://expressjs.com/en/4x/api.html#req for line info below
    var log = `${now}: ${req.method} ${req.url}`;


    console.log(log);
    // we want this fs method to create a file that logs server activity..
    // appending will allow adding onto a file and log is the actual content of the message

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log')
        }
        next();
    });
});

// This middleware catches the server file before it runs to the rest beyond this point
// it informs the user things are undergoing maintenance
// can be commented out to enable/disable
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public')); // we put this here due to maintenance mode above

// takes two arguments - 1.) name of the helper, 2.) the function that is to run
// will take the place of having to call the year information in lines below
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

// must include "text" as the function - otherwise, it'll break
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page', 
        welcomeMessage: 'Welcome to my website', 
        // currentYear: new Date().getFullYear()
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
       pageTitle: 'About page', 
    //    currentYear: new Date().getFullYear() 
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle that request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port 3000`);
});