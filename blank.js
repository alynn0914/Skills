'use strict';
var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var STATE_OF_GAME = {
    BINGO: "_BINGOMODE", // Bingo point
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};


// How to do HashSet?  Currently just using Array
var ordered = require("./ordered_list");


var languageString = {
	"en": {
	    "translation": {
	    	"NEWGAME": 'Welcome to %s ',
	    	"NAME": 'MetLife Bingo! ',    
	    	"INSTRUCTIONS": 'These are the instructions.  I will call out five values per round. ' +
	    				 	'If you do not catch a value, say repeat when I complete the round and I will repeat the most recent five values. ' +
	    				 	'If you have a Bingo, you may call it out at any time by saying Alexa, bingo. ',
			"WELCOME": 'Lets begin!',
	    	"ANOTHER_GAME_WELCOME":'Ready for the next round? Here we go!',
	        "START_UNHANDLED": 'Say start to start a new game.'
	     }
	 }
};


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startGameHandlers);
    alexa.execute();
};


var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = STATE_OF_GAME.START;
        this.emitWithState("StartBingo", true);
    },   
    "AMAZON.StartOverIntent": function() {
        this.handler.state = STATE_OF_GAME.START;
        this.emitWithState("StartBingo", false);
    },
    "Unhandled": function () {
        var speechOutput = this.t("START_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    }
};

var startGameHandlers = Alexa.CreateStateHandler(STATE_OF_GAME.START, {
	"StartBingo": function (newgame) { 
		var speechOutput =  newgame ? this.t("NEWGAME", this.t("NAME")) + this.t("INSTRUCTIONS") + this.t("WELCOME") : this.t("ANOTHER_GAME_WELCOME");
		var shuffledList = shuffle(ordered);
		var calledList = [];
		var currentValues = "";
		var repromptText = this.t("WELCOME");
		
		//Init();
		//amanda:
		Object.assign(this.attributes,{
			"speechOutput" : repromptText,
			"repromptText" : repromptText,
			"winners" : 0,
			"currentValues" : currentValues,
			"shuffledList": shuffledList
		});
		//end amanda
		
		this.handler.state = STATE_OF_GAME.BINGO;
		
		this.emit(":ask", speechOutput, repromptText);
	},
	"StartGameIntent": function() {
	    	this.handler.state = STATE_OF_GAME.START;
	    	this.emitWithState("StartBingo", false);
	    },
	"AMAZON.StartOverIntent": function () {
        this.handler.state = STATE_OF_GAME.START;
        this.emitWithState("StartBingo", false);
    },
    "Unhandled": function () {
        var speechOutput = this.t("START_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    }
});

var bingoGameHandlers = Alexa.CreateStateHandler(STATE_OF_GAME.BINGO, {
	"BingoCallIntent": function() {
		
	}
});

function Init() {
	
	var shuffled_list = [];
	var called_list = [];
	var winner = 0;
	
	shuffled_list = shuffle(ordered);
	
	Object.assign{
		
	}
}

function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
}