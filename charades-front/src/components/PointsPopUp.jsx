
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MyContext from '../context';

import { API } from "../assets/constants";

function PointsPopUp() {
  const {teams, getTeams, pointPopUpShown, setPointPopUpShown, teamInTurn} = useContext(MyContext);
  const navigate = useNavigate();

  const givePoint = (id) => {
    var points = 1;
    // Check if the point is double
    if (id === teamInTurn._id) {
      points = 2
    }
    fetch(API + "team/addPoint", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"_id": id, "points": points}),
    })
    .then((response) => response.json())
    .then((data) => {
      getTeams();
      setPointPopUpShown(false);
      navigate("/categorySelector");
    })
  }

  const togglePointType = (type) => {
    if(type === "normal"){
      setNormalPoint(true);
    }else{
      setNormalPoint(false);
    }
  }

  return (
    <div className={'categoryCardBackground' + (pointPopUpShown ? " show":"")}>
      <div className={"popUpPoints" + (pointPopUpShown ? "":" hidden")}>
       
        <p>Elige a que equipo dar el punto:</p>
        <div className="cardContainer">
          {teams
          .filter(team => team.active)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((team, index) => (
            <div key={index} className="teamChooseCard selected" onClick={()=>givePoint(team._id)}>
              <img src={(team.icon != "" ? team.icon : "https://plus.unsplash.com/premium_photo-1675695700239-44153e6bf430?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFwZXIlMjB0ZXh0dXJlfGVufDB8fDB8fHww")}/>
              <p>{team.name}</p>
            </div>
          ))}
        </div>
      

      </div>
    </div>
  );
};

export default PointsPopUp;
