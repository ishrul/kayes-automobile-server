const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
var cors = require("cors");

const app = express();
const port = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ${process.env.DB_USER}:${process.env.DB_PASS}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsezq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ____________________________________________________________________

async function run() {
  try {
    await client.connect();
    const database = client.db("KayesAutomobile");
    const servicesCollection = database.collection("Services");

    // GET API
    app.get("/services", async (req, res) => {
      const result = servicesCollection.find({});
      const services = await result.toArray();
      res.send(services);
    });

    // GET SINGLE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service");
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.json(result);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    // DELETE SINGLE SERVICE
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service");
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// ____________________________________________________________________

app.get("/", (req, res) => {
  res.send("Running kayes Automobile Server");
});

app.listen(port, () => {
  console.log(`Running kayes Automobile Server on "http://localhost:${port}"`);
});
