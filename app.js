const express = require('express');
const app = express();
const session = require('express-session');

const port = process.env.PORT || 3100 ;
//const parser = require('body-parser');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('./src/public'));
app.use(session({secret:'classyads'}))

app.set('views',path.join(__dirname,'/src/view'));
app.set('view engine','ejs');

const mRoute = require('./src/router/mainRaut')
app.use('/',mRoute);


app.listen(port,()=>{console.log(`on port ${port}!`)})