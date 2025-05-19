import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const auctionSchema = new mongoose.Schema(
  {
    auctionName: {
      type: String,
      unique: true,
      required: true,
    },
    auctionDescription: {
      type: String,
    },
    auctionDate: {
      type: Date,
      required: true,
    },
    auctionStatus: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },
    auctionStartTime: {
      type: String,
      required: true,
      match: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/, 
    },
    players: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
          default: null,
        },
        status: {
          type: String,
          enum: ["available", "sold", "unsold"],
          default: "available",
        },
        currentBid: {
          type: Number,
          default: 0,
        },
        currentHighestBidder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
        },
        biddingHistory: [bidSchema],
        winningBid: {
          team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
          },
          amount: {
            type: Number,
          },
        }
      },
    ],

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Auction =  mongoose.model("Auction", auctionSchema);
export default Auction;