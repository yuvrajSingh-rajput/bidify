import Player from '../models/Player.js';
import fs from "fs";
import { deleteMediaFromCloudinary, uploadMedia } from '../utils/cloudinary.js';

const defaultProfilePhoto = "https://media.istockphoto.com/id/1961226379/vector/cricket-player-playing-short-concept.jpg?s=612x612&w=0&k=20&c=CSiQd4qzLY-MB5o_anUOnwjIqxm7pP8aus-Lx74AQus=";

export const createPlayerRequest = async (req, res) => {
  try {
    const {
      playerName,
      email,
      phone,
      age,
      playerRole,
      battingStyle,
      bowlingStyle,
      playingExperience,
      country,
      basePrice,
      matches,
      runs,
      wickets,
      average,
      strikeRate,
      economy,
      bio
    } = req.body;

    const existingPlayer = await Player.findOne({ email, phone });
    if (existingPlayer) {
      return res.status(400).json({ error: "Player with same email or phone already exists" });
    }

    const files = req.files;

    let profilePhoto = defaultProfilePhoto;
    if (files.profilePhoto && files.profilePhoto.length > 0) {
      const photo = files.profilePhoto[0];
      const cloudResponse = await uploadMedia(photo.path);
      fs.unlinkSync(photo.path); // Clean up local file
      profilePhoto = cloudResponse.secure_url;
    }
    
    let certificates = [];
    if (files.certificates && files.certificates.length > 0) {
      for (const cert of files.certificates) {
        const cloudResponse = await uploadMedia(cert.path);
        fs.unlinkSync(cert.path);
        certificates.push(cloudResponse.secure_url);
      }
    }

    const newPlayer = new Player({
      playerName,
      email,
      phone,
      age,
      playerRole,
      battingStyle,
      bowlingStyle,
      playingExperience,
      country,
      basePrice,
      stats: { matches, runs, wickets, average, strikeRate, economy },
      description: bio,
      profilePhoto,
      certificates,
      status: 'pending'
    });

    await newPlayer.save();

    return res.status(201).json({
      success: true,
      message: "Player registration request submitted successfully.",
      player: newPlayer
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPendingPlayerRegistrationRequests = async (_, res) => {
  try{
    const requestingPlayers = await Player.find({status: "pending"});
    return res.status(200).json({
      success: true,
      requestingPlayers
    });
  }catch(error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const reviewPendingPlayerRegistrationRequests = async (req, res) => {
  try {
    const {playerId, status} = req.body;
    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }    

    if(status === "accepted"){
      player.status = "verified";
      await player.save();
      return res.status(200).json({
        message: "player reviewed and added successfully",
        player,
      });
    }else{
      await player.remove();
      return res.status(200).json({
        message: "player deleted successfully",
      })
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find({});
    return res.status(200).json(players);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getPlayer = async (req, res) => {
  try {
    const playerId = req.params.id;
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    return res.status(200).json(player);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const {
      playerName, 
      country, 
      playerRole, 
      basePrice,
      matches, 
      runs, 
      wickets, 
      average,
      economy,
      strikeRate,
    } = req.body;

    if (playerName) player.playerName = playerName;
    if (country) player.country = country;
    if (playerRole) player.playerRole = playerRole;
    if (basePrice) player.basePrice = basePrice;
    if (matches !== undefined) player.stats.matches = matches;
    if (runs !== undefined) player.stats.runs = runs;
    if (wickets !== undefined) player.stats.wickets = wickets;
    if (average !== undefined) player.stats.average = average;
    if (economy !== undefined) player.stats.economy = economy;
    if (strikeRate !== undefined) player.stats.strikeRate = strikeRate;
    
    const profileImage = req.file;
    if(player.profilePhoto != defaultProfilePhoto && profileImage){
      const publicId = player.profilePhoto.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);

      const cloudResponse = await uploadMedia(profileImage.path);
      player.profilePhoto = cloudResponse.secure_url;
    }
  
    await player.save();
    return res.status(200).json(player);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (player.profilePhoto && player.profilePhoto !== defaultProfilePhoto) {
      const publicId = player.profilePhoto.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }
    for (const certUrl of player.certificates) {
        const publicId = certUrl.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
    }

    await Player.deleteOne({ _id: req.params.id });
    return res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
