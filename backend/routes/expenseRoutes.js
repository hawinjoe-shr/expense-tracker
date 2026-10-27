const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    const expense = new Expense({ title, amount: Number(amount), category, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (amount && Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount: Number(amount), category, date },
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;