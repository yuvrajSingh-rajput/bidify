import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  logo: {
    type: String,
    required: true
  },

  description: {
    type: String,
  },

  budget: {
    type: Number,
    required: true,
    default: 150000000 // 15 crore default budget
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  remainingBudget: {
    type: Number,
    required: true,
    default: 80000000
  }
}, {
  timestamps: true
});

// Update remaining budget when adding/removing players
teamSchema.methods.updateRemainingBudget = async function() {
  const players = await mongoose.model('Player').find({
    _id: { $in: this.players }
  });
  
  const totalSpent = players.reduce((sum, player) => sum + (player.purchasePrice || 0), 0);
  this.remainingBudget = this.budget - totalSpent;
  await this.save();
};

export default mongoose.model('Team', teamSchema);
