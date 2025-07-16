const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Insert a new student
app.post('/students', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO students (name, email, age) VALUES (?, ?, ?)',
      [name, email, age]
    );
    console.log(`Inserted student: ${name}`);
    res.status(201).json({ id: result.insertId, name, email, age });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
    console.log(`Updated student ID: ${id}`);
    res.json({ message: 'Student updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete student
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
    console.log(`Deleted student ID: ${id}`);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
