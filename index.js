const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Log = require('./model/log');

mongoose.connect(
  'mongodb://localhost/express_log',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.set('useFindAndModify', true);

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
});

morgan.token('resBody', (_req, res) =>
  res.__custombody__
)

function saveMessage(message) {
  const log = new Log(JSON.parse(message));
  log.save();
}

const app = express()

const originalSend = app.response.send

app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body)
  this.__custombody__ = body;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan(`{ 
  "method": ":method", 
  "url": ":url", 
  "status": ":status", 
  "remote_address": ":remote-addr",
  "response_time": ":response-time", 
  "agent": ":user-agent",
  "body": :body,
  "response_body": :resBody
}`, {
  stream: {
    write: (message) => {
      saveMessage(message)
    }
  },
  skip: (req, res) => {return res.statusCode === 404}
}))

app.post('/', function (req, res) {
  res.json({
    type: false,
    message: 'error'
  })
})

app.get('/get', function (req, res) {
  res.json({
    type: true,
    message: 'success'
  })
})

app.listen(3000, () => {
  console.log('server is running');
})