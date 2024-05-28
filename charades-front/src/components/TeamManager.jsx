import MyContext from '../context.js';
import { useContext, useEffect } from 'react';

import { API } from '../assets/constants.js';

import teamIcon from '../assets/teamIcon.png';
import resetIcon from '../assets/resetIcon.png';

import { useNavigate } from 'react-router-dom';

function TeamManager() {
  const {teams, getTeams, setTeamNumberInTurn} = useContext(MyContext);
  const navigate = useNavigate();

  const toggleTeam = (e, team) => {
    if(e.target.classList.contains('deleteButton')){
      return
    }
    fetch(API + "team/toggleTeam", {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"_id": team._id})
    })
    .then(response => response.json())
    .then(data => getTeams())
    .catch(err => alert(err));
  }

  const toggleVisibility = () => {
    document.querySelector('.popUp').classList.toggle('hidden');
  }

  const deleteTeam = (id) => {
    var confirmation = confirm("¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.");
    if (!confirmation) {
      return;
    }
    fetch(API + "team/deleteTeam/" + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => getTeams())
    .catch(err => alert(err));
  }

  const createTeam = () => {
    // Prompt the user for the team name
    var teamName = prompt("Introduce el nombre del equipo");
    if(teamName === null){
      return;
    }
    while (teamName === "" || teams.map(team => team.name).includes(teamName) ){
      alert("Nombre de equipo no válido / ya existe");
      teamName = prompt("Introduce el nombre del equipo");
      if(teamName === null){
        return;
      }
    }
    // Prompt the user for the team image
    var image = prompt("Introduce la URL de la imagen del equipo o deja en blanco para usar la imagen por defecto");
    if(image === null){
      return;
    }
    // Create the team
    fetch(API + "team/createTeam", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"name": teamName, "icon": image})
    })
    .then(response => response.json())
    .then(data => getTeams())
    .catch(err => alert(err));
  }

  const resetGame = () => {
    var confirmation = confirm("¿Deseas borrar los puntajes? Esta acción no se puede deshacer.");
    if (confirmation) {
      // Reset the teams
      fetch(API + "team/resetTeams", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => getTeams())
      .catch(err => alert(err));
    }
    var confirmation2 = confirm("¿Deseas reiniciar las palabras? Esta acción no se puede deshacer.");
    if (confirmation2) {
      // Reset the words
      fetch(API + "word/resetWords", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .catch(err => alert(err));
    }

    // Reset the team in turn
    setTeamNumberInTurn(0)

    // Navigate to the home page
    navigate("/")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const popUp = document.querySelector('.popUp');
      if (popUp && !popUp.contains(event.target) && !event.target.classList.contains('popUpButton')) {
        popUp.classList.add('hidden');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>

      <div className='popUpButton reset' title='Reiniciar partida' onClick={resetGame}>
        <img src={resetIcon}/>
      </div>

      <div className='popUpButton' title='Gestionar equipos' onClick={toggleVisibility}>
        <img src={teamIcon}/>
      </div>

      <div className='popUp hidden'>
        <p className='popUpText'>Gestionar equipos</p>
        <div className='cardContainer'>
          {teams.sort((a, b) => a.name > b.name ? 1 : -1).map((team) => (
            <div className={"teamChooseCard " + (team.active ? "selected":"")} id={team._id} onClick={(e)=>toggleTeam(e, team)}>
              <img src={(team.icon != "" ? team.icon : "https://plus.unsplash.com/premium_photo-1675695700239-44153e6bf430?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFwZXIlMjB0ZXh0dXJlfGVufDB8fDB8fHww")}/>
              <p>{team.name}</p>
              <div onClick={()=>deleteTeam(team._id)} className='deleteButton'>X</div>
            </div>
          ))}

          <div className={"teamChooseCard addNew"} title="Añadir equipo" onClick={createTeam}>
            +
          </div>

        </div>      
      </div>
    </>
  );
};

export default TeamManager;
