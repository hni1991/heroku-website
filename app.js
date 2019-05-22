const express = require('express');
const app = express();
const port = process.env.PORT || 3100 ;
const parser = require('body-parser');
const path = require('path');


app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(express.static('./src/public'));


app.set('views',path.join(__dirname,'/src/view'));
app.set('view engine','ejs');

const mRoute = require('./src/router/mainRaut')
app.use('/',mRoute);


app.listen(port,()=>{console.log(`on port ${port}!`)})