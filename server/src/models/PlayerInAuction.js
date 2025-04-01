import mongoose from 'mongoose';

const handlePlayerSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        default: null,
    },
    status: {
        enum: ['available', 'sold', 'unsold'],
        default: 'available',
    }
}, {
    timestamps: true,
});

const playerInAuctionSchema = new mongoose.Schema({
    players: [handlePlayerSchema],
},{
    timestamps: true,
});

export default mongoose.model("playerInAuction", playerInAuctionSchema);