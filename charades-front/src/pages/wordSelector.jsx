import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useContext } from 'react';
import MyContext from '../context';

import { API } from "../assets/constants";

import checkIcon from "../assets/checkIcon.png";
import refreshIcon from "../assets/refreshIcon.png";
import PointsPopUp from "../components/PointsPopUp";

import useSound from 'use-sound';
import ding from '../assets/ding.mp3';
import horn from '../assets/horn.mp3';


function WordSelector() {
  const seconds = 90;

  const [playDing] = useSound(ding);
  const [playHorn] = useSound(horn);

  const { setPointPopUpShown } = useContext(MyContext);

  const { slug } = useParams();
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
    fetch(API + "word/getRandomWord/" + slug, {
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

  // Get a random word from the API and reset the timer
  useEffect(() => {
    getRandomWord();
  }, []);

  // Reset the timer when the word changes
  useEffect(() => {
    setTimer(seconds);
    setIsPaused(true);
  }, [word]); 

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

  // Play horn sound when the timer reaches 0
  useEffect(() => {
    if(timer === 0){
      playHorn();
    }
  }, [timer]);

  const deactivateWordAndAddPoint = () => {
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
      playDing();
      setPointPopUpShown(true);
    });
  }

  // Pause the timer with the space bar
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
      
      </>:
      <>
        <h3>No hay palabras disponibles</h3>
      </>
      }

    </div>
    </>
  );
}


export default WordSelector;
