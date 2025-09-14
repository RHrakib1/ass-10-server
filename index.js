const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//midelware
app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qu3bi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const database = client.db("ass-10database");
const sportcollection = database.collection("ass-10-collection");


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        app.get('/sportdata', async (req, res) => {
            const databody = sportcollection.find()
            const result = await databody.toArray()
            res.send(result)
        })

        app.get('/sportdata/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await sportcollection.findOne(quary)
            res.send(result)
        })

        app.post('/sportdata', async (req, res) => {
            const databody = req.body
            const result = await sportcollection.insertOne(databody)
            res.send(result)
        })

        app.put('/sportdata/:id', async (req, res) => {
            const id = req.params.id
            const databody = req.body
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedata = {
                $set: {
                    photo: databody.photo,
                    name: databody.name,
                    countryname: databody.countryname,
                    location: databody.location,
                    description: databody.description,
                    cost: databody.cost,
                    seasonality: databody.seasonality,
                    yearcost: databody.yearcost,
                    time: databody.time,
                }
            }
            const result = await sportcollection.updateOne(filter, updatedata, options)
            res.send(result)
        })

        app.delete('/sportdata/:id', async (req, res) => {
            const id = req.params.id
            const quary = { _id: new ObjectId(id) }
            const result = await sportcollection.deleteOne(quary)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('turist is running by me ')
})

app.listen(port, () => {
    console.log(`Turizum server is running on port ${port}`)
})