import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
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
  venue: {
    type: String,
    default: "TBD"
  },
  scorecard: [
    {
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
    }
  ],
  teamStats: [
    {
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
    }
  ],
  commentary: [
    {
      timestamp: {
        type: Date,
        default: Date.now
      },
      text: {
        type: String,
        required: true
      }
    }
  ],
  highlights: [
    {
      timestamp: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

const Match = mongoose.model("Match", matchSchema);
export default Match;
