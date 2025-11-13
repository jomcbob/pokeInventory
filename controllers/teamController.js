const dbQueries = require('../db/queries')

const loadArrayOfPokemonNames = async () => {
  return pokemons = await dbQueries.dbGetAllPokemonNames()
}

async function renderTeams(req, res) {
  try {
    res.render("teams", {
       title: "Teams",
       teams: await dbQueries.dbGetAllTeams(),
       ballSize: '50px'
     });
    } catch (error) {
    console.error(error);
    res.render("error", { error });
  }
}

async function addPokemonPost(req, res, next) {
  try {
    if(await dbQueries.checkIfTeamIsFull(req.body.trainerName) === false) {
      await dbQueries.addPokemonToTeam(req.body.trainerName, req.body.caughtPokemon);
    }
    res.redirect('/teams'); 
  } catch (err) {
    console.error(err);
    res.status(500)
    next(err)
  }
}

async function addPokemonGet(req, res) {
  res.render('catchPokemon', { trainerName: req.query.trainerName, title: "Catch Pokemon", pokemons: await loadArrayOfPokemonNames() })
}

async function newTeamGet(req, res) {
  res.render("newTeam", { title: "New Team" })
}

async function newTeamPost(req, res) {
  await dbQueries.addTrainer(req.body.trainerName)
  await dbQueries.addPokemonToTeam(req.body.trainerName, await dbQueries.dbGetRandomPokemonName())
  res.redirect("/teams")
}

module.exports = {
  renderTeams,
  addPokemonPost,
  addPokemonGet,
  newTeamGet,
  newTeamPost
}