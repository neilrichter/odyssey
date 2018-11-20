const
  express = require('express'),
  fs = require('fs'),
  { $LoL, $server, $user } = require.main.require('./services'),
  app = express.Router();

app.get('/:summoner', (req, res, next) => {
  $LoL.getSummonerByName(req.params.summoner)
    .then(response => res.status(response.code).send(response.summoner || response.message))
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

app.post('/verify', async (req, res, next) => {
  let data = await $user.isVerified(req.body.discordId);
  if (!data.user) { 
    const { summoner } = await $LoL.getSummonerByName(req.body.summonerName);
    data.user = await $user.isVerifying(req.body.discordId, summoner.name);
    try {
      if (summoner) {
        data = !data.user ? await $user.startVerification(req.body.discordId, summoner) : await $user.verify(req.body.discordId, summoner);
      } else {
        data = { user: {}, status: 404 };
      }
    } catch (err) {
      console.log(err);
      data = { user: {}, status: 404 };
    }
  }
  return res.status(data.status).send(data.user);
});

module.exports = app;