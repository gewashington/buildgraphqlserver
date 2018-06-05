// First install express, express graphql and nodemon.
// nodemon makes sure the server doesn't have to refresh/reset everytime we save a change
// Then create this file - server.js

const express = require('express'); // import express
const expressGraphQL = require('express-graphql'); //graphQL connects graphql to express
const schema = require('./schema.js');

const app = express(); //initializes express

app.use('/graphql', expressGraphQL({  //this takes in a configuration object
    schema:schema,
    graphiql:true  //is it true we want to use graphiql ide to run our tests
}));

app.listen(4000, () => { //this runs the server on selected port.
    console.log('Server is running on port 4000') 
// In package.json -> scripts, you can add a script to run via nodemon rather than through terminal (get rid of test) 
// It is dev:server since we are also going to run json server (json:server)
// The command is 'npm run XX:XX'
// There will not be any routes when you first start so the webpage will say 'Cannot Get /'
})