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
    if (await dbQueries.checkIfTeamIsFull(req.body.trainerName) === false) {
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

async function newTeamPost(req, res, next) {
  try {
    const trainerName = req.body.trainerName.trim();

    if (!trainerName) {
      const err = new Error("Trainer name must be a valid name")
      err.status = 403
      return next(err)
    }

    const result = await dbQueries.addTrainer(trainerName)
    if (result === false) {
      const err = new Error("Trainer name already exists")
      err.status = 403
      return next(err)
    }

    const randomPokemon = await dbQueries.dbGetRandomPokemonName()
    await dbQueries.addPokemonToTeam(trainerName, randomPokemon)

    res.redirect("/teams")
  } catch (error) {
    next(error);
  }
}

async function deleteTeamGet(req, res) {

  const teamMembers = await dbQueries.dbGetPokemonTeam(req.query.trainerName);

  res.render("deleteTeam", {
    title: "Delete Teams",
    trainerName: req.query.trainerName,
    teamMembers
  });
}

async function adminPasswordGet(req, res) {

  res.render("adminPassword", {
    trainerName: req.query.trainerName,
    pokemonName: req.query.pokemonName,
    toBeDeleted: req.query.toBeDeleted,
    title: "Admin Password"
  });
}

async function adminPasswordPost(req, res, next) {
  const { adminPassword, toBeDeleted, trainerName, pokemonName } = req.body;

  if (adminPassword === process.env.ADMIN_PASSWORD && toBeDeleted.toLowerCase() === 'pokemon') {
    return deleteAfterAdminPassword(req, res, 'pokemon');
  } else if (adminPassword === process.env.ADMIN_PASSWORD && toBeDeleted.toLowerCase() === 'team') {
    return deleteAfterAdminPassword(req, res, 'team');
  } else {
    res.status(401).redirect(
    '/teams/delete-team/admin-password/wrong?trainerName=' +
    encodeURIComponent(trainerName) +
    '&pokemonName=' +
    encodeURIComponent(pokemonName) +
    '&toBeDeleted=' +
    encodeURIComponent(toBeDeleted)
  );
  }
}

async function getWrongAdminPasswordPage(req, res) {
  const { trainerName, pokemonName, toBeDeleted } = req.query;
  res.render("wrongAdmin", { trainerName, pokemonName, toBeDeleted });
}

async function adminPasswordTodeletePokemonFromTeamPost(req, res, next) {
  res.redirect(
    '/teams/delete-team/admin-password?trainerName=' +
    encodeURIComponent(req.body.trainerName) +
    '&pokemonName=' +
    encodeURIComponent(req.body.pokemonName) +
    '&toBeDeleted=' +
    encodeURIComponent(req.body.toBeDeleted)
  );
}

async function deleteAfterAdminPassword(req, res, toBeDeleted) {
  if (toBeDeleted.toLowerCase() === 'pokemon') {
    await dbQueries.deletePokemonFromTeam(req.body.trainerName, req.body.pokemonName);
    if (await dbQueries.lastPokemonOnTeamDeleted(req.body.trainerName)) {
      await dbQueries.deleteTeam(req.body.trainerName);
      res.redirect('/teams');
      return
    }
    res.redirect('/teams/delete-team?trainerName=' + encodeURIComponent(req.body.trainerName));
    return
  } else if (toBeDeleted.toLowerCase() === 'team') {
    await dbQueries.deleteTeam(req.body.trainerName)
    res.redirect('/teams');
  }
}


module.exports = {
  renderTeams,
  addPokemonPost,
  addPokemonGet,
  newTeamGet,
  newTeamPost,
  deleteTeamGet,
  adminPasswordTodeletePokemonFromTeamPost,
  adminPasswordGet,
  adminPasswordPost,
  getWrongAdminPasswordPage
}