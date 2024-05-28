import { useNavigate } from 'react-router-dom';
import cardsIcon from '../assets/cardsIcon.png';
import lightningIcon from '../assets/lightningIcon.png';

function CategorySelectorButton() {
  const navigate = useNavigate();  

  return (
    <>
   <div className='popUpButton category' title='Seleccionar categoría' onClick={()=>navigate("/categorySelector")}>
      <img src={cardsIcon}/>
    </div>
    <div className='popUpButton flashRound' title='Ronda relámpago' onClick={()=>navigate("/flashRound")}>
      <img src={lightningIcon}/>
    </div>
    </>
  );
};

export default CategorySelectorButton;
