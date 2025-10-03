const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb://ALPHA_007:AlphaPass123@ac-xt218xt-shard-00-00.g0qjmp1.mongodb.net:27017,ac-xt218xt-shard-00-01.g0qjmp1.mongodb.net:27017,ac-xt218xt-shard-00-02.g0qjmp1.mongodb.net:27017/guviDB?ssl=true&replicaSet=atlas-851f00-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 10000,
});

const dbName = "guvi_profiles";   
const collectionName = "users";   

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db(dbName);
    const users = db.collection(collectionName);

    app.get("/profile/:userId", async (req, res) => {
      try {
        const userId = req.params.userId; 
        const profile = await users.findOne({ userId });

        if (!profile) {
          return res.json({ success: false, message: "Profile not found" });
        }

        res.json({ success: true, profile });
      } catch (err) {
        console.error("GET Error:", err);
        res.status(500).json({ success: false, message: "Error fetching profile" });
      }
    });

    app.post("/profile", async (req, res) => {
      try {
        const { userId, age, dob, contact, address } = req.body;

        if (!userId) {
          return res.json({ success: false, message: "Missing userId" });
        }

        await users.updateOne(
          { userId: userId },
          { $set: { age, dob, contact, address } },
          { upsert: true }
        );

        res.json({ success: true, message: "Profile updated" });
      } catch (err) {
        console.error(" POST Error:", err);
        res.status(500).json({ success: false, message: "Error updating profile" });
      }
    });

    app.listen(4000, () => {
      console.log(" Node server running at http://localhost:4000");
    });
  } catch (err) {
    console.error(" MongoDB Error:", err);
  }
}

main();
