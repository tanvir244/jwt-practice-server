const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9nu6wnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const assignmentCollection = client.db('projectAssignment').collection('createAssignment');
    const submitedAssinCollection = client.db('projectAssignment').collection('submitedAssignments');


    app.post('/create_assignments', async (req, res) => {
      const newAssignment = req.body;
      const result = await assignmentCollection.insertOne(newAssignment);
      res.send(result);
    })

    app.get('/create_assignments', async (req, res) => {
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/create_assignments/:id', async (req, res) => {
      const id = req.params.id;
      console.log('please delete id from database:', id);
      const query = { _id: new ObjectId(id) }
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/create_assignments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    })

    app.put('/create_assignments/:id', async (req, res) => {
      const id = req.params.id;
      const check = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const newData = req.body;
      const data = {
        $set: {
          title: newData.title,
          marks: newData.marks,
          difficulty_level: newData.difficulty_level,
          description: newData.description,
          image: newData.image,
          date: newData.date
        }
      }
      const result = await assignmentCollection.updateOne(check, data, options);
      res.send(result);
    })

    app.post('/submitted_assignments', async(req, res) => {
      const newSubmited = req.body;
      const result = await submitedAssinCollection.insertOne(newSubmited);
      res.send(result);
    })

    app.get('/submitted_assignments', async(req, res) => {
      const cursor = submitedAssinCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/submitted_assignments/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await submitedAssinCollection.findOne(query);
      res.send(result);
    })

    app.get('/submitted_assignmentsByEmail/:email', async(req, res) => {
      const email = req.params.email;
      const result = await submitedAssinCollection.find({email: email}).toArray();
      res.send(result);
    })

    app.get('/submitted_assignmentsByStatus/:status', async(req, res) => {
      const status = req.params.status;
      const result = await submitedAssinCollection.find({status: status}).toArray();
      res.send(result);
    })

    app.get('/submitted_assignmentsByStatus/:status/:id', async(req, res) => {
      const { status, id } = req.params; 
      const query = { _id: new ObjectId(id), status: status }; 
      const result = await submitedAssinCollection.findOne(query);
      res.send(result); 
    })

    app.put('/submitted_assignmentsByStatus/:status/:id', async (req, res) => {
      const {status, id} = req.params;
      const filter = { _id: new ObjectId(id), status: status };
      const options = { upsert: true };
      const updatedData = req.body;
      const data = {
        $set: {
          status: updatedData.status,
          quickNote: updatedData.quickNote
        }
      }
      const result = await submitedAssinCollection.updateOne(filter, data, options);
      res.send(result);
    })
    

    // app.get('/submitted_assignments/:email', async(req, res) => {
    //   const id = req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const result = await submitedAssinCollection.find(query).toArray();
    //   res.send(result);
    // })
 

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Assignment server is on going');
})

app.listen(port, () => {
  console.log(`Assignment server is running on port: ${port}`)
})