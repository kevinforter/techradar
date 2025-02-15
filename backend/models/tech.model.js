const mongoose = require('mongoose');

const techSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    ring: {
      type: String,
      required: [true, 'Ring of tech is required'],
    },
    category: {
      type: String,
      required: [true, 'Category of tech is required'],
    },
    techDescription: {
      type: String,
      required: [true, 'Tech description is required'],
    },
    classificationDescription: {
      type: String,
      required: [true, 'Classification description is required'],
    },
    publicationDate: {
      type: Date,
    },
    status: {
      type: String,
      default: 'draft',
    },
  },
  {
    timestamps: true,
  },
);

techSchema.pre('save', function (next) {
  if (this.status === 'draft') {
    this.publicationDate = undefined;
  } else if (!this.publicationDate) {
    this.publicationDate = Date.now();
  }
  next();
});

const tech = mongoose.model('techCollection', techSchema);
module.exports = tech;
