(function () {
    var self = this;

    //Game state
    self.pack = ['hearts', 'spades', 'diamonds', 'clubs'];
	self.enableButtons = ko.observable(true);
    self.chooseAce = ko.observable(false);
    self.acesValue = ko.observable(0);
    self.deck = ko.observableArray([]);
    self.dealerHand = ko.observableArray([]);
    self.playerHand = ko.observableArray([]);
    self.result = ko.observable();
	self.wordsies = {
		win : 'YOU WIN BOOM BOOM BOOM CELEBRATIONS ON YOUR FACE',
		draw : 'DRAW! Dealer unhappily refunds your bet',
		lose : 'YOU LOSE! HAHAH. NEVER MIND. TRY AGAIN.',
		start : 'GO GO GO GO GO LET US PLAY'
	};
    
    self.playerScore = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < self.playerHand().length; i++) {
            total += self.playerHand()[i].value;
        }
        return total + self.acesValue();
    });

    self.dealerScore = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < self.dealerHand().length; i++) {
            total += self.dealerHand()[i].value;
        }
        return total;
    });    

    self.makeDeck = function () {
        self.pack.forEach(function (currentValue, index) {
            for (var j = 1; j < 14; j++) {
                var cardName = j === 1 ? "Ace" : j === 11 ? "Jack" : j === 12 ? "Queen" : j === 13 ? "king" : j;
                self.deck.push({
                    'cardName': cardName + " " + currentValue,
                    value: j < 11 ? j : 10
                });
            }
        });
    };

	
	


    //Game functions     
    self.deal = function (who) {
        var r = Math.floor(Math.random() * self.deck().length);
        
        //if player draws Ace let them CHOSE
        if (self.deck()[r].value === 1) {
			if (who == self.playerHand) {
				self.enableButtons(false);            
				self.chooseAce(true);        
			}
			else { //if dealer gets an ace = chose val depending on current score
				if (self.dealerScore() < 10) {
					self.deck()[r].value = 11;
				}
			}			
        } 		
        who.push(self.deck()[r]); //add card to deck
        self.deck().splice(r, 1);
        return self.deal;
    };

    self.hit = function () {
        self.deal(self.playerHand);
        self.checkScore("player");
        self.chooseAce(false);
    };

    self.stick = function () {
        self.enableButtons(false);
        self.deal(self.dealerHand);
        self.checkScore("dealer");
    };

    self.start = function () {
        self.enableButtons(true);   
        self.acesValue(0);
        self.chooseAce(false);
        self.makeDeck();
        self.dealerHand.removeAll();
        self.playerHand.removeAll();
        self.deal(self.dealerHand);        
        self.deal(self.playerHand)(self.playerHand);
        self.result(self.wordsies.start);
    };

    self.checkScore = function (who) {
        if (who === "dealer") {
            if (self.dealerScore() > 21) {
                self.result(self.wordsies.win);
            } else if (self.dealerScore() < self.playerScore()) {
                setTimeout(function () {
                    self.stick();
                }, 1000);
            } else if (self.dealerScore() > self.playerScore()) {
                self.result(self.wordsies.lose);
            } else if (self.dealerScore() === self.playerScore()) {
                self.result(self.wordsies.draw);
            }
        } else {
            if (self.playerScore() > 21) {
                self.enableButtons(false);
                self.result(self.wordsies.lose);
            } else {
                self.enableButtons(true);
            }
        }
    };
    
    self.chooseAce1 = function () {
        self.chooseAce(false);
        self.checkScore();
    };
    self.chooseAce11 = function () {
        self.acesValue(10);
        self.chooseAce(false);
        self.checkScore();
    }; 

    //start game    
    self.start();
	
	ko.applyBindings(self);
})();

