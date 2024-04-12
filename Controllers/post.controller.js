const Post = require('../Models/post.model');
const Tag = require('../Models/tag.model'); // Assuming the Tag model is imported from the correct file
const User = require('../Models/user.model');

const createPost = async (req, res) => {
  try {
    console.log("post.controller.js req.body", req.body);
    const { title, content, tags } = req.body;
    console.log("post.controller.js title, content, tags :: ", title, content, tags);

    const { userId, userRole } = req;  // Extract user id and role from token
    console.log("post.controller.js userId :: ", userId, userRole);

    // First, create tags if they don't exist and get their IDs
    const tagIds = [];
    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = await Tag.create({ name: tagName, posts: [] });
      }
      tagIds.push(tag._id);
    }

    // Create post with tagIds
    const post = await Post.create({ title, content, author: userId, tags: tagIds });

    // Update tags with the ObjectId of the newly created post
    for (const tagId of tagIds) {
      await Tag.findByIdAndUpdate(tagId, { $push: { posts: post._id } });
    }

    //update user with post_id
    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

    res.status(201).json(post);
  } catch (error) {
    console.log("post.controller.js error :: ", error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};


// 2.Edit a post
const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const { userId, userRole } = req;
    const postCheck = await Post.findById(id);
    //check if post is present or not
    if (!postCheck) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // 2.a Check if the user is the author of the post
    if (postCheck.author.toString() !== userId ) // && userRole !== 'admin'
    {
      return res.status(403).json({ error: 'Access forbidden. User is not the author of the post.' });
    }

    const old_tags_id = postCheck.tags;

    // 2.b Update the post
    const new_tagIds = [];
    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = await Tag.create({ name: tagName, posts: [] });
      }
      new_tagIds.push(tag._id);
    }
    const updatedPost = await Post.findByIdAndUpdate(id, { title, content, tags: new_tagIds }, { new: true });
   

    // 2.c Update tags in Tag model
    // 2.c.1 update new tags with post_id
    const newTagIds = [];

    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        // If tag doesn't exist, create it
        tag = await Tag.create({ name: tagName, posts: [updatedPost._id] });
      } else {
        // If tag exists, update its posts array
        if (!tag.posts.includes(updatedPost._id)) {
          tag.posts.push(updatedPost._id);
          await tag.save();
        }
      }
      newTagIds.push(tag._id.toString()); // Convert ObjectId to string for comparison
    }

    //2.c.2 remomve post_id from old tags
    for (const oldtag of old_tags_id) {
      if (!newTagIds.includes(oldtag.toString())) {
        const tag = await Tag.findById(oldtag);
        const index = tag.posts.indexOf(updatedPost._id);
        if (index > -1) {
          tag.posts.splice(index, 1);
          if (tag.posts.length === 0) {
              await Tag.findByIdAndDelete(tag._id);
          }
          else {
            await tag.save();
          }
        }
      }
    }
    res.status(200).json(updatedPost);
  } catch (error) { 
    res.status(500).json({ error: 'Failed to edit post' });
  }
};

// 3. Delete a post
const deletePost = async (req, res) => {
  try {
    console.log("deletePost :: ", req.params);
    const { id } = req.params;
    const { userId, userRole } = req;
    const postCheck = await Post.findById(id);
    //check if post is present or not
    if (!postCheck) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (postCheck.author.toString() !== userId && userRole !== 'admin') 
    {
      return res.status(403).json({ error: 'Access forbidden. User is not the author of the post.' });
    }

    const old_tags_id = postCheck.tags;

    // 3.a Delete the post
    await Post.findByIdAndDelete(id);

    // 3.b Update tags in Tag model
    for (const tagId of old_tags_id) {
      const tag = await Tag.findById(tagId);
      const index = tag.posts.indexOf(id);
      if (index > -1) {
        tag.posts.splice(index, 1);
        if (tag.posts.length === 0) {
          await Tag.findByIdAndDelete(tag._id);
        }
        else {
          await tag.save();
        }
      }
    }

    // 3.c Update user model to remove post_id
    await User.findByIdAndUpdate(userId, { $pull: { posts: id } });

    res.status(201).json({msg : "Post Deleted Successfully"});
  } catch (error) {
    // console.log("deletePost error :: ", error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

module.exports = {
  createPost,
  editPost,
  deletePost,
};
