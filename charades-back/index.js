// Require express and create an instance of it
const express = require("express");
const app = express();

// Use the CORS middleware  
const cors = require("cors");
app.use(cors());

// JSON Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Create connection to MongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/charades", {})
.then(() => { console.log('Connected to MongoDB') })
.catch((err) => { console.log('Error connecting to MongoDB', err.message) })

// Use the routes
const TeamRoutes = require("./routes/TeamRoute");
const WordRoutes = require("./routes/WordRoute");
app.use("/team", TeamRoutes);
app.use("/word", WordRoutes);

// Populate the database with teams
const Team = require("./models/TeamModel");
const teams = {
  "Einstein":"https://static.nationalgeographic.es/files/styles/image_3200/public/01_genius_quiz_einstein.jpg?w=1900&h=2427",
  "Hipocrates":"https://lh5.googleusercontent.com/proxy/67qlBPmgCl3qmvGIHR3v2W9ursVue7p5KF4GojhoAIOI-mhGmwkZwHw61YT-o1X8B1bfkT22feotcQ6WfK6VoAj0PQtJoYhx8nrKhoMKW29CkogdMOtk3vdjMFqDi4Z6",
  "Newton":"https://upload.wikimedia.org/wikipedia/commons/3/3b/Portrait_of_Sir_Isaac_Newton%2C_1689.jpg",
  "Tesla":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tesla_circa_1890.jpeg/220px-Tesla_circa_1890.jpeg",
  "Curie":"https://upload.wikimedia.org/wikipedia/commons/5/51/Marie_Curie_%281900%29.jpg",
  "Galileo":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg/1200px-Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg",
  "Darwin":"https://upload.wikimedia.org/wikipedia/commons/f/f1/Charles_Darwin_portrait.jpg",
  "Copernico":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Nikolaus_Kopernikus.jpg/275px-Nikolaus_Kopernikus.jpg",
  "Aristóteles":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/800px-Aristotle_Altemps_Inv8575.jpg",
  "Pitágoras":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pythagoras_in_the_Roman_Forum%2C_Colosseum.jpg/1200px-Pythagoras_in_the_Roman_Forum%2C_Colosseum.jpg",
  "Da Vinci":"https://www.worldhistory.org/img/r/p/500x600/12518.jpg?v=1691868603",
  "Maxwell":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIEfJQSGxptuT-HTlZF-pEcKTJdJGAEIJEiicjBfZSSA&s"
}

let countCreated = 0;
let countExists = 0;
let promises = [];

for (let item in teams) {
  promises.push(
    new Team({ 
      name: item,
      icon: teams[item]
    })
    .save()
    .then(() => {
      countCreated++;
    })
    .catch((err) => {
      countExists++;
    })
  );
}

Promise.all(promises)
  .then(() => {
    console.log(`Total teams created: ${countCreated}`);
    console.log(`Total teams already existing: ${countExists}`);
  });

// Populate the database with words
const WordController = require("./controllers/WordController");

const csv = require('csv-parser');
const fs = require('fs');
let wordPromises = [];
let wordCountCreated = 0;
let wordCountExists = 0;

fs.createReadStream('./words.csv')
  .pipe(csv())
  .on('data', (row) => {
    const columnNames = Object.keys(row);
    for (let category of columnNames) {
      wordPromises.push(
        WordController.createWord(row[category], category)
        .then((res) => {
          if (res === 'Word already exists') {
            wordCountExists++;
          } else if (res === 'Word created successfully') {
            wordCountCreated++;
          }
        })
      );
    }
  })
  .on('end', () => {
    Promise.all(wordPromises)
      .then(() => {
        console.log(`Total words created: ${wordCountCreated}`);
        console.log(`Total words already existing: ${wordCountExists}`);
      });
  });

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:5000');
});

module.exports = app;
