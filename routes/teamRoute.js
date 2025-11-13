const { Router } = require("express");
const teamController = require("../controllers/teamController");
const teamRoute = Router();

teamRoute.get("/", teamController.renderTeams);
teamRoute.get('/catch-pokemon', teamController.addPokemonGet)
teamRoute.get('/new-team', teamController.newTeamGet)
teamRoute.post('/new-team', teamController.newTeamPost)
teamRoute.post('/catch-pokemon', teamController.addPokemonPost)

module.exports = { teamRoute }