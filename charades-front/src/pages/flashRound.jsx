import { useEffect, useState } from "react";

import { useContext } from 'react';
import MyContext from '../context';

import { API, categoriesToActualNames } from "../assets/constants";

import checkIcon from "../assets/checkIcon.png";
import refreshIcon from "../assets/refreshIcon.png";
import PointsPopUp from "../components/PointsPopUp";

import useSound from 'use-sound';
import ding from '../assets/ding.mp3';
import horn from '../assets/horn.mp3';


function FlashRound() {
  const seconds = 120;

  const [playDing] = useSound(ding);
  const [playHorn] = useSound(horn);

  const { teamInTurn, getTeams } = useContext(MyContext);

  const [word, setWord] = useState({});
  const [timer, setTimer] = useState(seconds);
  const [isPaused, setIsPaused] = useState(true);

  const [disableWord, setDisableWord] = useState(false);
  const [skipWord, setSkipWord] = useState(false);

  useEffect(() => {
    if(disableWord){
      deactivateWordAndAddPoint();
      setDisableWord(false);
    }
  }, [disableWord]);

  useEffect(() => {
    if(skipWord){
      getRandomWord();
      setSkipWord(false);
    }
  }, [skipWord]);
  

  const getRandomWord = () => {
    fetch(API + "word/getRandomWordFromAnyCategory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.message){
        setWord("");
      }else{
        setWord(data);
      }
    })
  }

  // Get a random word from the API when the component mounts
  useEffect(() => {
    getRandomWord();
  }, []);

  // Play horn sound when the timer reaches 0
  useEffect(() => {
    if(timer === 0){
      playHorn();
    }
  }, [timer]);


  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  // Deactivate the word and add a point to the team in turn
  const deactivateWordAndAddPoint = () => {
    playDing();
    // Deactivate the word
    fetch(API + "word/toggleWord", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "_id": word._id }),
    })
    .then((response) => response.json())
    .then(() => {
      fetch(API + "team/addPoint", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"_id": teamInTurn._id, "points": 1}),
      })
      .then((response) => response.json())
      .then((data) => {
        getTeams();
        getRandomWord();
      })
    });
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' ) {
        setIsPaused((prevPaused) => !prevPaused);
        setTimer((prevTimer) => (prevTimer));
      } else if ( e.code === 'Enter') {
        setDisableWord(true);
      } else if ( e.code === 'Backspace'){
        setSkipWord(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  return (

    <>
    <PointsPopUp />
    <div className="wordCard">

      {word != "" ? <>

      {timer > 0 ? 
        (!isPaused ?
          <p className="timer">{Math.floor(timer/60) }:{`${timer%60}`.padStart(2, '0')} </p>:
          <p className="timer">Tiempo pausado ({Math.floor(timer/60) }:{`${timer%60}`.padStart(2, '0')})</p>)
        : <p className="timer">¡Se acabó el tiempo!</p>
      }
      <h1>{word.word}</h1>

      <img src={refreshIcon} onClick={getRandomWord}
        className="wordCardButton refresh" title="Saltar palabra" />

      <img src={checkIcon} onClick={deactivateWordAndAddPoint} 
        className="wordCardButton winPoint" title="Dar punto"/>

        <div className="categoryShower">
          <h3>Categoria</h3>
          <p>{categoriesToActualNames[word.category]}</p>
        </div>
      
      </>:
      <>
        <h3>No hay palabras disponibles</h3>
      </>
      }

    </div>
    </>
  );
}


export default FlashRound;
