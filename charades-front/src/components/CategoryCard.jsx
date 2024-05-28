import MyContext from '../context.js';
import { useContext, useEffect } from 'react';

import { categoriesImages } from '../assets/constants.js';
import { categoriesColors } from '../assets/constants.js';

function CategoryCard() {
  const {category, showCard, setShowCard, getTeams} = useContext(MyContext);

  useEffect(() => {
    if (category != "") {
      const card = document.querySelector('.categoryCard');
      card.style.backgroundColor = categoriesColors[category];
    }
  }, [category]);

  return (
    <div 
      className={'categoryCardBackground' + (showCard ? " show":"")}
      onClick={()=> {
        setShowCard(false)
        getTeams()
      }}
    >
      <div
        className={"categoryCard"  + (showCard ? " show":"")}
      >
        <img src={"src/assets/" + categoriesImages[category]} />
        <div>
          <p>La categoría es</p>
          <h1>{category}</h1>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
