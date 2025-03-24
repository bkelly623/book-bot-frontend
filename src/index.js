const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// ✅ Enable CORS
app.use(cors());
app.use(bodyParser.json());

// ✅ OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ POST /recommend
app.post('/recommend', async (req, res) => {
  const { genre } = req.body;

  try {
    const prompt = `Recommend three great books in the "${genre}" genre.`;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 100,
    });

    const recommendations = response.data.choices[0].text.trim();
    res.json({ recommendations });
  } catch (err) {
    console.error('Error with OpenAI:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ POST /save-email
app.post('/save-email', (req, res) => {
  const { email, genre } = req.body;
  console.log('📧 Email received:', email, '| Genre:', genre);
  res.json({ message: 'Email saved!' });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

