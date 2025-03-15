const Candidate = require('../models/Candidate');
const User = require('../models/User');

exports.addCandidate = async (req, res) => {
  try {
    const { name, party } = req.body;
    const newCandidate = new Candidate({ name, party });
    await newCandidate.save();
    res.status(201).json({ message: 'Candidate added successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error adding candidate' });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching candidates' });
  }
};

exports.voteCandidate = async (req, res) => {
  try {
    const { candidateId, userId } = req.body;
    const candidate = await Candidate.findById(candidateId);
    const user = await User.findById(userId);
    if (!candidate || !user) {
      return res.status(404).json({ error: 'Candidate or User not found' });
    }
    if (user.hasVoted) {
      return res.status(400).json({ error: 'User has already voted' });
    }
    candidate.votes++;
    await candidate.save();
    user.hasVoted = true;
    await user.save();
    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error recording vote' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching results' });
  }
};
