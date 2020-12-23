const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 8081;
const app = express();
const router = express.Router()
const routes = require('./routes')(router, {});

app.use(cors());
app.use(express.json());

app.use('/api', routes)

app.listen(port, () =>
  console.log(`<Website Backend server> listening on port ${port}`)
);

