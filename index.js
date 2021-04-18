const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;

const port = 5000;
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyhh2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const ServiceCollection = client.db("service").collection("service-add");
  const OrderCollection = client.db("service").collection("order");
  const AdminCollection = client.db("service").collection("admin");
  const ReviewCollection = client.db("service").collection("review");

  app.post("/addService", (req, res) => {
    const newService = req.body;
    console.log("adding new product: ", newService);
    ServiceCollection.insertOne(newService).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    ServiceCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const newService = req.body;
    console.log("adding new product: ", newService);
    AdminCollection.insertOne(newService).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    AdminCollection.find({ email: email }).toArray((err, admin) => {
      res.send(admin);
    });
  });
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    OrderCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orderDetails", (req, res) => {
    console.log(req.query.email);
    OrderCollection.find({ email: req.query.email }).toArray(
      (err, documents) => {
        res.send(documents);
      }
    );
  });
  app.get("/allOrderDetails", (req, res) => {
    OrderCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/update/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    const data = req.body;
    OrderCollection.findOneAndUpdate(
      { _id: id },
      { $set: { status: data.status } }
    )
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    console.log("adding new product: ", newReview);
    ReviewCollection.insertOne(newReview).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/allReviews", (req, res) => {
    ReviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  app.delete("/delete/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    ServiceCollection.findOneAndDelete({ _id: id }).then((documents) =>
      res.send(!!documents.value)
    );
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
