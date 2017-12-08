var restify = require('restify');
var builder = require('botbuilder');
var jsonquery = require('json-query');

var data =  { contact :[ 
{"name": "Vinod Kumar", "Phone": "732-980-2477"}, 
{"name": "Suresh Gumidyala", "Phone": "732-980-3809"},
{"name": "Rajesh", "Phone": "732-980-3819"} 
]
} ;

// Setup Restify Server
var server = restify.createServer();
//server.listen(process.env.port || process.env.PORT || 3978, function () {
  // console.log('%s listening to %s', server.name, server.url); 
//});
server.listen(3978,'usc0lpit006',function () {
  console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
/*
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});
*/

var bot = new builder.UniversalBot(connector, [
  (session, args, next) => {
        session.send(`Hi there! I'm a sample bot showing how multiple dialogs work.`);
        session.send(`Let's start the first dialog, which will ask you your name.`);

        // Launch the getName dialog using beginDialog
        // When beginDialog completes, control will be passed
        // to the next function in the waterfall
        session.beginDialog('contacts');
    }
    // Ask the user for their name and greet them by name.

  ]);
  
  
 bot.dialog('contacts', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
	function(session,results) {
		session.dialogData.Name = results.response;
		session.send(`Greetings :${session.dialogData.Name}`);
		builder.Prompts.text(session,"Who's Contact you want");
	},
    function (session, results) {
		var ContactName = results.response;
		session.dialogData.phonenumber = getContact(ContactName);
        session.endDialog(`Hello ${results.response}! ${session.dialogData.phonenumber}`);
    }
 ]);
 
 function getContact(ContactName) {
	 var phonenumber = jsonquery('contact[name=$ContactName].Phone', {data:data }).value
	 return phonenumber;
 }
