import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'],
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
  status: {
    type: String,
    enum: ['available', 'sold', 'unsold'],
    default: 'available'
  }
}, {
  timestamps: true
});

export default mongoose.model('Player', playerSchema);
