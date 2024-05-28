// Import the models
const Word = require('../models/WordModel');

// Create a new word
exports.createWord = async(name, category) => {
    // Check if the word already exists
    const word = await Word.findOne({ word: name, category: category});
    if(word){
        return 'Word already exists';
    }else{
        // Create a new word
        const newWord = new Word({
            word: name,
            category: category
        });
        await newWord.save();
        return 'Word created successfully';
    }
}

// Get all active words
exports.getWords = async(req, res) => {
    const {parameter} = req.params;
    if(parameter){
        const words = await Word.find({active: true, category: parameter});
        const reducedWords = words.map(word => {
            return {
                _id: word._id,
                word: word.word
            }
        });
        return res.status(200).json(reducedWords);
    }
}

// Get random active word
exports.getRandomWord = async(req, res) => {
    const {parameter} = req.params;
    if(parameter){
        const words = await Word.find({active: true, category: parameter});
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if(!randomWord) return res.status(404).json({ message: 'No words found' });
        return res.status(200).json(randomWord);
    }
}

// Get random active word from any category
exports.getRandomWordFromAnyCategory = async(req, res) => {
    const words = await Word.find({active: true});
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if(!randomWord) return res.status(404).json({ message: 'No words found' });
    return res.status(200).json(randomWord);
}

// Toggle the word state
exports.toggleWord = async(req, res) => {
    const word = await Word.findById(req.body._id);
    word.active = !word.active;
    await word.save();
    return res.status(200).json({ message: 'Word updated successfully' });
}

// Reset all words
exports.resetWords = async(req, res) => {
    await Word.updateMany({}, { active: true });
    return res.status(200).json({ message: 'Words reset successfully' });
}

