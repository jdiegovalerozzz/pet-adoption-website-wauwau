const express = require('express');
require('dotenv').config();
const petsRouter = require('./routes/pets');
const sellsRouter = require('./routes/sells');
const servicesRouter = require('./routes/services');

const app = express();
app.use(express.json());

app.use('/api/pets', petsRouter);
app.use('/api/sells', sellsRouter);
app.use('/api/services', servicesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'internal_server_error' });
});

const PORT = 'https://pet-adoption-website-wauwau.onrender.com/';
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
