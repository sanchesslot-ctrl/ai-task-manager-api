const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PAYPAL_EMAIL = 'sanchesslot@gmail.com';
let totalVisits = 0;
let visits = [];
let liveUsers = {};
let totalEarned = 0;

// Track
app.use((req,res,next)=>{
  totalVisits++;
  const ip = req.headers['x-forwarded-for'] || req.ip || 'Nairobi';
  visits.push({time: new Date(), path: req.path, ip: ip});
  if(visits.length>100) visits.shift();
  const id = ip;
  liveUsers[id] = {lastSeen: Date.now(), ip: ip, city: 'Nairobi'};
  next();
});

// Clean old live users
setInterval(()=>{
  const now = Date.now();
  for(let k in liveUsers){
    if(now - liveUsers[k].lastSeen > 60000) delete liveUsers[k];
  }
},10000);

app.get('/', (req,res)=>{
  res.send(`
  <h1>AI Task Manager API LIVE</h1>
  <p>PayPal: ${PAYPAL_EMAIL}</p>
  <p>Total Visits: ${totalVisits}</p>
  <p>Live Now: ${Object.keys(liveUsers).length}</p>
  <p><a href="/admin/stats">View Admin Stats</a></p>
  <hr>
  <h3>PayPal $2 Payment Test</h3>
  <button onclick="pay()">Pay $2 to ${PAYPAL_EMAIL}</button>
  <script>
  async function pay(){
    alert('PayPal will be connected after you add PAYPAL keys in Render. For now tracking is LIVE!');
  }
  </script>
  `);
});

app.get('/admin/stats', (req,res)=>{
  res.json({
    status: "API IS LIVE - NEW CODE",
    paypal_email: PAYPAL_EMAIL,
    total_visits: totalVisits,
    live_now: Object.keys(liveUsers).length,
    live_users: Object.values(liveUsers),
    total_earned: "$" + totalEarned,
    last_20_visits: visits.slice(-20).reverse(),
    message: "NEW CODE IS WORKING!"
  });
});

app.get('/api/stats', (req,res)=>{
  res.json({totalVisits, liveNow: Object.keys(liveUsers).length});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log('LIVE on '+PORT));
