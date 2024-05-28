const route = require('express').Router();

// Require the controllers
var teamControllers = require('../controllers/TeamController.js');

// Create CRUD endpoints for user
route.post('/createTeam', teamControllers.createTeam);
route.delete('/deleteTeam/:parameter', teamControllers.deleteTeam);

route.get('/getTeams', teamControllers.getTeams);
route.patch('/addPoint', teamControllers.addPoint);
route.patch('/toggleTeam', teamControllers.toggleTeam);

route.patch('/resetTeams', teamControllers.resetTeams);

module.exports = route;