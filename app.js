const express = require('express');

const app = express();
const port = process.env.PORT||3000;

app.get('/',(req,res)=>{
    res.send('i am heroku project');
})

app.listen(port,()=>{console.log(`app run port ${port}`)});