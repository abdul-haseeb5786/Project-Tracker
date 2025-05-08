import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'email name')
      .populate('assignedTo', 'email name')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    
    // Populate the assignedTo field before sending response
    await task.populate('assignedTo', 'email name');
    await task.populate('createdBy', 'email name');
    
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update task status
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update task fields
    if (req.body.status) {
      task.status = req.body.status;
    }
    if (req.body.accepted !== undefined) {
      task.accepted = req.body.accepted;
    }

    await task.save();
    
    // Populate fields before sending response
    await task.populate('assignedTo', 'email name');
    await task.populate('createdBy', 'email name');
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    task.comments.push({ 
      text: req.body.text, 
      author: req.body.userId,
      createdAt: new Date()
    });
    
    await task.save();
    await task.populate('assignedTo', 'email name');
    await task.populate('createdBy', 'email name');
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
