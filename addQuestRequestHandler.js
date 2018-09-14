module.exports = {
  handleRequest(request, response) {
    handleRequest(request, response)
  },
  handleDialogSumbition(request, response) {
    handleDialogSumbition(request, response)
  }
};

const axios = require('axios');
const apiUrl = 'https://slack.com/api';
const qs = require('querystring');

function handleRequest(request, response) {
  // extract the slash command text, and trigger ID from payload
  const { text, trigger_id } = request.body;

  console.log(request)

  // Verify the signing secret
    console.log('Verified');
    // create the dialog payload - includes the dialog structure, Slack API token,
    // and trigger ID
    const dialog = {
      token: process.env.SLACK_BOT_TOKEN,
      trigger_id,
      dialog: JSON.stringify({
        title: 'Submit a helpdesk ticket',
        callback_id: 'submit-ticket',
        submit_label: 'Submit',
        elements: [
          {
            label: 'Name',
            type: 'text',
            name: 'name',
            value: text,
            hint: 'Name of the quest',
          },
          {
            label: 'Description',
            type: 'textarea',
            name: 'description',
            optional: true,
            hint: 'Quest description',
          },
          {
            label: 'Experience',
            type: 'select',
            name: 'exp',
            options: [
              { label: '5 xp', value: 5 },
              { label: '10 xp', value: 10 },
              { label: '15 xp', value: 15 },
              { label: '20 xp', value: 20 },
              { label: '25 xp', value: 25 },
              { label: '50 xp', value: 50 },
              { label: '100 xp', value: 100 },
            ]
          },
          {
            label: 'Number of heroes',
            type: 'text',
            subtype: 'number',
            name: 'heroesLimit',
            value: 1,
            hint: 'Number of heroes needed',
          },
        ]
      }),
    };

    console.log(dialog)
    console.log(qs.stringify(dialog))

    // open the dialog by calling dialogs.open method and sending the payload
    axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialog), {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((result) => {
        response.send('');
      }).catch((err) => {
        console.log('dialog.open call failed: %o', err);
        response.sendStatus(500);
      });
}
