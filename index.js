const express = require('express')
const app = express()
var exec = require('child_process').exec;

var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/deploy', function(req, res) {

  var payload = req.body.payload;
  var reproName = payload.repository.name;
  var branchName = payload.ref.toString().split('/').slice(-1)[0];

  var bashCmd = 'cd ../' + reproName + '\n';
  bashCmd += 'git pull origin master \n';
  bashCmd += 'npm run deloy';

  if(branchName === 'master') {
    exec(bashCmd, function(error, stdout, stderr) {
      if(error !== null) {
        res.status(500).send(stderr);
      }
      else {
        res.status(200).send(stdout);
      }
    });
  }
  else {
    res.status(400).send('Webhook only works for master branch.')
  }

});

app.listen(5000, () => console.log('Webhook listener app listening on port 5000!'))
