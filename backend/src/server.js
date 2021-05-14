const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const queryRouter = require('./routes/requirements');
app.use('/requirements', queryRouter);

const driver = neo4j.driver('bolt://localhost:7687',
                  neo4j.auth.basic('neo4j', 'root'), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});
const session = driver.session();
console.log("Neo4J connection established successfully");

session.close() // returns a Promise


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
