import Auction from '../models/Auction.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';

export const createAuction = async (req, res) => {
  try {
    const { playerId } = req.body;
    
    // Check if player exists and is available
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    if (player.status !== 'available') {
      return res.status(400).json({ error: 'Player is not available for auction' });
    }

    // Check if player is already in an active auction
    const existingAuction = await Auction.findOne({
      player: playerId,
      status: { $in: ['pending', 'active'] }
    });
    if (existingAuction) {
      return res.status(400).json({ error: 'Player is already in an auction' });
    }

    const auction = new Auction({
      player: playerId,
      currentBid: player.basePrice
    });
    await auction.save();

    res.status(201).json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAuctions = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;

    const auctions = await Auction.find(filters)
      .populate('player')
      .populate('currentHighestBidder', 'name logo')
      .populate('winningBid.team', 'name logo')
      .sort({ createdAt: -1 });

    res.json(auctions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('player')
      .populate('currentHighestBidder', 'name logo')
      .populate('winningBid.team', 'name logo')
      .populate({
        path: 'biddingHistory',
        populate: { path: 'team', select: 'name logo' }
      });

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const startAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (auction.status !== 'pending') {
      return res.status(400).json({ error: 'Auction cannot be started' });
    }

    auction.status = 'active';
    auction.startTime = new Date();
    auction.endTime = new Date(Date.now() + 30000); // 30 seconds initial time
    await auction.save();

    // Set timeout to complete auction if no bids
    auction.timeoutId = setTimeout(async () => {
      await auction.complete();
      // Socket event will be emitted by the socket handler
    }, 30000);

    res.json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    if (!['pending', 'active'].includes(auction.status)) {
      return res.status(400).json({ error: 'Auction cannot be cancelled' });
    }

    auction.status = 'cancelled';
    await auction.save();

    // Update player status
    const player = await Player.findById(auction.player);
    player.status = 'available';
    await player.save();

    res.json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
