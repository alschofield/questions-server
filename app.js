const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
var url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.y11xi.mongodb.net?retryWrites=true&w=majority`;

const client = new MongoClient(url);

const app = express()

app.use(helmet())

app.use(cors({
  origin: 'https://questions.alschofield.vercel.app'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json("https://www.youtube.com/watch?v=OnG7oL9Gg4o")
})

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

app.post('/comments/:id', (req, res) => {
  client.connect((e) => {
    const db = client.db('comments')
    const collection = db.collection('comments')

    const _id = (req.params.id === 'new') ? new ObjectID() : req.params.id

    collection.updateOne({ _id : _id }, { $set: { ...req.body } }, { upsert: true }, (_e, resp) => {
      if (_e) {
        res.json(_e);
      } else {
        res.json(resp);
      }
    })
  })
})

app.listen(8080, () => {
  console.log('comments service listening on 8080')
})
