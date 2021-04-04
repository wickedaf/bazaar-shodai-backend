const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4200;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());


const { DB_USER, DB_PASS, DB_NAME} = process.env;


const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.iohsv.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Backend Server is Running!!')
})


client.connect(err => {
  const itemsCollection = client.db("bazaarShodai").collection("items");
  const cartCollection = client.db("bazaarShodai").collection("cart");
    
  app.post('/addItem', (req, res) => {
        const reqBody = req.body;
        itemsCollection.insertOne(reqBody)
        .then(result => {
        console.log(result.insertedCount);
          res.send(result.insertedCount > 0);
        })
  })
  app.get('/allItems', (req, res) => {
      itemsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })

  })

  app.get('/userCart', (req, res) => {
    cartCollection.find({'user.email': req.query.mail})
    .toArray((err, documents) => {
      res.send(documents);
    })
})

  app.post('/addCart', (req, res) => {
    cartCollection.insertOne(req.body)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  app.delete('/deleteItem/:id', (req,res) => {
    itemsCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(!!result.ok > 0 );
    })
  })
  console.log('Database Connected:', client.isConnected());
//   client.close();
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})