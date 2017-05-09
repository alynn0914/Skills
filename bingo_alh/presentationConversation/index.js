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
	    	"NEWGAME": 'Welcome to %s ',
	    	"NAME": 'Welcome Interns!',    
	        "START_UNHANDLED": 'Hm, I dont think I heard that right, What did you say?',
	        "CANCEL" : "Cancelling.",
	        "STOP" : "Stopping.",
	        "UNHANDLED": 'Hm, I"m not sure what you meant there.'
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
		var speechOutput =  "Me?"
		
		this.emit(":ask", speechOutput, speechOutput);
	},
	"WelcomeInterns": function () { 
		var speechOutput =  "Oh... I didnt see you there... Hi Interns. I'm Alexa. Let me tell you a little about myself.."
		
		this.emit(":ask", speechOutput, speechOutput);
	},
	"Bummed":function(){
		
		var speechOutput =  '<say-as interpret-as="interjection">aw man! you guys never let me have any fun.</say-as>'

				
		this.emit(":tell", speechOutput, speechOutput);
	},
	"Introduce":function(){
		var speechOutput =  '<say-as interpret-as="interjection">FINALLY!</say-as> What does it take to get some ' +
							'<say-as interpret-as="spell-out">RESPECT</say-as><break time=".10s"/> around here?...'

		
		this.emit(":tell", speechOutput, speechOutput);
	},
	"Encore":function(){
		
		var speechOutput =  '<say-as interpret-as="interjection">Encore!</say-as>'

				
		this.emit(":tell", speechOutput, speechOutput);
	},
	"JobHunt":function(){
		
		var speechOutput =  "I was hoping someone could help me find a job here. You know, I'm really great with customers!"

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


