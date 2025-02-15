const mongoose = require('mongoose');

const auditLoginsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User Object is required'],
    },
    loginAt: {
      type: Date,
    },
    logoutAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const auditLogins = mongoose.model('auditLogins', auditLoginsSchema);
module.exports = auditLogins;
