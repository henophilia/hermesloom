import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import fs from "fs-extra";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGODB_URI as string);

(async () => {
  await mongoClient.connect();
  const db = mongoClient.db("henophilia");
  const foundationsDeCollection = db.collection("foundations-de");

  /*const foundations = foundationsDeCollection.find({});

  const out = [];
  for await (const foundation of foundations) {
    if (foundation.name.includes("<br>")) {
      out.push({ id: foundation._id.toString(), name: foundation.name });
    }
  }

  await fs.writeJSON("foundations.json", out, { spaces: 2 });*/

  const foundations = await fs.readJSON("foundations.json");
  for (const foundation of foundations) {
    await foundationsDeCollection.updateOne(
      { _id: new ObjectId(foundation.id) },
      { $set: { name: foundation.name } }
    );
  }

  await mongoClient.close();
})();
