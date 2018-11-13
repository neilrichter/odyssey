const
  express = require('express'),
  { $tournaments } = require.main.require('./services'),
  app = express.Router();

app.post('/create', async (req, res, next) => {
  console.log(req.body);
  await $tournaments.create({
      ...req.body,
      has_started: false
  })
    .then(code => res.status(code).send())
    .catch(errCode => res.status(errCode).send());
  res.status(200).send('Hello');
});

module.exports = app;