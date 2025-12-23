const mongoose = require('mongoose');

const loggedInUserSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  
  username: {
    type: String,
    required: true,
    unique: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      if (!ret.id) {
        ret.id = null;
      }
      if (ret.loginTime) {
        const loginTimeThailand = new Date(ret.loginTime.getTime() + (7 * 60 * 60 * 1000));
        ret.loginTime = loginTimeThailand.toISOString().replace('Z', '+07:00');
      }
      if (ret.createdAt) {
        const createdAtThailand = new Date(ret.createdAt.getTime() + (7 * 60 * 60 * 1000));
        ret.createdAt = createdAtThailand.toISOString().replace('Z', '+07:00');
      }
      if (ret.updatedAt) {
        const updatedAtThailand = new Date(ret.updatedAt.getTime() + (7 * 60 * 60 * 1000));
        ret.updatedAt = updatedAtThailand.toISOString().replace('Z', '+07:00');
      }
      return ret;
    }
  }
});

module.exports = mongoose.model('LoggedInUser', loggedInUserSchema);