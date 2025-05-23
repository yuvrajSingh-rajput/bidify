import Auction from '../models/auction.js';

export const createAuction = async (req, res) => {
  try {
    const {
      tournamentName,
      description,
      date,
      startTime,
      maxBudget,
      minBidIncrement,
      teams,
      players,
      retainedPlayers
    } = req.body;

    const newAuction = new Auction({
      tournamentName,
      description,
      date,
      startTime,
      maxBudget,
      minBidIncrement,
      teams,
      players,
      retainedPlayers
    });

    await newAuction.save();

    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      auction: newAuction
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate('teams players.player retainedPlayers.player retainedPlayers.team');
    res.status(200).json({ success: true, auctions });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id).populate('teams players.player retainedPlayers.player retainedPlayers.team');

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    res.status(200).json({ success: true, auction });
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAuctionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    auction.status = status;
    await auction.save();

    // emit "auction-started" event if status is "active"
    if (status === 'active') {
      const io = req.app.get('io');
      io.to(auction._id.toString()).emit('auction-started', {
        auctionId: auction._id,
        message: 'Auction has started!',
      });
    }

    res.status(200).json({ success: true, message: 'Auction status updated', auction });
  } catch (error) {
    console.error('Error updating auction status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
