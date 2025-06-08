const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, name, company, device, markets, message, newsletter } = JSON.parse(event.body);

    // Create or update contact in Mailchimp
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: name.split(' ')[0],
        LNAME: name.split(' ').slice(1).join(' '),
        COMPANY: company,
        DEVICE: device,
        MARKETS: markets,
        MESSAGE: message
      },
      tags: newsletter ? ['Newsletter Subscriber'] : []
    });

    // Send notification email using Mailchimp's transactional email
    if (process.env.MAILCHIMP_TEMPLATE_ID) {
      await mailchimp.messages.sendTemplate({
        template_id: process.env.MAILCHIMP_TEMPLATE_ID,
        template_content: [],
        message: {
          to: [{ email: process.env.NOTIFICATION_EMAIL }],
          merge_vars: [{
            rcpt: process.env.NOTIFICATION_EMAIL,
            vars: [
              { name: 'NAME', content: name },
              { name: 'EMAIL', content: email },
              { name: 'COMPANY', content: company },
              { name: 'DEVICE', content: device },
              { name: 'MARKETS', content: markets },
              { name: 'MESSAGE', content: message },
              { name: 'NEWSLETTER', content: newsletter ? 'Yes' : 'No' }
            ]
          }]
        }
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully subscribed' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to subscribe' })
    };
  }
}; 