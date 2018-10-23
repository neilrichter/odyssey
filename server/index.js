const
  app = require('express')(),
  server = app.listen(3030),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  path = require('path'),
  config = require('./config');

global.rootDir = path.dirname(require.main.filename);

process.title = 'Odyssey Server';

app.use(require('./middlewares/requests'));
app.use(cors({
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/hello', require('./controllers/hello'));