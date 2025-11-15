const { Pool } = require("pg");
require("dotenv").config();
const { argv } = require('node:process');

const target = argv[2];
console.log("Runnning on" + " " + target)

const connectionString =
  target === "local"
    ? process.env.LOCAL_DATABASE_URL
    : process.env.DATABASE_URL;

module.exports = new Pool({
  connectionString,
});