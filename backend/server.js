const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Ensure this port is different from the frontend port

app.use(cors());
app.use(express.json());

app.post('/validate-word', async (req, res) => {
  const { previousWord, newWord } = req.body;

  // Dummy validation logic for prototype
  const isValid = newWord.length > 2 && newWord[0].toLowerCase() === previousWord[previousWord.length - 1].toLowerCase();

  res.json({ valid: isValid });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
