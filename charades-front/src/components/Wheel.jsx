import MyContext from '../context.js';
import { useContext,useEffect, useState } from 'react';

import { categories } from '../assets/constants.js';

import wheel from '../assets/wheel.png';
import pick from '../assets/pick.png';

import useSound from 'use-sound';
import wheelSpin from '../assets/wheelSpin.mp3';

function Wheel() {
  const {setCategory, setShowCard, getTeams} = useContext(MyContext);
  const speedRotation = 4;

  const [playSound, setPlaySound] = useState(false);

  const [playWheelSpin] = useSound(wheelSpin);

  // Play the wheel spinning sound when the component mounts
  useEffect(() => {
    if(playSound){
      playWheelSpin();
      setPlaySound(false);
    }
  }, [playSound]);

  // Set the initial rotation of the wheel
  useEffect(() => {
    // Get the current rotation from the localStorage
    var rotation = parseInt(localStorage.getItem('rotation'));
    // Rotate the wheel
    document.querySelector('.wheel').style.transform = `rotate(${rotation}deg)`;
  }, []);

  const spinWheel = () => {
    // Set the spinning state to true
    setShowCard(false);

    // Play the wheel spinning sound
   setPlaySound(true);

    // Get teams
    getTeams();

    // Get the current category and rotation from the localStorage
    var selectedItem = localStorage.getItem('selectedItem');
    var rotation = parseInt(localStorage.getItem('rotation'));

    // Get a random category that is not the current one
    var randomIndex = Math.floor(Math.random() * categories.length);
    while(categories[randomIndex] === selectedItem){
      randomIndex = Math.floor(Math.random() * categories.length);
    }

    // Calculate the relative rotation of the wheel
    const relativeRotation = (360 / categories.length) * randomIndex;
    rotation = (rotation - (rotation % 360)) + (speedRotation*360) + relativeRotation;

    // Rotate the wheel
    document.querySelector('.wheel').style.transform = `rotate(${rotation}deg)`;
    
    // Save the new rotation and the new category
    localStorage.setItem('rotation', rotation);
    localStorage.setItem('selectedItem', categories[randomIndex]);

    // Wait for the wheel to stop spinning to show card
    setTimeout(() => {
      setCategory(categories[randomIndex]);
      setShowCard(true);
    }, 2500); 
  };

  // Add a key listener to spin the wheel when the space bar or enter key is pressed
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.code === "Space" || e.code === "Enter")) {
        spinWheel();
        const popUp = document.querySelector('.popUp');
        popUp.classList.add('hidden');
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="wheelContainer" onClick={spinWheel}>
      <img src={wheel} className="wheel"/>
      <img src={pick} className="pick"/>
    </div>
  );
};

export default Wheel;
