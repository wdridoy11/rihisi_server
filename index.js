const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v2v9b72.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const doctorCollection = client.db("doctor-booking").collection("doctor-services");
    const bookingCollection = client.db("doctor-booking").collection("doctor-bookings");

    // all doctors data get api
    app.get("/doctors", async (req, res) => {
      const cours = doctorCollection.find();
      const result = await cours.toArray();
      res.send(result);
    });

    // specific doctor data get api
    app.get("/doctor/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await doctorCollection.findOne(query);
      res.send(result);
    });


  /*===================================
            Booking system api
    ===================================*/
    // Patient booking data post and status value add
    app.post("/bookings", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne({newBooking,status:"pending"});
      res.send(result);
    });

    app.patch("/booking/:id",async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = { $set: { status: "approved" } };
      const result = await bookingCollection.updateOne(query, updateDoc);
      res.send(result);
    })



    // doctor booking data get api using doctorEmail for a specific doctor
    app.get("/bookings", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { "newBooking.doctorEmail": req.query.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // mongodb get specific data
    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });

    //mongodb remove booking data
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is open now");
});

app.listen(port, () => {
  console.log(`Server is running port: ${port}`);
});