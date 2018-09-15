module.exports = {
  handleRequest
};

const axios = require('axios');
const apiUrl = 'https://slack.com/api';
const qs = require('querystring');

var questTemplates = {
  "Alarm" : ["Ship shield - ON/OFF", "All doors locked.:closed_lock_with_key: The spaceship is safe!"],
  "Documents" : ["Message in the bottle", "Message in the bottle read and signed, user documentation completed.:page_with_curl: Ready to dock."],
  "Improvements" : ["Ship upgrade", "Your Captain appreciates what you’re doing!:tada: Join our special forces and help us achieve more. The spaceship accelerates with the speed of sound!:rocket:"],
  "Delivery" : ["Special Delivery", "Guess what! Special delivery from own friendly space station Tesco has just arrived, time for unloading! :tesco: Thanks to this, we may survive another week in space.\n\nConsequences of failed mission: starvation"],
  "Event" : ["Space hoopla", "Hands needed, we cannot win the battle solo.:pray:"],
  "Interview" : ["Castaway", "A castaway from another planet is planning to join our ranks and strengthen the crew. We need a help in verifying that he or she have the necessary powers and skills. It is also obligatory to X-ray his/her personality to check if he/she is not a spy.:male-detective:"],
  "CleaningSmall" : ["Action contamination!", "Warning! Achtung! Attenzione! Pozor! :sos:\nAlien forms of life will find a wheel: contamination and evacuation danger!:skull::radioactive_sign:"]
}

function handleRequest(request, response) {
  // extract the slash command text, and trigger ID from payload
  const { text, trigger_id } = request.body;
  var name = text
  var desc = ""
  if (questTemplates[text]){
    var quest = questTemplates[text]
    name = quest[0]
    desc = quest[1]
  }
  

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
            value: name,
            hint: 'Name of the quest',
          },
          {
            label: 'Description',
            type: 'textarea',
            name: 'description',
            value: desc,
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
            optional: true,
            hint: 'Number of heroes needed',
          },
        ]
      }),
    };

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
