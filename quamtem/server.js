const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// මෙය Express server එකක්
app.get('/', (req, res) => {
  res.send('ආයුබෝවන්! Express server එක ක්‍රියාත්මක වේ.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // මෙය Console එකට පණිවිඩයක්
});
