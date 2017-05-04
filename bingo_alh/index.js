'use strict';
var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var STATE_OF_GAME = {
    BINGO: "_BINGOMODE", // Bingo point
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var ordered = require("./ordered_list");

//testing something minor

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
    
    //Amanda:
    "BingoCallerIntent": function () {
        this.handler.state = STATE_OF_GAME.BINGO;
        this.emitWithState("CreateCall");
    },
    "BingoCheckerIntent": function () {
        this.handler.state = STATE_OF_GAME.BINGO;
        this.emitWithState("BingoChecker");
    },
    "AfterBingoIntent": function () {
        this.handler.state = STATE_OF_GAME.BINGO;
        this.emitWithState("AfterBingoChecker");
    },
    "KeepPlayingIntent": function () {
        this.handler.state = STATE_OF_GAME.BINGO;
        this.emitWithState("KeepPlaying");
    },
    //end Amanda
    
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
        speechOutput = this.t("START_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    }
});

//Amanda:

var bingoGameHandlers = Alexa.CreateStateHandler(STATE_OF_GAME.BINGO, {
	"CreateCall": function () { 
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
		
		
		
		this.handler.state = STATE_OF_GAME.BINGO;
    	this.emitWithState("BingoCaller");
	},
	"BingoCaller": function() {
		speechOutput = "The next five values are" + 
						values +
						"Should I continue?"
						
		this.emit(":ask", speechOutput, speechOutput);
						
	},
	"BingoChecker": function () {
        var correct = 0;
        var speechOutput;
        for (i=0;i<5;i++){
        	if (calledList.contains(slot[i])){
        		correct ++
        	}
        };
        if (correct = 5){
        	winners ++ 
        	speechOutput = "Bingo! Anyone else have Bingo? Say Bingo or Continue."
        }else{
        	speechOutput = "Womp womp, no Bingo! Anyone else have Bingo? Say Bingo or Continue."
        };
        
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
    "AfterBingoChecker": function () {
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
    "KeepPlaying": function () {
        var speechOutput = "The last 5 called were " + 
        					this.attribute["cuurentValues"]
        					"Would you like to continue?";
		this.emit(":ask", speechOutput, speechOutput);
    }
});

//end Amanda





//function Init() {
//	
//	var shuffled_list = [];
//	var called_list = [];
//	var winner = 0;
//	
//	shuffled_list = shuffle(ordered);
//	
//	Object.assign{
//		
//	}
//}





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