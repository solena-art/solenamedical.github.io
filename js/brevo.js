// Brevo API Integration
const BREVO_API_KEY = 'YOUR_BREVO_API_KEY'; // Replace with your actual API key
const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

// Function to create a contact in Brevo
async function createBrevoContact(formData) {
    const contactData = {
        email: formData.get('email'),
        attributes: {
            FIRSTNAME: formData.get('name').split(' ')[0],
            LASTNAME: formData.get('name').split(' ').slice(1).join(' '),
            COMPANY: formData.get('company'),
            DEVICE_TYPE: formData.get('device'),
            TARGET_MARKETS: formData.get('markets'),
            MESSAGE: formData.get('message')
        },
        listIds: [2], // Replace with your actual list ID for newsletter subscribers
        updateEnabled: true
    };

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            throw new Error('Failed to create contact');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}

// Function to send a transactional email
async function sendTransactionalEmail(formData) {
    const emailData = {
        sender: {
            name: 'SOLENA Contact Form',
            email: 'noreply@solenamedical.com'
        },
        to: [{
            email: 'info@solenamedical.com',
            name: 'SOLENA Team'
        }],
        subject: 'New Contact Form Submission',
        htmlContent: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.get('name')}</p>
            <p><strong>Email:</strong> ${formData.get('email')}</p>
            <p><strong>Company:</strong> ${formData.get('company')}</p>
            <p><strong>Device Type:</strong> ${formData.get('device')}</p>
            <p><strong>Target Markets:</strong> ${formData.get('markets')}</p>
            <p><strong>Message:</strong> ${formData.get('message')}</p>
            <p><strong>Newsletter Subscription:</strong> ${formData.get('newsletter') ? 'Yes' : 'No'}</p>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
} 