const mongoose = require('mongoose');

const fraudReportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fraudsterAccount: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['under_review', 'confirmed', 'rejected'], default: 'under_review' },
  disputeMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('FraudReport', fraudReportSchema);
