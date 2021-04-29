const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const port = 7200;
const uri = `mongodb+srv://hossain:hossain1234@cluster0.vxjbg.mongodb.net/hossainsEvent?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // perform actions on the collection object
  const packageCollection = client.db("hossainsEvent").collection("packages");
  const testimonialCollection = client.db("hossainsEvent").collection("testimonial");
  const orderCollection = client.db("hossainsEvent").collection("orders");
  

  // setting post for insert a collection

  app.post('/addPackage',(req,res)=>{
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const duration = req.body.duration;
    const price = req.body.price;
    const key = req.body.key;
    const packageType = req.body.packageType;
    

    const newImg = file.data;
    const encImg = newImg.toString('base64');

    const image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
    packageCollection.insertOne({title,description,duration,price,packageType,key,image })
    .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0);
    })
}) 

app.post('/addTestimonial',(req,res)=>{
    const file = req.files.file;
    const name = req.body.name;
    const message = req.body.message;

    const newImg = file.data;
    const encImg = newImg.toString('base64');

    const image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
    testimonialCollection.insertOne({ name,message,image })
    .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0);
    })
}) 
  
  //getting all packages
  app.get('/packages', (req, res) => {
    packageCollection.find({})
        .toArray((err, documents) => {
            console.log(documents)
            res.send(documents);
        })
})
//deleting packages
/ app.delete('/delete/:id',(req,res)=>{
    const {id} = req.params
    packageCollection.deleteOne({_id: ObjectId(id)})
    .then(result =>{
     res.send(result.deletedCount >0)
    })
  }) 
//deleting testimonial 
app.delete('/delete/:id',(req,res)=>{
   /*  const {id} = req.params */
    testimonialCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
     res.send(result.deletedCount >0)
    })
  })

  //deleting orders
/ app.delete('/delete/:id',(req,res)=>{
    const {id} = req.params
    orderCollection.deleteOne({_id: ObjectId(id)})
    .then(result =>{
     res.send(result.deletedCount >0)
    })
  }) 
 
  //getting all testimonial
  app.get('/testimonial', (req, res) => {
    testimonialCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})
//adding order from booking page
app.post('/addOrder',(req,res)=>{
    const order =req.body
   orderCollection.insertOne(order) 
    .then(result =>{
   res.send(result.insertedCount>0)

  }) 
  })
    //getting all order
    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
  
});

app.get('/', (req, res) => {
    res.send("hello from db it's working hossains event-managements system ")
})
  

app.listen(process.env.PORT || port)


