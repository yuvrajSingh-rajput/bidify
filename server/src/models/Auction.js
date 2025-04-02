import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
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
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    auctionStartTime: {
        type: String,
        required: true,
        match: /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ // Validates "HH:MM AM/PM" format
    },
    auctionEndTime: {
        type: String,
    },
    auctions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionDetail'
    }],
    playerBasePrice: {
        type: Number,
        default: 2000000
    },
    teamTotalBudget: {
        type: Number,
        required: true,
        default: 150000000
    }
}, {
    timestamps: true,
});

// Middleware to set auctionEndTime automatically
auctionSchema.pre("save", function (next) {
    if (this.auctionStartTime) {
        // Extract hours, minutes, and period (AM/PM)
        const [time, period] = this.auctionStartTime.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        
        // Convert to 24-hour format for calculations
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        // Add 12 hours
        hours = (hours + 12) % 24;

        // Convert back to 12-hour format
        let newPeriod = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12 for AM format

        // Format the end time
        this.auctionEndTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${newPeriod}`;
    }
    next();
});

export default mongoose.model('Auction', auctionSchema);
