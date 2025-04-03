import Player from '../models/Player.js';
import { uploadMedia } from '../utils/cloudinary.js';

export const createPlayer = async (req, res) => {
  try {
    const {
      playerName, 
      email,
      phone,
      age, 
      playerRole,
      battingStyle, 
      bowlingStyle,
      playingExperience,
      country,
      basePrice,
      matches,
      runs,
      wickets,
      average,
      strikeRate,
      economy,
      bio
    } = req.body;

    const existingPlayer = await Player.findOne({email});
    if(existingPlayer){
      return res.json(400).json({
        error: "player already exists",
      });
    }
    const profileImage = req.file;
    const profilePhoto = "https://media.istockphoto.com/id/1961226379/vector/cricket-player-playing-short-concept.jpg?s=612x612&w=0&k=20&c=CSiQd4qzLY-MB5o_anUOnwjIqxm7pP8aus-Lx74AQus=";
    if(profileImage){
      const cloudResponse = await uploadMedia(profileImage.path);
      profilePhoto = cloudResponse.secure_url;
    }
    const playerData = {
      playerName: playerName, 
      email: email,
      phone: phone,
      age: age, 
      playerRole: playerRole,
      battingStyle: battingStyle, 
      bowlingStyle: bowlingStyle,
      playingExperience: playingExperience,
      country: country,
      basePrice: basePrice,
      stats: {
        matches: matches,
        runs: runs,
        wickets: wickets,
        average: average,
        strikeRate: strikeRate,
        economy: economy,
      },
      description: bio,
      profilePhoto: profilePhoto,
    }
    const player = new Player(playerData);
    await player.save();
    return res.status(201).json({
      success: true, 
      message: "player added successfully!",
      player  
    });    
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const getPlayers = async (req, res) => {
  try {
    const filters = {};
    
    // Apply filters if provided
    if (req.query.status) filters.status = req.query.status;
    if (req.query.type) filters.type = req.query.type;
    if (req.query.team) filters.team = req.query.team;
    
    const players = await Player.find(filters)
      .populate('team', 'name logo')
      .sort({ createdAt: -1 });
    
    res.json(players);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPlayer = async (req, res) => {
  try {
    const playerId = req.params.id;
    const player = await Player.findById(playerId)
      .populate('team', 'name logo');
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Update allowed fields
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'type', 'battingStyle', 'bowlingStyle', 
                           'country', 'basePrice', 'stats', 'status'];
    
    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        player[update] = req.body[update];
      }
    });

    await player.save();
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Only allow deletion if player is not sold
    if (player.status === 'sold') {
      return res.status(400).json({ error: 'Cannot delete sold player' });
    }

    await player.remove();
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
