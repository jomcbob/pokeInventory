const { Router } = require("express");
const routeOneController = require("../controllers/controllerOne");
const routeOne = Router();

routeOne.get("/", routeOneController.renderIndex);
routeOne.post('/add-pokemon', routeOneController.addPokemonPost)

module.exports = { routeOne }