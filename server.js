require("dotenv").config();
const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const rootValue = require("./lib/rootValue");
const cors = require("cors");
const fs = require("fs");

const schema = buildSchema(fs.readFileSync("./lib/schema.graphql", "utf8"));

const app = express();
const PORT = process.env.PORT || 8000;
const isDev = process.env.NODE_ENV !== "production";

app.use(express.json());
app.use(cors());

app.use("/api/v1", graphqlHTTP({ schema, rootValue, graphiql: isDev }));

app.listen(PORT, () => {
  console.log(`Listening from port ${PORT}`);
});
