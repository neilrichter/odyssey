const
  express = require('express'),
  fs = require('fs'),
  { $LoL, $server } = require.main.require('./services'),
  app = express.Router();

/**
 * Tournaments controller
 */
app.get('/:summoner', (req, res, next) => {
  $LoL.getSummonerByName(req.params.summoner)
    .then(response => res.status(response.code).send(response.data || response.message))
    .catch(err => console.log(err));
});

app.get('/:summoner/icon', async (req, res, next) => {
  const { data } = await $LoL.getSummonerIcon(req.params.summoner);
  let url = '';
  try {
    fs.accessSync(`${process.cwd()}/public/img/profile_icons/${data.iconId}.png`);
    url = `${process.cwd()}/public/img/profile_icons/${data.iconId}.png`
  } catch(err) {
    url = await $server.download(data.iconUrl, 'public/img/profile_icons', `${data.iconId}`, 'png');
  }
  res.sendFile(url);
});

module.exports = app;