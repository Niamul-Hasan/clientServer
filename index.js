const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.DB_PASS}@cluster0.sc0zrcq.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const databaseCollection = client.db("Jute_Product").collection('example');
        const ProductCollection = client.db("Jute_Product").collection('products');


        // const exData = {
        //     name: "Mina Razu",
        //     email: "mina@mithu.com",
        // }
        // const result = await databaseCollection.insertOne(exData);



        app.get('/get', async (req, res) => {
            const query = {};
            const cursor = databaseCollection.find(query);
            const data=await cursor.toArray();
            res.send(data);
            console.log('data are colllecting');
        })

        app.post('/add',async(req,res)=>{
            const data=req.body;
            const addData= await databaseCollection.insertOne(data);
            res.send(addData);
        })

        app.post('/products',async(req,res)=>{
            const product=req.body;
            const result=await ProductCollection.insertOne(product);
            res.send(result);
        })

        app.get('/products',async(req,res)=>{
            const query={};
            const products= await ProductCollection.find(query).toArray();
            res.send(products);
        })
        app.get('/products/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)};
            const result=await ProductCollection.findOne(query);
            res.send(result);

        })
        // app.get('/products',async(req,res)=>{
        //     const catagory=req.query.qCatagory;
        //     const query={catagory:catagory};
        //     const products= await ProductCollection.find(query).toArray();
        //     res.send(products);
        //     console.log(catagory);
        // })

        app.get('/other/:catagory',async(req,res)=>{
            const catagory=req.params.catagory;
            const query={catagory};
            const otherData=await ProductCollection.find(query).toArray();
            res.send(otherData);
        })

        
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello From Client Server')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})