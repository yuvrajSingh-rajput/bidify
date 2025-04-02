import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
    auctionName: {
        type: String,
        required: true,
    },
    auctionDescription: {
        type: String,
    },
    auctionDate: {
        type: Date,
        required: true,
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

// Middleware to set endTime automatically
auctionSchema.pre("save", function (next) {
    if (this.auctionStartTime) {
        // Extract hours, minutes, and period
        const [time, period] = this.auctionStartTime.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        
        // Calculate end time (12 hours later)
        let endHours = hours;
        let endPeriod = period;
        
        // Toggle AM/PM if we're adding 12 hours
        if (period === "AM") {
            endPeriod = "PM";
        } else {
            endPeriod = "AM";
        }
        
        // Format the end time
        this.auctionEndTime = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${endPeriod}`;
    }
    next();
});


export default mongoose.model('Auction', auctionSchema);