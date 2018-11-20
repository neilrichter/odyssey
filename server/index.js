const
  express = require('express'),
  app = express(),
  server = app.listen(3030),
  chalk = require('chalk'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  config = require('./config'),
  { $server } = require('./services');

process.title = 'Odyssey Server';

app.use(express.static(__dirname + '/public'));

app.use(require('./middlewares/requests'));
app.use(cors({
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/hello', require('./controllers/hello'));
app.use('/tournaments', require('./controllers/tournaments'));
app.use('/summoners', require('./controllers/summoners'));
app.use('/users', require('./controllers/users'));

$server.checkDatabase();