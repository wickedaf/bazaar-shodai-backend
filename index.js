const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
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
    
  app.post('/addItem', (req, res) => {
        const reqBody = req.body;
        console.log(reqBody);
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
  console.log('Database Connected:', client.isConnected());
//   client.close();
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})