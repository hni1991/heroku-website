const {MongoClient,ObjectID} = require('mongodb');
const bcrypt = require('bcrypt');

const url = 'mongodb+srv://Hoseinniko:serverisDown@cluster0-kilpn.mongodb.net/test?retryWrites=true'
const dbname = 'Castumer';
const dbnamee = 'MyAds';



function logIn(email ,password,call){
    (async function mongo(){
        let client;
        try {
            client = await MongoClient.connect(url,{useNewUrlParser:true});
            const db = client.db(dbname);
            const collection = await db.collection('user');
            const data = await collection.find().toArray();
            const check = await collection.findOne({usernName:email});
            console.log(check)
            if(check){
                console.log("password is "+password);
                console.log("hash is "+check.userPassword);

                    let decode = await bcrypt.compare(password,check.userPassword)
                     if(decode){
                        console.log("decode is "+decode);

                        call ("welcome",data,check) 
                    }
                    else{
                        console.log("decode is "+decode);

                        call("pass")
                    }
                    
            }else{
                call('user')
            }

        } catch (error) {
            console.log(error.message);
        }
       
    }());
}

function addUser(email,password,call){
    (async function mongo(){
        let client;
        try {
            client = await MongoClient.connect(url,{useNewUrlParser:true});
            const db = client.db(dbname);
            const collection = await db.collection('user');
            const data = await collection.find().toArray();
            const check =await collection.findOne({usernName:email});
            if(check){
                client.close();
                call('exsist')
            }
            else{
                console.log(data)
                let hash = bcrypt.hashSync(password, 10);
                let addresult = await collection.insertOne({usernName:email,userPassword:hash});
                client.close();
                call('add',data);
            }
           
        } catch (error) {
            console.log(error.message);
            client.close();
            call ('erorr');
        }
    }())
}

//
//Add Ads
function addAds(name,adress,keyword,category,image,call){
    (async function mongo(){
        let client;
        try {
            client = await MongoClient.connect(url,{useNewUrlParser:true});
            const db = client.db(dbnamee);
            const collection = await db.collection('Ads');
            const check =await collection.findOne({nameP:name});
            if(check){
                client.close();
                call('exsist')
            }
            else{
               // console.log(data)
                let objadd = await collection.insertOne(
                    {nameP:name,
                    adressP:adress,
                    keywordP:keyword,
                    categoryP:category,
                    imageP:'/uploads'+image
                });
               // const data = await collection.find().toArray();
                client.close();
                call('add');
            }
           
        } catch (error) {
            console.log(error.message+' faking erorr from control');
            client.close();
            call ('erorr');
        }
    }())
}
//

function deletItem(id,call){
  

    (async function mongo(){
        let client;
    
        try {
            client = await MongoClient.connect(url,{useNewUrlParser:true});
            const db = client.db(dbname);
            const collection = await db.collection('user');
           // const obj = await collection.findOne({_id:objId}).toArray();
           const check =await collection.deleteOne({_id:new ObjectID(id)});
           console.log( "id is "+ check)

            if(check){
                client.close();
                console.log(check)
                call('delet')
            }
            else{
                client.close();
                call('lost')  ;
            }
           
        } catch (error) {
            console.log(error.message);
            client.close();
            call ('erorr');
        }
    }());
}

function update(id1,pas,call){
    (async function mongo(){
        let client;
        try {
            client = await MongoClient.connect(url,{useNewUrlParser:true});
            let db =await client.db(dbname);
            let update = await db.collection('user').updateOne({_id:new ObjectID(id1)},{$set:{userPassword:pas}});
            console.log('in controler befor update result id is : '+id1)
            if(update){
                console.log('update message is : '+update)
                call('done')
            }else{
                call('erorr')
            }
            
        } catch (error) {
            console.log('erorr for update is : '+error.message)
        }
    }())
}
module.exports={logIn ,addUser,deletItem,addAds,update }