const express = require('express');
const app = express();
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(express.static('public'));

app.set('views',path.join(__dirname,'/src/view'));
app.set('view engine','ejs');

const port = process.env.PORT || 3100 ;


app.listen(port,()=>{console.log(`on port ${port}!`)})