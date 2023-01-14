const AWS = require('aws-sdk');

const ses = new AWS.SES({
    accessKeyId: 'AKIA37XTPCYIQIMVEG2H',
    secretAccessKey: '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',
    region: 'us-east-1'
});


const sendEmails = async (to, from, subject, textMessage) => {
    try {
        const params = {
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: textMessage
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: from
        };

        const data = await ses.sendEmail(params).promise();
        console.log(data);
        return `Email sent to ${to}`;
    } catch (err) {
        console.log(err);
        throw new Error(`Failed to send email to ${to}`);
    }
};

const createTemplates = async (templateName, subjectPart, htmlPart, textPart) => {
    try {
        const params = {
            Template: {
                TemplateName: templateName,
                SubjectPart: subjectPart,
                TextPart: textPart,
                HtmlPart: htmlPart
            }
        };
        console.log(params);
        const data = await ses.createTemplate(params).promise();
        console.log(data);
        return `Template ${templateName} created successfully`;
    } catch (err) {
        console.log(err);
        if (err.code === 'AlreadyExistsException') {
            throw new Error(`Template ${templateName} already exists`);
        } else {
            throw new Error(`Failed to create template ${templateName}`);
        }
    }
};


const getTemplateByName = async (templateName) => {
    try {
        const params = {
            TemplateName: templateName
        };
        const data = await ses.getTemplate(params).promise();
        return data;
    } catch (err) {
        console.log(err);
        if (err.code === 'TemplateDoesNotExist') {
            throw new Error(`Template ${templateName} does not exist`);
        } else {
            throw new Error(`Failed to retrieve template ${templateName}`);
        }
    }
};

const sendEmailWithTemplate = async (templateName, to, from, name) => {
    try {

        const templateData = { name: name };
        const params = {
            Template: templateName,
            Destination: { ToAddresses: [to] },
            Source: from,
            TemplateData: JSON.stringify(templateData)
        };
        const data = await ses.sendTemplatedEmail(params, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
            }
        }).promise();
        return 'Email sent successfully';
    } catch (err) {
        console.log(err);
        throw new Error('Failed to send email')
    }
}


const updateTemplates = async (templateName, subject, htmlPart, textPart) => {
    try {
        const params = {
            Template: {
                TemplateName: templateName,
                SubjectPart: subject,
                HtmlPart: htmlPart,
                TextPart: textPart
            }
        };
        const data = await ses.updateTemplate(params).promise();
        console.log(data);
        return `Template ${templateName} updated successfully`;
    } catch (err) {
        console.log(err);
        throw new Error(`Failed to update template ${templateName}`)
    }

}

const getList = async () => {
    try {
        const data = await ses.listTemplates().promise();
        return data.TemplatesMetadata;
    } catch (err) {
        return err;
    }
}

module.exports = {
    sendEmails,
    createTemplates,
    getTemplateByName,
    sendEmailWithTemplate,
    updateTemplates,
    getList
}