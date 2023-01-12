const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const ses = new AWS.SES({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1'
});

app.post('/send-email', (req, res) => {
  // basic validation for request body
  if(!req.body.to || !req.body.from || !req.body.subject || !req.body.body) {
    return res.status(400).json({ error: 'to, from, subject, and body fields are required' });
  }

    const params = {
        Destination: {
            ToAddresses: [req.body.to]
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: req.body.body
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: req.body.subject
            }
        },
        Source: req.body.from
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Email sent successfully.' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
