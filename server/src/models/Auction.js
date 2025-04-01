import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const auctionSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  currentBid: {
    type: Number,
    default: 0
  },
  currentHighestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  biddingHistory: [bidSchema],
  winningBid: {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    amount: {
      type: Number
    }
  }
}, {
  timestamps: true
});

// Method to place a bid
auctionSchema.methods.placeBid = async function(team, amount) {
  // Validate bid amount
  if (amount <= this.currentBid) {
    throw new Error('Bid amount must be higher than current bid');
  }

  // Add bid to history
  this.biddingHistory.push({ team, amount });
  this.currentBid = amount;
  this.currentHighestBidder = team;

  // Reset end time (extend auction by 30 seconds after each bid)
  this.endTime = new Date(Date.now() + 30000);

  await this.save();
  return this;
};

// Method to complete auction
auctionSchema.methods.complete = async function() {
  if (this.currentHighestBidder) {
    this.status = 'completed';
    this.winningBid = {
      team: this.currentHighestBidder,
      amount: this.currentBid
    };

    // Update player status
    const player = await mongoose.model('Player').findById(this.player);
    player.status = 'sold';
    player.team = this.currentHighestBidder;
    player.purchasePrice = this.currentBid;
    await player.save();

    // Update team's remaining budget
    const team = await mongoose.model('Team').findById(this.currentHighestBidder);
    team.players.push(this.player);
    await team.updateRemainingBudget();
  } else {
    this.status = 'cancelled';
    const player = await mongoose.model('Player').findById(this.player);
    player.status = 'unsold';
    await player.save();
  }

  await this.save();
  return this;
};

export default mongoose.model('Auction', auctionSchema);
