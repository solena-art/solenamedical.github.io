const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.handler = async function(event, context) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const formData = JSON.parse(event.body);
        
        // Configure API key authorization
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        // Create contact
        const apiInstance = new SibApiV3Sdk.ContactsApi();
        const createContact = new SibApiV3Sdk.CreateContact();
        
        createContact.email = formData.email;
        createContact.attributes = {
            FIRSTNAME: formData.name.split(' ')[0],
            LASTNAME: formData.name.split(' ').slice(1).join(' '),
            COMPANY: formData.company,
            DEVICE_TYPE: formData.device,
            TARGET_MARKETS: formData.markets,
            MESSAGE: formData.message
        };
        
        if (formData.newsletter) {
            createContact.listIds = [parseInt(process.env.BREVO_LIST_ID)];
        }
        
        createContact.updateEnabled = true;

        await apiInstance.createContact(createContact);

        // Send notification email
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.sender = {
            name: 'SOLENA Contact Form',
            email: 'noreply@solenamedical.com'
        };
        sendSmtpEmail.to = [{
            email: 'info@solenamedical.com',
            name: 'SOLENA Team'
        }];
        sendSmtpEmail.subject = 'New Contact Form Submission';
        sendSmtpEmail.htmlContent = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Company:</strong> ${formData.company}</p>
            <p><strong>Device Type:</strong> ${formData.device}</p>
            <p><strong>Target Markets:</strong> ${formData.markets}</p>
            <p><strong>Message:</strong> ${formData.message}</p>
            <p><strong>Newsletter Subscription:</strong> ${formData.newsletter ? 'Yes' : 'No'}</p>
        `;

        const apiInstance2 = new SibApiV3Sdk.TransactionalEmailsApi();
        await apiInstance2.sendTransacEmail(sendSmtpEmail);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Form submitted successfully" })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to submit form" })
        };
    }
}; 