const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gspcn8d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const formCollection = client.db("form-builder").collection("forms");

        // Forms get API
        app.get('/forms', async (req, res) => {
            const cursor = formCollection.find();
            const result = await cursor.find().toArray;
            res.send(result);
        })

        // Form post API
        app.post('/forms', async(req, res) => {
            const data = req.body;
            const result = await formCollection.insertOne(data);
            res.send(result);
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Form builder server is running")
})

app.listen(port, (req, res) => {
    console.log(`Form builder server running on the port ${port}`);
})