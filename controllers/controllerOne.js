const dbQueries = require('../db/queries')

async function renderIndex(req, res) {
  try {
    res.render("pageOne", {
       title: "Route One Index",
       teams: await dbQueries.dbGetAllTeams(),
       ballSize: '50px'
     });
    } catch (error) {
    console.error(error);
    res.render("pageOne", { title: "Route One Index" });
  }
}

async function addPokemonPost(req, res) {
  let name = 'ash'
  try {
    if(await dbQueries.checkIfTeamIsFull(name)) {
      console.log('full')
      return
    }
    await dbQueries.addPokemonToTeam(name, req.body.name);
    res.redirect('/'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding Pokémon');
  }
}

module.exports = {
  renderIndex,
  addPokemonPost
}