'use strict';
var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var STATE_OF_GAME = {
    BINGO: "_BINGOMODE", // Bingo point
    CHECKER: "_CHECKER", //Check Bingo
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

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
    alexa.registerHandlers(newSessionHandlers, startGameHandlers, bingoGameHandlers, checkerGameHandlers);
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
    "AMAZON.HelpIntent": function() {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState("helpTheUser", true);
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
		var winners = 0;
		var repromptText = this.t("WELCOME");
		
		//Init();
		//amanda:
		Object.assign(this.attributes,{
			"speechOutput" : repromptText,
			"repromptText" : repromptText,
			"winners" : winners,
			"currentValues" : currentValues,
			"calledList": calledList,
			"shuffledList": shuffledList
		});
		//end amanda
		
		this.handler.state = STATE_OF_GAME.BINGO;
		
		this.emit(":ask", speechOutput, repromptText);
	}
});

//Amanda:

var bingoGameHandlers = Alexa.CreateStateHandler(STATE_OF_GAME.BINGO, {
	
	/*
	  	Intents : aka listeners
	*/
	//Creates the list of 5 bingo values and then calls the 5 values 
	"BingoCallerIntent": function () { 
		var a = [];
		for (i=0;i<5;i++){
			a[i] = shuffledList.queue.dequeue()
			currentValues += a[i]+"<break time='5s'/>"
			calledList.append(a[i])
		};
		
        Object.assign(this.attributes,{
			"speechOutput" : repromptText,
			"repromptText" : repromptText,
			"winners" : winners,
			"currentValues" : currentValues,
			"calledList": calledList,
			"shuffledList": shuffledList
		});
		
		var speechOutput = "The next five values are" + 
							this.attribute["currentValues"] +
							"Should I continue?"
						
		this.emit(":ask", speechOutput, speechOutput);
						
	},
	
	//Switches game state if BINGO is called
	"BingoCheckerIntent": function () {
		this.handler.state = STATE_OF_GAME.CHECKER;
    	this.emitWithState("BingoCheckerIntent");
	  
	},
	
	
	/*
 	Functions
	 */ 
	
    "KeepPlaying": function () {
        var speechOutput = "The last 5 called were " + 
        					this.attribute["cuurentValues"]
        					"Would you like the next values? Say next";
		this.emit(":ask", speechOutput, speechOutput);
    }
});

var checkerGameHandlers = Alexa.CreateStateHandler(STATE_OF_GAME.CHECKER, {
	"BingoCheckerIntent": function () {
        var correct = 0;
        var speechOutput;
        for (i=0;i<5;i++){
        	if (calledList.contains(slot[i])){
        		correct ++
        	}
        }
        if (correct = 5){
        	winners ++ 
        	speechOutput = "Bingo! Anyone else have Bingo? Say Bingo or Continue."
        }else{
        	speechOutput = "Womp womp, no Bingo! Anyone else have Bingo? Say Bingo or Continue."
        }
        
        Object.assign(this.attributes,{
			"speechOutput" : repromptText,
			"repromptText" : repromptText,
			"winners" : winners,
			"currentValues" : currentValues,
			"calledList": calledList,
			"shuffledList": shuffledList
		});
		
		this.emit(":ask", speechOutput, speechOutput);
        
    },
    "AfterCheckerIntent": function () {
    	var speechOutput = "";
        if(this.attribute["winners"] = 1){
        	speechOutput = "YAY! We have one very lucky winner! Would you like to play again? Say start over or play again."
        }else if (this.attribute["winners"] > 1){
        	speechOutput = "Wahoo! We have " + this.attribute["winners"] + "winners! Would you like to play again? Say start over or play again."
        }else if (this.attribute["winners"] = 0){
        	speechOutput = "Sorry, it looks like we dont have a winner yet! Would you like to keep playing? Say keep playing."
        };
		
		this.emit(":ask", speechOutput, speechOutput);
        
        
    },
    "KeepPlayingIntent": function () {
    	this.handler.state = STATE_OF_GAME.BINGO;
    	this.emitWithState("KeepPlaying");
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = STATE_OF_GAME.START;
        this.emitWithState("StartBingo", false);
    }
}

//end Amanda





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