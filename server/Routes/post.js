const express = require('express');
const router = express.Router();
const Note = require('../models/Post');

// GET ALL POSTS (optionally filter by user)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.body; // normally you'd get this from JWT or query params
    const filter = userId ? { author: userId } : {};
    const posts = await Post.find(filter)
      .populate('author', 'username email')
      .populate('category', 'name');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE NEW POST
router.post('/', async (req, res) => {
  try {
    const { title, content, author, category, tags } = req.body;

    if (!title || !content || !author || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newPost = new Post({ title, content, author, category, tags });
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE POST
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;