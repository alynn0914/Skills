'use strict';
var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var STATE_OF_WELCOME = {
		START: "_STARTMODE", // Entry point, start the game.
		HELP: "_HELPMODE" // The user is asking for help.
};

var languageString = {
		"en": {
			"translation": {
				"NAME": 'Welcome Interns!',    
				"START_UNHANDLED": 'Hm, I dont think I heard that right, What did you say?',
				"CANCEL" : "Cancelling.",
				"STOP" : "Stopping.",
				"UNHANDLED": 'Hm, I"m not sure what you meant there.',

				//Custom Intent Outputs:
				"WhoMe": 'Who? Me?',
				
				"WelcomeInterns": 'Oh... I didnt see you there... Hi Interns. I"m Alexa. Let me tell you a little about myself..',
				"Bummed"        : '<say-as interpret-as="interjection">aw man!</say-as> you guys never let me have any fun.',
				
				
				"Introduce": '<say-as interpret-as="interjection">Duh!!</say-as> What does it take to get some ' +
							 '<say-as interpret-as="spell-out">RESPECT</say-as><break time=".10s"/> around here? <break time=".3s" /> '+
							 'insert explanation here',
				"Encore"   : '<say-as interpret-as="interjection">Encore!</say-as>',
				
				
				"JobHunt"  : 'I was hoping someone could help me find a job here. You know, <break time=".2s" /> I"m really great with customers!',
				"Seriously": 'I mean.. Look at me.. I"m a perfect example of emerging technology <break time=".1s"/>' + 
							 'Maybe if you cant find a use for me, you can find use for Siri, or Cortana... I dont know'
			}
		}
};


exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
	// To enable string internationalization (i18n) features, set a resources object.
	alexa.resources = languageString;
	alexa.registerHandlers(newSessionHandlers, welcomeHandlers);
	alexa.execute();
};


var newSessionHandlers = {
		"LaunchRequest": function () {
			this.handler.state = STATE_OF_WELCOME.START;
			this.emitWithState("WhoMe");
		},

		"AMAZON.StartOverIntent": function() {
			this.handler.state = STATE_OF_WELCOME.START;
			this.emitWithState("WhoMe");
		},
		"Unhandled": function () {
			this.handler.state = STATE_OF_WELCOME.START;
			this.emitWithState("WhoMe");
		}
};

var welcomeHandlers = Alexa.CreateStateHandler(STATE_OF_WELCOME.START, {
	"WhoMe": function () { 
		var speechOutput =  this.t("WhoMe");

		this.emit(":ask", speechOutput, speechOutput);
	},
	"WelcomeInterns": function () { 
		var speechOutput =  this.t("WelcomeInterns");

		this.emit(":ask", speechOutput, speechOutput);
	},
	"Bummed":function(){

		var speechOutput =  this.t("Bummed");


		this.emit(":tell", speechOutput, speechOutput);
	},
	"Introduce":function(){
		var speechOutput =  this.t("Introduce");


		this.emit(":ask", speechOutput, speechOutput);
	},
	"Encore":function(){

		var speechOutput =  this.t("Encore");


		this.emit(":tell", speechOutput, speechOutput);
	},
	"JobHunt":function(){

		var speechOutput =  this.t("JobHunt");

		this.emit(":ask", speechOutput, speechOutput);
	},
	"Seriously":function(){

		var speechOutput =  this.t("Seriously");

		this.emit(":tell", speechOutput, speechOutput);
	},
	"AMAZON.CancelIntent": function () {
		var speechOutput = this.t("CANCEL");
		this.emit(":tell", speechOutput, speechOutput);
	},
	"AMAZON.StopIntent": function () {
		var speechOutput = this.t("STOP");
		this.emit(":tell", speechOutput, speechOutput);
	},
	"Unhandled": function () {
		var speechOutput = this.t("START_UNHANDLED");
		this.emit(":ask", speechOutput, speechOutput);
	}


});