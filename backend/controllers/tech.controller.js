const tech = require('../models/tech.model');

const getAllTech = async (req, res) => {
  try {
    const techRes = await tech.find({});

    // Group technologies by category, then by maturity (ring)
    const groupedTech = techRes.reduce((acc, techItem) => {
      // Get category and maturity values; adjust field names as needed.
      const category = techItem.category;
      const maturity = techItem.ring;

      // Create category group if it doesn't exist
      if (!acc[category]) {
        acc[category] = {};
      }
      // Create maturity group within category if it doesn't exist
      if (!acc[category][maturity]) {
        acc[category][maturity] = [];
      }
      // Add current tech item to the appropriate group
      acc[category][maturity].push(techItem);

      return acc;
    }, {});

    res.status(200).json(groupedTech);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTech = async (req, res) => {
  try {
    const { _id } = req.params;

    const techRes = await tech.find({ _id });
    res.status(200).json(techRes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublishedTech = async (req, res) => {
  try {
    const techRes = await tech.find({ status: 'published' });

    // Group technologies by category, then by maturity (ring)
    const groupedTech = techRes.reduce((acc, techItem) => {
      // Get category and maturity values; adjust field names as needed.
      const category = techItem.category;
      const maturity = techItem.ring;

      // Create category group if it doesn't exist
      if (!acc[category]) {
        acc[category] = {};
      }
      // Create maturity group within category if it doesn't exist
      if (!acc[category][maturity]) {
        acc[category][maturity] = [];
      }
      // Add current tech item to the appropriate group
      acc[category][maturity].push(techItem);

      return acc;
    }, {});

    res.status(200).json(groupedTech);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTech = async (req, res) => {
  try {
    const techDoc = await tech.create(req.body);

    res.status(200).json({
      message: 'Data received successfully',
      data: techDoc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTech = async (req, res) => {
  try {
    const { _id } = req.params;

    const { name, ring, category, techDescription, classificationDescription } =
      req.body;

    // Find the tech by its name or id
    const existingTech = await tech.findById(_id);
    if (!existingTech) {
      return res.status(404).json({ error: 'Tech not found' });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (ring !== undefined) updateData.ring = ring;
    if (category !== undefined) updateData.category = category;
    if (techDescription !== undefined)
      updateData.techDescription = techDescription;
    if (classificationDescription !== undefined)
      updateData.classificationDescription = classificationDescription;

    // Update the document and return the updated document
    const updatedTech = await tech.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true },
    );

    return res.status(200).json(updatedTech);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteTech = async (req, res) => {
  try {
    const { _id } = req.params;

    const deleteTech = await tech.findByIdAndDelete({ _id });

    if (!deleteTech) {
      return res.status(404).json({ error: 'tech not found' });
    }

    res
      .status(200)
      .json({ message: 'tech deleted successfully', tech: deleteTech });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMultipleTech = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ error: 'Please provide an array of ids to delete.' });
    }

    // Use $in operator to delete documents with _id in the provided array
    await tech.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: 'Tech deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const publishTech = async (req, res) => {
  try {
    const { name, ring, classificationDescription } = req.body;
    const techToUpdate = await tech.findOne({ name });

    techToUpdate.status = 'published';
    if (ring !== undefined) techToUpdate.ring = ring;
    if (classificationDescription !== undefined)
      techToUpdate.classificationDescription = classificationDescription;
    // other updates if needed
    techToUpdate.publicationDate = Date.now();
    await techToUpdate.save();
    res.status(200).json({
      message: 'Technology published successfully',
      tech: techToUpdate,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTech,
  getTech,
  getPublishedTech,
  addTech,
  updateTech,
  deleteTech,
  deleteMultipleTech,
  publishTech,
};
