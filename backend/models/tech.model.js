const mongoose = require('mongoose');

const techSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    ring: {
      type: String,
      required: [
        function () {
          // Require ring only if status is not 'draft'
          return this.status !== 'draft';
        },
        'Ring is required when publishing tech',
      ],
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
      required: [
        function () {
          // Require ring only if status is not 'draft'
          return this.status !== 'draft';
        },
        'Classification description is required when publishing tech',
      ],
    },
    publicationDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
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
