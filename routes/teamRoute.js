const { Router } = require("express");
const teamController = require("../controllers/teamController");
const teamRoute = Router();

teamRoute.get("/", teamController.renderTeams);
teamRoute.get('/catch-pokemon', teamController.addPokemonGet)
teamRoute.get('/new-team', teamController.newTeamGet)
teamRoute.get('/delete-team', teamController.deleteTeamGet)
teamRoute.get('/delete-team/admin-password', teamController.adminPasswordGet)
teamRoute.post('/new-team', teamController.newTeamPost)
teamRoute.post('/catch-pokemon', teamController.addPokemonPost)
teamRoute.post('/delete-team', teamController.adminPasswordTodeletePokemonFromTeamPost)
teamRoute.post('/delete-team/admin-password', teamController.adminPasswordPost)

teamRoute.get('/delete-team/admin-password/wrong', teamController.getWrongAdminPasswordPage);

module.exports = { teamRoute }