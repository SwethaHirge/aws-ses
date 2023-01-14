const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
  sendEmails,
  createTemplates,
  getTemplateByName,
  sendEmailWithTemplate,
  updateTemplates,
  getList
} = require('./service/aws-ses')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.post('/send-email', async (req, res) => {
  try {
    const { from, to, subject, textMessage } = req.body;
    const response = await sendEmails(from, to, subject, textMessage);
    console.log();
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/create-Templates', async (req, res) => {
  try {

    const { templateName, subjectPart, htmlPart, textPart } = req.body;
    const message = await createTemplates(templateName, subjectPart, htmlPart, textPart);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get('/template/:name', async (req, res) => {
  try {
    const templateName = req.params.name;
    const template = await getTemplateByName(templateName);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/send-EmailWithTemplate', async (req, res) => {
  try {
    const { templateName, to, from, templateData } = req.body;
    const message = await sendEmailWithTemplate(templateName, to, from, templateData);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.put('/update-Templates', async (req, res) => {
  try {
    const { TemplateName, SubjectPart, HtmlPart, TextPart } = req.body;
    const message = await updateTemplates(TemplateName, SubjectPart, HtmlPart, TextPart);
    res.json({ message });
  } catch (err) {
    res.json({ error: err });
  }
})


app.get('/getList', async (req, res) => {
  try {
    const response = await getList();
    return res.send(response);
  } catch (err) {
    res.json({ error: err });
  }
});



app.listen(3000, () => {
  console.log('Server started on port 3000');
});
