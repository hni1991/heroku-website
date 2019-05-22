const express = require('express');
const mRoutes = express.Router();
const MongoClient = require('mongodb').MongoClient;
//const ObjectID = require('mongodb').ObjectID;
const {decrypt, encrypt} = require('./crepto');

const url = 'mongodb+srv://Hoseinniko:serverisDown@cluster0-kilpn.mongodb.net/test?retryWrites=true'
const dbname = 'Castumer';
const myData={
    status:'',
    userMessage:''
}


mRoutes.route('/').get((req,res)=>{
    res.render('index');
});
mRoutes.route('/register').get((req,res)=>{
    res.render('register',myData);
}).post((req,res)=>{
    let myUser = {
        usernName:req.body.personEmail,
        userPass:req.body.personPass
    }
    let client;
    if(req.body.personPass == req.body.personRePass){
        try {
            (async function mongo(){
                client = await MongoClient.connect(url,{useNewUrlParser:true});
                const db = client.db(dbname);
                const collection = await db.collection('user');
                const check =await collection.findOne({usernName:req.body.personEmail});
                if(check){
                    try {
                      //  const data =decrypt(check.userPass) ;
                      //  res.send(data);
                      myData.status = 'is alredy excist try other email';
                      res.redirect('/register');
                        client.close();
                    } catch (error) {
                        res.send(error.message);
                    }
                }
                else{
                    const result =await collection.insertOne(myUser);
                    res.redirect("/login");
                    client.close();

                }
                
            }())
        } catch (error) {
            res.send(error);
        }
    }else{
        res.render('register');

    }
   
})
mRoutes.route('/login').get((req,res)=>{
    res.render('login',myData);
}).post((req,res)=>{
    let myUser = {
        usernName:req.body.personEmail,
        userPass:req.body.personPass
    }
    let client;

    (async function mongo(){
        try {
            client = await MongoClient.connect(url,{useNewUrlParser:true});
            const db = client.db(dbname);
            const collection = await db.collection('user');
            const check =await collection.findOne({usernName:req.body.personEmail});
            if(check){
                myData.userMessage="Welcome "+check.usernName ;
                res.render('user',myData);
            }else{
                res.redirect('/login')
            }

        } catch (error) {
            res.send(error.message);

        }
       
    }())
 
})



module.exports=mRoutes;