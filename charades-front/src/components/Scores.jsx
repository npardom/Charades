
import { useContext } from 'react';
import MyContext from '../context';

import { API } from "../assets/constants";

function Scores() {
  const {teams,getTeams} = useContext(MyContext);

  const removePoint = (team) => {
    var confirm = window.confirm("¿Quitar un punto al equipo " + team.name + "?");
    if(!confirm){
      return;
    }
    fetch(API + "team/addPoint", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"_id": team._id, "points": -1}),
    })
    .then((response) => response.json())
    .then((data) => {
      getTeams();
    })

  }

  return (
    <div className="scoreboard">
      {teams
      .filter(team => team.active)
      .sort((a, b) => b.points - a.points)
      .map((team, index) => (
        <div key={index} className="scoreboardCard" onClick={()=>removePoint(team)}>
          <img src={(team.icon != "" ? team.icon : "https://plus.unsplash.com/premium_photo-1675695700239-44153e6bf430?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFwZXIlMjB0ZXh0dXJlfGVufDB8fDB8fHww")}/>
          <p>{team.name}</p>
          <h1>{team.points}</h1>
        </div>
      ))}
    </div>
  );
};

export default Scores;
