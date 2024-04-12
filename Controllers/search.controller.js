const Post = require('../Models/post.model');

// Search posts by tags for the current user
const searchPostsByTags = async (req, res) => {
  try {
    const { userId, userRole } = req; // Extract user ID from token
    const userPosts = await Post.find({ author: userId }).populate('tags');

    // Filter posts by tags
    const { tags } = req.query;
    if (tags) {
      const tagsArray = tags.split(',');
      const filteredPosts = userPosts.filter(post => post.tags.some(tag => tagsArray.includes(tag.name)));
      return res.status(200).json(filteredPosts);
    }

    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search posts by tags' });
  }
};

// Search posts by date range for the current user
const searchPostsByDateRange = async (req, res) => {
  try {
    const { userId, userRole } = req; // Extract user ID from token
    const { startDate, endDate } = req.query;
    let query = { author: userId };
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    const userPosts = await Post.find(query);
    res.status(200).json(userPosts);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: 'Failed to search posts by date range' });
  }
};

// Search all posts of the current user
const searchAllUserPosts = async (req, res) => {
  try {
    const { userId, userRole } = req; // Extract user ID from token
    const userPosts = await Post.find({ author: userId });
    res.status(200).json(userPosts);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: 'Failed to search all user posts' });
  }
};

module.exports = {
  searchPostsByTags,
  searchPostsByDateRange,
  searchAllUserPosts,
};
