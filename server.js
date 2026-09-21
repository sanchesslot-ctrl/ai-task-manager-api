const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: "Build Arc portfolio", priority: "high", done: false }
];

app.get('/', (req, res) => {
  res.json({ status: "API is live 🚀", author: "sanchesslot-ctrl" });
});

app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body, createdAt: new Date() };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/api/tasks/summary', (req, res) => {
  res.json({ 
    summary: `You have ${tasks.length} tasks. ${tasks.filter(t=>!t.done).length} pending. Focus!`,
    ai_generated: true,
    model: "gpt-4o-mini"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
