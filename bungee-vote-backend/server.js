const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

const ADMIN_PIN = "8642";
const votesFile = './votes.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Load existing votes from JSON file if it exists
let votes = {};
if (fs.existsSync(votesFile)) {
  try {
    votes = JSON.parse(fs.readFileSync(votesFile, 'utf8'));
    console.log('✅ Loaded existing votes from votes.json');
  } catch (err) {
    console.error('❌ Error reading votes.json:', err);
    votes = {};
  }
}

// Save votes to file
function saveVotes() {
  fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));
}

// Handle vote submissions with PIN validation
app.post('/vote', (req, res) => {
  const { teacher, pin } = req.body;

  if (!teacher || !pin) {
    return res.status(400).json({ error: 'Missing teacher or PIN' });
  }

  if (pin !== ADMIN_PIN) {
    return res.status(403).json({ error: 'Invalid PIN' });
  }

  if (!votes[teacher]) {
    votes[teacher] = 0;
  }

  votes[teacher]++;
  saveVotes();

  console.log(`✅ Vote recorded for ${teacher}`);
  res.json({ success: true, message: `Vote counted for ${teacher}` });
});

// Get current vote results
app.get('/results', (req, res) => {
  res.json(votes);
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});