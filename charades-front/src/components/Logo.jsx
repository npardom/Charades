import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";

import MyContext from "../context"; 
import { useContext } from "react";

function Logo() {
  const navigate = useNavigate();

  const { teamInTurn } = useContext(MyContext);

  return (
    <>
    <img src={logo} className='logo' onClick={() => navigate("/") }/>

    {teamInTurn ?
      <>
      <p className="turnText">El turno es de</p>
      <p className="teamInTurn">{teamInTurn.name}</p>
      </>:<></>
      }
    </>
  );
};

export default Logo;
