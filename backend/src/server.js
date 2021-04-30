const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const driver = neo4j.driver('bolt://3.88.135.113:7687', neo4j.auth.basic('neo4j', 'boat-structure-meridian'))
const session = driver.session();

session
  .run('match (n) return n')
  .subscribe({
    onKeys: keys => {
      console.log(keys)
    },
    onNext: record => {
      console.log(record.get('n'))
    },
    onCompleted: () => {
      console.log("Neo4J connection established successfully");
      session.close() // returns a Promise
    },
    onError: error => {
      console.log(error)
    }
  })

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
