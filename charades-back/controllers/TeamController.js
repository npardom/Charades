// Import the models
const Team = require('../models/TeamModel');

// Create a new team
exports.createTeam = async(req, res) => {
    // Check if the team already exists
    const team = await Team.findOne({ name: req.body.name });
    if(team){
        return res.status(400).json({ message: 'Team already exists' });
    }else{
        // Create a new team
        const newTeam = new Team({
            name: req.body.name,
            icon: req.body.icon
        });
        await newTeam.save();
        return res.status(200).json({ message: 'Team created successfully' });
    }
}

// Get all teams
exports.getTeams = async(req, res) => {
    const teams = await Team.find();
    const reducedTeams = teams.map(team => {
        return {
            _id: team._id,
            name: team.name,
            icon: team.icon,
            points: team.points,
            active: team.active
        }
    });
    return res.status(200).json(reducedTeams);
}

// Add a point to the team
exports.addPoint= async(req, res) => {
    const team = await Team.findById(req.body._id);
    team.points += req.body.points;
    if(team.points < 0){
        team.points = 0;
    }
    await team.save();
    return res.status(200).json({ message: 'Team updated successfully' });
};

// Toggle the team state
exports.toggleTeam = async(req, res) => {
    const team= await Team.findById(req.body._id);
    team.active = !team.active;
    await team.save();
    return res.status(200).json({ message: 'Team updated successfully' });
}

// Delete a team
exports.deleteTeam = async(req, res) => {
    const {parameter} = req.params;
    if(parameter){
        await Team.findByIdAndDelete(parameter);
        return res.status(200).json({ message: 'Team deleted successfully' });
    }
}

//Reset the points and state of all teams
exports.resetTeams = async(req, res) => {
    const teams = await Team.find();
    teams.forEach(async team => {
        team.points = 0;
        team.active = true;
        await team.save();
    });
    return res.status(200).json({ message: 'Teams reset successfully' });
}