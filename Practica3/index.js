const express = require("express");
const path = require("path");
const app = express();
const Sala = require('./src/models/salasmodel');
const User = require('./src/models/usersmodel');
const port = 3000;
//swagger\
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition:{
        swagger: "2.0",
        info: {
            title:"Swagger Test API",
            description: "API for swagger documentation",
            version: "1.0.0",
            servers: ['http://localhost:'+port],
            contact: {
                name: "JMLA",
                email: "is716730@hotmail.com"
            }
        }
    },
    apis: ['index.js']
}


const swaggerDocs = swaggerJsDoc(swaggerOptions); 
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}



app.use('/assets', express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.get("/", (req, res) => {
    res.status(200).send("Backend running.....");
  });
  
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  });

  const mongoose = require('mongoose');
  
  const uri = "mongodb+srv://JML:iteso@cluster0.ajkpk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((result) => console.log("connected to DataBase..."))
      .catch((err) => console.log(err));
  
  //Users routes

/** 
 * @swagger
 * /create-user:
 *  post:
 *    description: create an user
 *    parameters:
 *      - in: body
 *        name: username
 *        description: email of the user
 *        type: string
 *      - in: body
 *        name: password
 *        description: users password
 *        type: string
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
  app.post('/create-user', (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    const user = new User({
        correo: req.body.email,
        password: req.body.password
    });
    
    user.save()
        .then((result => {
            res.send(result);
        })
        )
        .catch((err) => console.log(err))
})

//Loging
/** 
 * @swagger
 * /users-login/:email:
 *  get:
 *    description: gerts user's data from db and validates its access
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.get('/users-login/:email', (req,res) => {
    User.findOne({"email" : req.params.email})
    .then((result) => {
        
        if(result.password === req.body.password){
            res.send("User logged in....")
            console.log(result.password)
            console.log(req.body.password)
        }else{
            res.send("User failed to login...")
            console.log(result.password)
            console.log(req.body.password)
        }
    })
    .catch((err) => console.log(err));    
});


  //Sala routes
//Create sala
/** 
 * @swagger
 * /create-sala:
 *  post:
 *    description: creates a sala 
 *    parameters:
 *      - in: body
 *        name: name
 *        description: sala name
 *        type: string  
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
  app.post('/create-sala', (req, res) => {
    const sala = new Sala({
        salaId: req.body.id,
        salaName: req.body.name,
        messages: req.body.messages,
        owner: req.body.correo,
        salaUrl: null
    });

    sala.save()
        .then((result => {
            res.send(result);
        })
        )
        .catch((err) => console.log(err))
});


/** 
 * @swagger
 * /sala-message/:id:
 *  put:
 *    description: update a session
 *    parameters:
 *      - in: body
 *        messages: message
 *        description: creates a message and updates the database
 *        type: string
 *      - in: body
 *        name: date
 *        description: message date
 *        type: string
 *      - in: body
 *        name: email
 *        description: user email
 *        type: string
 *      -in: body
 *        url : url
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.put('/sala-message/:id', (req,res) => {//Create messages
    Sala.findOne({"salaId" : req.params.id})
    .then((result) => {
        const array = result.messages;
        array.push(req.body)
        result.messages = array;
        result.url = "http://127.0.0.1:3000/join-sala/"+req.params.id;
        
        Sala.findOneAndUpdate({"salaId" : req.params.id}, result, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved...');
        });
    })
});
//create link

/** 
 * @swagger
 * /sala/:id/link:
 *  get:
 *    description: creates a url for a user to join 
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.get('/sala/:id/link', (req,res) => {
    let salaUrl = "http://127.0.0.1:3000/join-sala/" + req.params.id
    Sala.findByIdAndUpdate(req.header('salaId'), {url : salaUrl}, (err, result) =>{
        if(err){
            res.send(err);
        }else{
            res.send(salaUrl);
        }
    })
    .then((result) => {
        return result;
    })
    .catch((err) => console.log(err))
    
});


//join sala by id
/** 
 * @swagger
 * /join-sala/:id:
 *  get:
 *    description: user joins sala , which displays messages
 *    responses:
 *      200:
 *        description: success response
 *      400:
 *        description: bad data request
*/
app.get('/join-sala/:id', (req,res) => {
    Sala.findOne({"salaId" : req.params.id})
    .then((result) => {
        res.send(result.messages)
    })
    .catch((err) => console.log(err))
});