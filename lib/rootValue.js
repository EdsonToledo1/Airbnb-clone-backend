const connectDB = require("./db");
const { ObjectId } = require("mongodb");
const errorHandler = require("./errorHandler");

const rootValue = {
  getHomes: async (args) => {
    let db;
    let homes = [];
    try {
      db = await connectDB();
      homes = await db
        .collection("home")
        .aggregate([{ $sample: { size: args.limit } }])
        .toArray();
    } catch (err) {
      errorHandler(err);
    }

    return homes;
  },
  getHomesFrom: async ({ locationIds, date }) => {
    let db;
    let homes = [];

    try {
      db = await connectDB();
      if (date) {
        let checkin = new Date(date.checkin).getTime();
        let checkout = new Date(date.checkout).getTime();

        homes = await db
          .collection("home")
          .find({
            locationId: { $in: locationIds },
            busyDates: { $not: { $gte: checkin, $lte: checkout } },
          })
          .toArray();
      } else {
        homes = await db
          .collection("home")
          .find({ locationId: { $in: locationIds } })
          .toArray();
      }
    } catch (err) {
      errorHandler(err);
    }

    return homes;
  },
  getHome: async (args) => {
    let db;
    let home;

    try {
      db = await connectDB();
      home = await db.collection("home").findOne({ _id: ObjectId(args.id) });
    } catch (err) {
      errorHandler(err);
    }

    return home;
  },
  getUsers: async () => {
    let db;
    let users = [];

    try {
      db = await connectDB();
      users = await db.collection("user").find().toArray();
    } catch (err) {
      errorHandler(err);
    }

    return users;
  },
  getUser: async (args) => {
    let db;
    let user;

    try {
      db = await connectDB();
      user = await db.collection("user").findOne({ _id: ObjectId(args.id) });
    } catch (err) {
      errorHandler(err);
    }

    return user;
  },
  validateUser: async ({ email, password }) => {
    let db;
    let user;

    try {
      db = await connectDB();
      user = await db.collection("user").findOne({ email: email });

      if (user) {
        let isCredentialOk = await db.collection("user").findOne({
          email: email,
          password: password,
        });

        if (isCredentialOk) {
          return {
            userExists: true,
            userId: user._id,
          };
        } else {
          return {
            userExists: true,
            userId: "",
          };
        }
      }
    } catch (err) {
      errorHandler(err);
    }

    return {
      userExists: false,
      userId: "",
    };
  },
  getLocations: async () => {
    let db;
    let locations = [];

    try {
      db = await connectDB();
      locations = await db.collection("location").find().toArray();
    } catch (err) {
      errorHandler(err);
    }

    return locations;
  },
  getLocationsFrom: async ({ locationName }) => {
    let db;
    let locations = [];

    try {
      db = await connectDB();
      locations = await db
        .collection("location")
        .find({
          $or: [
            { country: new RegExp(locationName, "i") },
            { city: new RegExp(locationName, "i") },
            { town: new RegExp(locationName, "i") },
          ],
        })
        .toArray();
    } catch (err) {
      errorHandler(err);
    }

    return locations;
  },
  getLocation: async (args) => {
    let db;
    let location;

    try {
      db = await connectDB();
      location = await db
        .collection("location")
        .findOne({ _id: ObjectId(args.id) });
    } catch (err) {
      errorHandler(err);
    }

    return location;
  },
  getEvaluations: async (args) => {
    let db;
    let evaluations;

    try {
      db = await connectDB();
      evaluations = await db
        .collection("evaluation")
        .aggregate([{ $sample: { size: args.limit } }])
        .toArray();
    } catch (err) {
      errorHandler(err);
    }

    return evaluations;
  },
  createHome: async ({ input }) => {
    let db;
    let home = {
      ...input,
      evaluations: [],
      averageEvaluation: 0.0,
      busyDates: [],
    };

    try {
      db = await connectDB();
      const insertedHome = await db.collection("home").insertOne(home);
      home._id = insertedHome.insertedId;
    } catch (err) {
      errorHandler(err);
    }

    return home;
  },
  createUser: async ({ input }) => {
    let db;
    let user;

    try {
      db = await connectDB();
      user = await db.collection("user").insertOne(input);
      input._id = user.insertedId;
    } catch (err) {
      errorHandler(err);
    }

    return input;
  },
  createLocation: async ({ input }) => {
    let db;
    let location;

    try {
      db = await connectDB();
      location = await db.collection("location").insertOne(input);
      input._id = location.insertedId;
    } catch (err) {
      errorHandler(err);
    }

    return input;
  },
};

module.exports = rootValue;
