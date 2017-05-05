'use strict';
var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var STATE_OF_GAME = {
    BINGO: "_BINGOMODE", // Bingo point
    CHECKER: "_CHECKER", //Check Bingo
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

//var ordered = require("./ordered_list");

var ordered = [
		'B1',
		'B2',
		'B3',
		'B4',
		'B5',
		'B6',
		'B7',
		'B8',
		'B9',
		'B10',
		'B11',
		'B12',
		'B13',
		'B14',
		'B15',
		'I16',
		'I17',
		'I18',
		'I19',
		'I20',
		'I21',
		'I22',
		'I23',
		'I24',
		'I25',
		'I26',
		'I27',
		'I28',
		'I29',
		'I30',
		'N31',
		'N32',
		'N33',
		'N34',
		'N35',
		'N36',
		'N37',
		'N38',
		'N39',
		'N40',
		'N41',
		'N42',
		'N43',
		'N44',
		'N45',
		'G46',
		'G47',
		'G48',
		'G49',
		'G50',
		'G51',
		'G52',
		'G53',
		'G54',
		'G55',
		'G56',
		'G57',
		'G58',
		'G59',
		'G60',
		'O61',
		'O62',
		'O63',
		'O64',
		'O65',
		'O66',
		'O67',
		'O68',
		'O69',
		'O70',
		'O71',
		'O72',
		'O73',
		'O74',
		'O75'
	];


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
        this.handler.state = STATE_OF_GAME.HELP;
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
		//var shuffledList = shuffle(ordered[OrderedList]);
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
		var i;
		var calledList = this.attributes.calledList;
		var currentValues = "";
		var repromptText = this.attributes.repromptText;
		var winners = this.attributes.winners;
		var shuffledList = this.attributes.shuffledList;
		
		for (i=0;i<5;i++){
//			a[i] = this.attributes.shuffledList.queue.dequeue();
			a[i] = shuffledList.pop();
			currentValues += a[i]+"<break time='2s'/>";
//			currentValues += a[i]+". ";
			calledList.push(a[i]);
		}
		
        Object.assign(this.attributes,{
			"speechOutput" : repromptText,
			"repromptText" : repromptText,
			"winners" : winners,
			"currentValues" : currentValues,
			"calledList": calledList,
			"shuffledList": shuffledList
		});
		
		var speechOutput = "The next five values are <break time='2s'/>" + 
							currentValues +
							"Should I continue?";
						
		this.emit(":ask", speechOutput, speechOutput);
						
	},
	
	//Switches game state if BINGO is called
	"BingoCalledIntent": function () {
		this.handler.state = STATE_OF_GAME.CHECKER;
		var speechOutput = "We have a Bingo! Please tell me your 5 values. If you have a free space, please say Free Space";
		this.emit(":ask", speechOutput, speechOutput);	  
	},
	
	
	/*
 	Functions
	 */ 
	
    "KeepPlaying": function () {
        var speechOutput = "The last 5 called were <break time='2s'/>" + 
        					this.attribute.currentValues +
        					"Would you like the next values? Say next";
		this.emit(":ask", speechOutput, speechOutput);
    }
});

var checkerGameHandlers = Alexa.CreateStateHandler(STATE_OF_GAME.CHECKER, {
	"BingoCheckerIntent": function () {
        var correct = 0;
        var i = 0;
        var speechOutput = "";
        var arr = [];
        
        var calledList = this.attributes.calledList;
		var currentValues = this.attributes.currentValues;
		var repromptText = this.attributes.repromptText;
		var winners = this.attributes.winners;
		var shuffledList = this.attributes.shuffledList;
        
        var BingoVal1 = this.event.request.intent.slots.BingoA;
        var BingoVal2 = this.event.request.intent.slots.BingoB;
        var BingoVal3 = this.event.request.intent.slots.BingoC;
        var BingoVal4 = this.event.request.intent.slots.BingoD;
        var BingoVal5 = this.event.request.intent.slots.BingoE;
        
        
        if (BingoVal1 !== ""){
        	arr = BingoVal1.toString().split(" ");
        }
        
        for(i=0;i<arr.legth;i++){
        	if(this.attributes.calledList.indexOf(arr[i]) > -1){
        		correct +1;
        	}
        }
//		
//        
//        //Check the five slots:
//        if (this.attributes.calledList.indexOf(this.event.request.intent.slots.BingoA) > -1){
//        	correct ++;
//        }
//        if (this.attributes.calledList.indexOf(this.event.request.intent.slots.BingoB) > -1){
//        	correct ++;
//        }
//        if (this.attributes.calledList.indexOf(this.event.request.intent.slots.BingoC) > -1){
//        	correct ++;
//        }
//        if (this.attributes.calledList.indexOf(this.event.request.intent.slots.BingoD) > -1){
//        	correct ++;
//        }
//        if (this.attributes.calledList.indexOf(this.event.request.intent.slots.BingoE) > -1){
//        	correct ++;
//        }

        
        
        
        if (correct === 5){
        	this.attributes.winners ++; 
        	speechOutput = BingoVal1 + " Bingo! Anyone else have Bingo? Say Bingo or Continue.";
        }else{
        	speechOutput = BingoVal1 + "Womp womp, no Bingo! You had " + correct + " correct. Anyone else have Bingo? Say Bingo or Continue.";
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
        if(this.attribute.winners == 1){
        	speechOutput = "YAY! We have one very lucky winner! Would you like to play again? Say start over or play again.";
        }else if (this.attribute.winners > 1){
        	speechOutput = "Wahoo! We have " + this.attribute.winners + "winners! Would you like to play again? Say start over or play again.";
        }else if (this.attribute.winners === 0){
        	speechOutput = "Sorry, it looks like we dont have a winner yet! Would you like to keep playing? Say keep playing.";
        }
		
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
});

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