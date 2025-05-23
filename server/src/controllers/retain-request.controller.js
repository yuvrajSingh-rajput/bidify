import RetainRequest from "../models/retainRequest.js";

export const createRetainRequest = async (req, res) => {
  try {
    const { player, team, auction, retainPrice } = req.body;

    const existingRequest = await RetainRequest.findOne({
      player,
      team,
      auction,
    });
    if (existingRequest) {
      return res.status(400).json({ error: "Retain request already exists" });
    }

    const newRequest = new RetainRequest({
      player,
      team,
      auction,
      retainPrice,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Retain request submitted successfully",
      retainRequest: newRequest,
    });
  } catch (error) {
    console.error("Error creating retain request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllRetainRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const retainRequests = await RetainRequest.find(filter).populate(
      "player team auction"
    );

    res.status(200).json({ success: true, retainRequests });
  } catch (error) {
    console.error("Error fetching retain requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const reviewRetainRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const retainRequest = await RetainRequest.findById(id);

    if (!retainRequest) {
      return res.status(404).json({ error: "Retain request not found" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    retainRequest.status = status;
    await retainRequest.save();

    res
      .status(200)
      .json({
        success: true,
        message: `Retain request ${status}`,
        retainRequest,
      });
  } catch (error) {
    console.error("Error reviewing retain request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
