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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0wlb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const ServiceCollection = client
    .db("Programing-Hero-Team")
    .collection("service-add");
  const OrderCollection = client.db("Programing-Hero-Team").collection("order");
  const AdminCollection = client.db("Programing-Hero-Team").collection("admin");
  const ReviewCollection = client
    .db("Programing-Hero-Team")
    .collection("review");

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
      res.send(admin.length > 0);
    });
  });
  // app.get('/services', (req, res) => {
  //     ServiceCollection.find()
  //     .toArray((err, items) => {
  //         res.send(items)
  //     })
  // })

  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    console.log("adding new product: ", newOrder);
    OrderCollection.insertOne(newOrder).then((result) => {
      console.log("inserted count", result.insertedCount);
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
    // console.log(req.query.email)
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
    console.log("deleted id", id);
    ServiceCollection.findOneAndDelete({ _id: id }).then((result) => {
      result.deletedCount > 0;
    });
  });
});

app.listen(process.env.PORT || port);
