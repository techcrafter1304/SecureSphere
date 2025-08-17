const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FraudReport = require('../models/FraudReport');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const router = express.Router();


router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Check for the required admin secret
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ msg: 'Invalid admin secret.' });
    }

    // Validate other fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true
    });

    await newAdmin.save();

    res.json({ msg: 'Admin user registered successfully.' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});


/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

/**
 * ADD FRIEND - Protected route
 */
router.post('/add-friend', auth, async (req, res) => {
  
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    console.log('userId:', userId);
    console.log('friendId:', friendId);

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ msg: "Invalid friend ID" });
    }

    // Prevent adding self
    if (friendId === userId) {
      return res.status(400).json({ msg: "You cannot add yourself as a friend." });
    }

    const friendObjectId = new mongoose.Types.ObjectId(friendId);

    // Find friend user
    const friend = await User.findById(friendObjectId);
    if (!friend) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if already friends
    if (user.friends.some(f => f.equals(friendObjectId))) {
      return res.status(400).json({ msg: "Already friends" });
    }

    // Add friend
    user.friends.push(friendObjectId);
    await user.save();

    res.json({ msg: "Friend added successfully", friend: { _id: friend._id, name: friend.name, email: friend.email } });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ msg: "Server error", error });
  }
});

/**
 * MARK AN ACCOUNT AS FRAUDULENT - Protected route
 */
router.post('/mark-fraud', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const fraudsterAccount = req.body.fraudsterAccount.trim().toLowerCase();
    if (!fraudsterAccount || !reason) {
      return res.status(400).json({ msg: 'Account and reason are required' });
    }

    const newReport = new FraudReport({
      reportedBy: userId,
      fraudsterAccount,
      reason
    });

    await newReport.save();

    // TODO: Add notification logic here

    res.json({ msg: 'Account reported as fraud and is under review', report: newReport });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

/**
 * GET FRAUD REPORTS FROM NETWORK - Protected route
 */
router.get('/fraud-feed', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the user and their friends (outgoing)
    const user = await User.findById(userId).populate('friends');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Outgoing friends (users this user has added)
    const outgoingFriendIds = user.friends.map(f => f._id.toString());

    // Incoming friends (users that have added this user)
    const incomingFriends = await User.find({ friends: user._id }).select('friends');
    const incomingFriendIds = incomingFriends.map(u => u._id.toString());

    // Combine unique direct friends (both directions)
    const directFriendIds = [...new Set([...outgoingFriendIds, ...incomingFriendIds])];

    // Fetch friends of friends for those direct friends
    const friends = await User.find({ _id: { $in: directFriendIds } }).select('friends');
    let friendsOfFriendsIds = [];
    friends.forEach(fr => {
      friendsOfFriendsIds = friendsOfFriendsIds.concat(fr.friends.map(fid => fid.toString()));
    });

    // Combine all relevant user IDs
    const allRelevantIds = [
      user._id.toString(),
      ...directFriendIds,
      ...friendsOfFriendsIds,
    ];

    // Remove duplicates
    const uniqueRelevantIds = [...new Set(allRelevantIds)];

    // Fetch fraud reports reported by any user in the network
    const reports = await FraudReport.find({ reportedBy: { $in: uniqueRelevantIds } })
  .populate('reportedBy', 'email name'); // populate email and name fields of reporter

    res.json(reports);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

/**
 * DISPUTE A FRAUD REPORT - Protected route
 */
router.post('/dispute-fraud', auth, async (req, res) => {
  try {
    const disputingUserId = req.user.id;
    const { fraudReportId, disputeMessage } = req.body;

    const report = await FraudReport.findById(fraudReportId);
    if (!report) return res.status(404).json({ msg: 'Fraud report not found' });

    // Lookup User C's identifiers (e.g. email) from userId
    const disputingUser = await User.findById(disputingUserId);
    if (!disputingUser) return res.status(404).json({ msg: 'User not found' });

    // Check if disputingUser matches fraud report’s fraudsterAccount
    // Assuming fraudsterAccount stores email, compare here:
    if (report.fraudsterAccount !== disputingUser.email) {
      return res.status(403).json({ msg: 'Unauthorized to dispute this fraud report' });
    }

    if (report.status !== 'under_review') {
      return res.status(400).json({ msg: 'Report can no longer be disputed' });
    }

    report.disputeMessage = disputeMessage;
    await report.save();

    res.json({ msg: 'Your dispute has been submitted and is under review.', report });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});


// Admin: List all disputed fraud reports under review
router.get('/admin/fraud-reports', auth, admin, async (req, res) => {
  try {
    const reports = await FraudReport.find({
      status: "under_review",
      disputeMessage: { $exists: true, $ne: "" }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

// Admin resolves a fraud report dispute
router.put('/fraud-report/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed' or 'rejected'
    const report = await FraudReport.findById(req.params.id);
    if (!report) return res.status(404).json({ msg: 'Report not found' });

    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Status must be confirmed or rejected' });
    }

    report.status = status;
    await report.save();
    res.json({ msg: `Fraud report marked as ${status}.`, report });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});


router.post('/find-friends', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { contacts } = req.body;

    if (!Array.isArray(contacts)) 
      return res.status(400).json({ msg: 'Contacts should be an array' });

    console.log('Contacts:', contacts);

    const foundUsers = await User.find({
      email: { $in: contacts },
      _id: { $ne: userId }
    }).select('_id name email');

    console.log('Found Users:', foundUsers);

    res.json(foundUsers);  // always send JSON array (empty if none)
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});


module.exports = router;
