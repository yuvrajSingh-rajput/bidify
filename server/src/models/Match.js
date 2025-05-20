import mongoose from "mongoose";

const scorecardSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  runs: {
    type: Number,
    default: 0
  },
  ballsFaced: {
    type: Number,
    default: 0
  },
  wicketsTaken: {
    type: Number,
    default: 0
  },
  oversBowled: {
    type: Number,
    default: 0
  }
});

const teamStatsSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  overs: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0
  },
  extras: {
    type: Number,
    default: 0
  }
});

const commentarySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  }
});

const highlightSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const matchSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  matchDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    default: "TBD"
  },
  matchStatus: {
    type: String,
    enum: ["scheduled", "in-progress", "completed"],
    default: "scheduled"
  },
  matchResult: {
    type: String,
    enum: ["team1", "team2", "draw"],
    default: null
  },
  tossWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  electedTo: {
    type: String,
    enum: ["bat", "bowl"]
  },
  manOfTheMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player"
  },
  scorecard: [scorecardSchema],
  teamStats: [teamStatsSchema],
  commentary: [commentarySchema],
  highlights: [highlightSchema]
}, {
  timestamps: true
});

const Match = mongoose.model("Match", matchSchema);
export default Match;
