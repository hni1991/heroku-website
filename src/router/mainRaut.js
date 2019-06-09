const express = require('express');
const mRoutes = express.Router();
const session = require('express-session');
//const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const mongoF = require('./controller');
const multer  = require('multer');

//const ObjectID = require('mongodb').ObjectID;
//const {decrypt, encrypt} = require('./crepto');

const url = 'mongodb+srv://Hoseinniko:serverisDown@cluster0-kilpn.mongodb.net/test?retryWrites=true'
const dbname = 'Castumer';
const myData = {
    status: '',
    userMessage: '',
    erorrMessage: '',
    data:''
}


var checkuser;

mRoutes.route('/').get((req, res) => {
    res.render('index');
});
mRoutes.route('/register').get((req, res) => {
    res.render('register', myData);
}).post((req, res) => {
    let myUser = {
        usernName: req.body.personEmail,
        userPass: req.body.personPass
    }
    if (req.body.personPass === req.body.personRePass) {
        mongoF.addUser(myUser.usernName, myUser.userPass, (check,data) => {
            if (check == 'exsist') {
                myData.status = 'is alredy excist try other email';
                res.redirect('/register');
            } else if (check == 'add') {
                myData.data=data;
                myData.userMessage = "Welcome " + myUser.usernName;
                res.render('user', myData);
            } else if (check == 'erorr') {
                myData.status = 'server have some erorr please call support website';
                res.redirect('/register');
            }
        })
    } else {
        myData.status = 'Make sure about your password';
        res.redirect('/register');
    }
});
mRoutes.route('/login').get((req, res) => {
    res.render('login', myData);
}).post((req, res) => {
        let usernName = req.body.personEmail;
        let userPass = req.body.personPass;

        mongoF.logIn(usernName,userPass, (check,data1,user) => {
            console.log(check);
            if (check == "welcome") {
                myData.data=data1;
                req.session.myuser=user;
                req.session.admin=true;
                myData.userMessage = "Welcome " + usernName;
                console.log('login session is : '+req.session.myuser)
                res.redirect('/user');
            } else if (check == "pass") {
                myData.erorrMessage = " Your Password is incorect please Try Again !";
                res.redirect('/login');
            } else if (check == "user") {
                myData.erorrMessage = " User Name is incorect ";
                res.redirect('/login')
            }
        })
});

mRoutes.route('/delet/:id').get((req, res) => {
    let id = req.params.id
    mongoF.deletItem(id,(call)=>{
        res.redirect('/user')

    })
})



mRoutes.route('/listings-single').get((req, res) => {
    res.render('listings-single', myData);
})
mRoutes.route('/logout').get((req, res) => {
    req.session.destroy();
    console.log('destroyd')
    res.redirect('/user');
})
mRoutes.route('/user').get((req, res) => {
    if(req.session.admin){
        res.render('user', myData);
    }else{
        res.redirect('/login')
    }
})
// var storage1 = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null,Date.now()+ '-' + file.originalname)
//     }
//   })
  var upload = multer({ dest: 'uploads/' })

mRoutes.route('/uploadads').post(upload.single('imageP'),(req, res) => {
        mongoF.addAds(req.body.nameP, req.body.adressP,req.body.keywordP,req.body.categoryP,req.file.filename, (check,data) => {
            if (check == 'exsist') {
                myData.data=data;
                myData.status = 'is alredy excist ';
                res.render('user', myData);
            } else if (check == 'add') {
                myData.data=data;
                res.render('user', myData);
            } else if (check == 'erorr') {
                myData.data=data;
                myData.status = 'server have some erorr please call support website';
                res.redirect('/user');
            }
            console.log(check+'is a check')

        })
})
mRoutes.route('/update').get((req, res) => {
    res.render('updatepass', myData);
}).post((req, res) => {
        let id = req.session.myuser._id;
        let userPass = req.body.personPass;
    console.log('session is : '+id)
    console.log('new pass is : '+userPass)

        mongoF.update(id,userPass, (check) => {
            console.log(check);
            if (check == "done") {
                res.send('Done!!');
            } else if (check == "erorr") {
             res.send('Erorr !!!')
            } 
        })
});

module.exports = mRoutes;