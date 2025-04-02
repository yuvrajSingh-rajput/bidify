import AuctionDetail from '../models/AuctionDetail.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';

export const createAuctionDetail = async (req, res) => {
  try {
    const { playerId } = req.body;
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    if (player.status !== 'available') {
      return res.status(400).json({ error: 'Player is not available for AuctionDetail' });
    }

    // Check if player is already in an active AuctionDetail
    const existingAuctionDetail = await AuctionDetail.findOne({
      player: playerId,
      status: { $in: ['pending', 'active'] }
    });
    if (existingAuctionDetail) {
      return res.status(400).json({ error: 'Player is already in an AuctionDetail' });
    }

    const AuctionDetail = new AuctionDetail({
      player: playerId,
      currentBid: player.basePrice
    });
    await AuctionDetail.save();

    res.status(201).json(AuctionDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAuctionDetails = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;

    const AuctionDetails = await AuctionDetail.find(filters)
      .populate('player')
      .populate('currentHighestBidder', 'name logo')
      .populate('winningBid.team', 'name logo')
      .sort({ createdAt: -1 });

    res.json(AuctionDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAuctionDetail = async (req, res) => {
  try {
    const AuctionDetail = await AuctionDetail.findById(req.params.id)
      .populate('player')
      .populate('currentHighestBidder', 'name logo')
      .populate('winningBid.team', 'name logo')
      .populate({
        path: 'biddingHistory',
        populate: { path: 'team', select: 'name logo' }
      });

    if (!AuctionDetail) {
      return res.status(404).json({ error: 'AuctionDetail not found' });
    }

    res.json(AuctionDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const startAuctionDetail = async (req, res) => {
  try {
    const AuctionDetail = await AuctionDetail.findById(req.params.id);
    if (!AuctionDetail) {
      return res.status(404).json({ error: 'AuctionDetail not found' });
    }

    if (AuctionDetail.status !== 'pending') {
      return res.status(400).json({ error: 'AuctionDetail cannot be started' });
    }

    AuctionDetail.status = 'active';
    AuctionDetail.startTime = new Date();
    AuctionDetail.endTime = new Date(Date.now() + 30000); // 30 seconds initial time
    await AuctionDetail.save();

    // Set timeout to complete AuctionDetail if no bids
    AuctionDetail.timeoutId = setTimeout(async () => {
      await AuctionDetail.complete();
      // Socket event will be emitted by the socket handler
    }, 30000);

    res.json(AuctionDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelAuctionDetail = async (req, res) => {
  try {
    const AuctionDetail = await AuctionDetail.findById(req.params.id);
    if (!AuctionDetail) {
      return res.status(404).json({ error: 'AuctionDetail not found' });
    }

    if (!['pending', 'active'].includes(AuctionDetail.status)) {
      return res.status(400).json({ error: 'AuctionDetail cannot be cancelled' });
    }

    AuctionDetail.status = 'cancelled';
    await AuctionDetail.save();

    // Update player status
    const player = await Player.findById(AuctionDetail.player);
    player.status = 'available';
    await player.save();

    res.json(AuctionDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
