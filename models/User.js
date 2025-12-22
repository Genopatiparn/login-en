const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  age: {
    type: Number
  },
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {

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

module.exports = mongoose.model('User', userSchema);