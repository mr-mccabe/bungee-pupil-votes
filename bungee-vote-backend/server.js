const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

const votesFile = './votes.json';

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

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Save votes to file
function saveVotes() {
  fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));
}

// Handle votes
app.post('/vote', (req, res) => {
  const { teacher } = req.body;

  if (!teacher) {
    return res.status(400).json({ error: 'Missing teacher name' });
  }

  if (!votes[teacher]) {
    votes[teacher] = 0;
  }

  votes[teacher]++;
  saveVotes();

  console.log(`✅ Vote recorded for ${teacher}`);
  res.json({ success: true });
});

// Get current results
app.get('/results', (req, res) => {
  res.json(votes);
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});