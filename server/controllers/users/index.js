const
  express = require('express'),
  { $user } = require.main.require('./services'),
  app = express.Router();

app.get('/is-verified', async (req, res, next) => {
	const { user, status } = await $user.isVerified(req.query.discord_id);
	console.log(user, status);
});

module.exports = app;