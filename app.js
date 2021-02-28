const express = require('express')
const helmet = require("helmet")
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.y11xi.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(url);

const app = express()

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/comments', (req, res) => {
  client.connect((e) => {
    const db = client.db('comments')
    const collection = db.collection('comments')

    collection.find({}).toArray((_e, comments) => {
      if (_e) {
        res.json(_e)
      } else {
        res.json(comments)
      }
    })
  })
})

app.post('/comments', (req, res) => {
  client.connect((e) => {
    const db = client.db('comments')
    const collection = db.collection('comments')

    // field validation
    //  - only allow
    //    - text/value
    //    - date
    //    - type
    //    - sub comments

    collection.updateOne({ _id : req.body._id }, { $set: { ...req.body } }, { upsert: true }, (_e) => {
      if (_e) {
        res.json(_e);
      } else {
        res.json({
          status: 'created'
        });
      }
    })
  })
})

app.listen(8000, () => {
  console.log('comments service listening on 8000')
})
