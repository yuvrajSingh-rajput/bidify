import mongoose from 'mongoose';
import cron from 'node-cron'; 

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['batsman', 'pace-bowler', 'medium-pace-bowler', 'spinner', 'batting all-rounder', 'bowling all-rounder', 'wicket-keeper'],
    required: true
  },
  battingStyle: {
    type: String,
    enum: ['right-handed', 'left-handed'],
    required: true
  },
  bowlingStyle: {
    type: String,
    enum: ['right-arm-fast', 'right-arm-medium', 'right-arm-off-spin', 
           'left-arm-fast', 'left-arm-medium', 'left-arm-spin', 'none'],
    default: 'none'
  },

  playingExperience: {
    type: Number,
    default: 0,
  },

  country: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },

  purchasePrice: {
    type: Number,
    default: null
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  
  stats: {
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    economy: { type: Number, default: 0 }
  },

  contractEndDate: {
    type: Date,
  },

  available: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  }
}, {
  timestamps: true
});

const Player = mongoose.model('Player', playerSchema);

const updatePlayerAvailability = async () => {
  try {
      const now = new Date();
      const result = await Player.updateMany(
          { contractEndDate: { $lte: now }, available: false },
          { $set: { status: true } }
      );
      console.log(`Updated ${result.modifiedCount} players to available.`);
  } catch (error) {
      console.error('Error updating player availability:', error);
  }
};

// Schedule the job to run every midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled job to update player availability...');
  updatePlayerAvailability();
});

export default Player;
