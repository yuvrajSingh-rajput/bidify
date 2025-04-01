import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Team from '../models/Team.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = new User({ name, email, password, role });
    await user.save();

    // If user is team owner, create team
    if (role === 'team_owner') {
      // Get the file path if a file was uploaded
      const teamLogo = req.file ? `/uploads/${req.file.filename}` : undefined;
      
      const team = new Team({
        name: req.body.teamName,
        logo: teamLogo,
        description: req.body.teamDescription,
        budget: parseFloat(req.body.teamBudget) || 80000000,
        owner: user._id
      });
      await team.save();

      // Link team to user
      user.team = team._id;
      await user.save();
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log("email: ",email)
    console.log("password: ",password)
    // Find user
    const user = await User.findOne({ email });
    console.log("user: ", user);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user.role === 'team_owner') {
      const team = await Team.findOne({ owner: user._id });
      return res.json({ user, team });
    }
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
