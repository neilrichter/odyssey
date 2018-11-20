const
  express = require('express'),
  { $tournaments } = require.main.require('./services'),
  app = express.Router();

app.post('/create', async (req, res, next) => {
  await $tournaments.create({
      ...req.body,
      has_started: false
  })
    .then(code => res.status(code).send())
    .catch(errCode => res.status(errCode).send());
});

module.exports = app;