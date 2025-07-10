const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//app.use(cors());
app.use(cors({
    origin: ['http://sabeiko.ksaurav.com.np', 'https://sabeiko.ksaurav.com.np'],
    credentials: true
}));
app.use(bodyParser.json());


// Placeholder routes
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/submit', require('./routes/submit'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));

app.get('/', (req, res) => {
  res.send('Sabeiko Awaj API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
