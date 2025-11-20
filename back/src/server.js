const express = require('express');
require('dotenv').config();
const petsRouter = require('./routes/pets');
const sellsRouter = require('./routes/sells');

const app = express();
app.use(express.json());

app.use('/api/pets', petsRouter);
app.use('/api/sells', sellsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'internal_server_error' });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
