require('dotenv').config();
const express = require("express");
const app = express();
const path = require("node:path");
const { teamRoute } = require("./routes/teamRoute");
const { routeTwo } = require("./routes/routeTwo");
const { routeThree } = require("./routes/routeThree");
const dbQueries = require('./db/queries');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/teams", teamRoute);
app.use("/two", routeTwo);
app.use("/three", routeThree);
app.get("/", async (req, res, next) => {
  try {
    const numberOfPokemonOnAllTeams = await dbQueries.numberOfPokemonOnAllTeams();
    const numberOfTeams = await dbQueries.numberOfTeams();  
    res.render("index", { title: "Home", numberOfPokemonOnAllTeams, numberOfTeams });
  } catch (err) {
    next(err);
  }
});
app.get('/{*splat}', (req, res, next) => {
  const err = new Error(`Page not found: ${req.originalUrl}`);
  err.statusCode = 404
  next(err)
});

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render('error', { title: 'Error', error: err});
});
