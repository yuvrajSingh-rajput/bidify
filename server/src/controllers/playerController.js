import Player from '../models/Player.js';

export const createPlayer = async (req, res) => {
  try {
    const {} = req.body;
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    const player = await Player.findById(req.params.id)
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
