import {  useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { categoriesImages } from '../assets/constants.js';
import { categoriesColors } from '../assets/constants.js';

function CategorySelector() {
  const navigate = useNavigate();

  useEffect(() => {
    for (let category in categoriesImages) {
      const card = document.getElementById(category);
      card.style.backgroundColor = categoriesColors[category];
    }
  }, []);

  return (
    <div className="categoriesContainer">
      <h1>Categorías</h1>

      <div className="categoriesContainerGrid">
        {Object.keys(categoriesImages).map((category) => (

          <div 
            className={"categoryCard2"} 
            id={category}
            onClick={()=> navigate('/wordSelector/'+ categoriesImages[category].slice(0, -4))}
          >
            <img src={"src/assets/" + categoriesImages[category]}/>
            <p>{category}</p>
          </div>

        ))}
      </div>
      
    </div>
  );
}


export default CategorySelector;
