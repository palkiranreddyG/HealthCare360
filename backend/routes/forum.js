const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Create a new forum post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, user, category } = req.body;
    const post = await ForumPost.create({ title, content, user, category });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post', details: err.message });
  }
});

// Get all forum posts (optionally by category)
router.get('/posts', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All Categories' ? { category } : {};
    const posts = await ForumPost.find(filter)
      .populate('user', 'fullName badge')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
  }
});

// Get a single post with comments
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('user', 'fullName badge')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'fullName badge' }
      });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post', details: err.message });
  }
});

// Add a comment to a post
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { content, user } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comment = await Comment.create({ content, user, post: post._id });
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment', details: err.message });
  }
});

// Like/unlike a post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const { user } = req.body;
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const index = post.likes.indexOf(user);
    if (index === -1) {
      post.likes.push(user);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like/unlike post', details: err.message });
  }
});

// Like/unlike a comment
router.post('/comments/:id/like', async (req, res) => {
  try {
    const { user } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    const index = comment.likes.indexOf(user);
    if (index === -1) {
      comment.likes.push(user);
    } else {
      comment.likes.splice(index, 1);
    }
    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like/unlike comment', details: err.message });
  }
});

// Get all comments for a post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('user', 'fullName').sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments', details: err.message });
  }
});

// Get top contributors (users with most posts)
router.get('/top-contributors', async (req, res) => {
  try {
    const top = await ForumPost.aggregate([
      { $group: { _id: "$user", postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { _id: 0, userId: "$user._id", fullName: "$user.fullName", postCount: 1 } }
    ]);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top contributors', details: err.message });
  }
});

// Get trending topics (top categories by post count)
router.get('/trending-topics', async (req, res) => {
  try {
    const trending = await ForumPost.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, topic: "$_id", count: 1 } }
    ]);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending topics', details: err.message });
  }
});

// Forum stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Total posts
    const totalPosts = await ForumPost.countDocuments();
    // Active today
    const activeToday = await ForumPost.countDocuments({ createdAt: { $gte: startOfDay } });
    // Expert answers (posts by users with badge 'Expert')
    const expertUsers = await User.find({ badge: 'Expert' }).select('_id');
    const expertUserIds = expertUsers.map(u => u._id);
    const expertAnswers = await ForumPost.countDocuments({ user: { $in: expertUserIds } });
    // Helpful rate calculation
    const posts = await ForumPost.find({}, 'likes');
    const comments = await Comment.find({}, 'likes');
    const totalPostLikes = posts.reduce((sum, p) => sum + (p.likes ? p.likes.length : 0), 0);
    const totalCommentLikes = comments.reduce((sum, c) => sum + (c.likes ? c.likes.length : 0), 0);
    const totalComments = comments.length;
    const helpfulDenominator = totalPosts + totalComments;
    let helpfulRate = 100;
    if (helpfulDenominator > 0) {
      helpfulRate = Math.round(((totalPostLikes + totalCommentLikes) / helpfulDenominator) * 100);
    }
    res.json({ totalPosts, activeToday, expertAnswers, helpfulRate });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forum stats', details: err.message });
  }
});

module.exports = router; 