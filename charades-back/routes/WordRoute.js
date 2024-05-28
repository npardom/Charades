const route = require('express').Router();

// Require the controllers
var wordControllers = require('../controllers/WordController.js');

// Create CRUD endpoints for word
route.post('/createWord', wordControllers.createWord);
route.get('/getWords/:parameter', wordControllers.getWords);
route.get('/getRandomWord/:parameter', wordControllers.getRandomWord);
route.get('/getRandomWordFromAnyCategory', wordControllers.getRandomWordFromAnyCategory);
route.patch('/toggleWord', wordControllers.toggleWord);

route.patch('/resetWords', wordControllers.resetWords);

module.exports = route;