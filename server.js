const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- Usage Tracker ---
let totalVisits = 0;
app.use((req, res, next) => {
  totalVisits++;
  console.log(`Visit #${totalVisits} - ${req.path}`);
  next();
});

let tasks = [
  { id: 1, title: "Build Arc portfolio", priority: "high", done: false }
];

app.get('/', (req, res) => {
  res.json({ 
    status: "API IS LIVE", 
    total_visits: totalVisits 
  });
});

app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const newTask = { id: tasks.length + 1, ...req.body };
  tasks.push(newTask);
  res.json(newTask);
});

app.get('/api/stats', (req, res) => {
  res.json({
    total_visits: totalVisits,
    total_tasks: tasks.length,
    message: `${totalVisits} people have used your API so far!`
  });
});

app.post('/api/pay', (req, res) => {
  const { phone, amount } = req.body;
  res.json({ 
    success: true, 
    message: `Payment of KES ${amount} from ${phone} received!`,
    api_key: "PREMIUM_" + Date.now()
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`API LIVE on ${PORT}`));
