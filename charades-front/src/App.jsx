import { BrowserRouter  as Router, Routes, Route , Navigate} from 'react-router-dom';
import {  useEffect, useState } from 'react'

import MyContext from './context.js';

import SpinningWheel from './pages/spinningWheel.jsx';
import WordSelector from './pages/wordSelector.jsx';
import CategorySelector from './pages/categorySelector.jsx';
import FlashRound from './pages/flashRound.jsx';

import CategorySelectorButton from './components/CategorySelectorButton.jsx';
import Scores from './components/Scores.jsx';
import TeamManager from './components/TeamManager.jsx';
import Logo from './components/Logo.jsx';

import { API } from './assets/constants.js';

function App() {
  const [category, setCategory] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [teams, setTeams] = useState([]);
  const [pointPopUpShown, setPointPopUpShown] = useState(false);
  const [teamNumberInTurn, setTeamNumberInTurn] = useState(parseInt(localStorage.getItem('teamInTurn')) || 0);
  const [teamInTurn, setTeamInTurn] = useState({});
  const [categoryInFlashRound, setCategoryInFlashRound] = useState("");

  // Team in turn handler
  useEffect(() => {
    // Store the team in turn in the localStorage
    localStorage.setItem('teamInTurn', teamNumberInTurn);

    // Get the team in turn
    const activeTeams = teams.filter(team => team.active).sort((a, b) => a.name.localeCompare(b.name));
    setTeamInTurn(activeTeams[teamNumberInTurn % activeTeams.length]);
  }, [teams, teamNumberInTurn]);

  // Add a right arrow event listener to advance to the next team
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setTeamNumberInTurn((prev)=> (prev + 1));
      }else if(event.key === "ArrowLeft"){
        setTeamNumberInTurn((prev)=> (prev - 1));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Get all the teams from the database
  const getTeams = () => {
    fetch(API + "team/getTeams", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setTeams(data)
    })
    .catch(err => console.log(err));
  };


  // Get the teams when the app starts
  useEffect(() => {
    getTeams();
  }, []);

  // Get the teams every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getTeams();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Set the initial rotation in the localStorage
  useEffect(() => {
    localStorage.setItem('rotation', 0);
  }, []);


  
  return (
    <MyContext.Provider value={{
      category, setCategory,
      showCard, setShowCard,
      teams, getTeams,
      pointPopUpShown, setPointPopUpShown,
      teamInTurn, setTeamNumberInTurn,
      categoryInFlashRound, setCategoryInFlashRound
    }}>
      <Router>
        <Logo/>
        <TeamManager/>
        <CategorySelectorButton/>
        <Scores/>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<SpinningWheel /> }/>
          <Route path="/categorySelector" element={<CategorySelector /> }/>
          <Route path="/wordSelector/:slug" element={<WordSelector /> }/>
          <Route path="/flashRound" element={<FlashRound /> }/>
        </Routes>
      </Router>
    </MyContext.Provider>
  );
}

export default App
