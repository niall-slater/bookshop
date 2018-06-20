/* GLOBALS */

/*
TODO:	players should be able to specify the number of copies
		they're buying
TODO:	there should be an option to return books that haven't
		sold at a penalty
TODO:	add more funny book title possibilities
TODO:	add events you have to deal with like author complaints
TODO:	add expenditure so lots of books cost money or effort to stock
*/

//Groups
var groupBackground;
var groupCharacters;
var groupItems;
var groupEffects;
var groupText;

//Tilemap layers
var layer0;
var layer1;
var layer2;

//Scenery & Objects
var map;

//Nav
var navPoints_books;

var point_enter = {
	x: 8,
	y: 72
}
var point_exit = {
	x: 8,
	y: 120
}
var point_buy = {
	x: 280,
	y: 88
}

var spawnMax = 10;
var spawnTimer = spawnMax;

//UI
var slickUI;
var tickerText;
var cash = 50;

var stockIndex = 0;

var newsTimer;
var newsInterval = 30;
var bookCatalogue = [];
var bookStock = [];

var popularity = 20;
var popularityMin = 0;
var popularityMax = 100;

var expenditure = 0;
var expenditureInterval = 5;
var expenditureTimer;

var fontStyle = { font: "10px sans-serif", fill: "#fff", boundsAlignH: "left", boundsAlignV: "bottom", wordWrap: "true", wordWrapWidth: 330};
var styleDark = { font: "10px sans-serif", fill: "#333", boundsAlignH: "left", boundsAlignV: "bottom", wordWrap: "true", wordWrapWidth: 330, fontWeight: 600};
var styleDarkWrap = { font: "10px sans-serif", fill: "#333", boundsAlignH: "left", boundsAlignV: "top", wordWrap: "true", wordWrapWidth: 70, fontWeight: 600};
var styleDarkSmall = { font: "8px sans-serif", fill: "#333", fontWeight: 600};


/* SLICK COMPONENTS */
var button_buy;
var button_view;
var button_status;
var panel_ordering;
var panel_stock;
var panel_status;

var currentInterests = {
	'technology': 0,
	'politics': 0,
	'space': 0,
	'nature': 0,
	'business': 0,
	'mindfulness': 0,
	'history': 0,
	'music': 0,
	'gaming': 0
};

var topInterest;

var playState = {
    
    //State Information
	
	preload: function() {
        
		//Slick UI library
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
		groupCharacters = game.add.group();
		groupItems = game.add.group();
		groupEffects = game.add.group();
		groupText = game.add.group();
        
        game.stage.disableVisibilityChange = true;
	},

	create: function () {
		
		//Start physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.world.setBounds(0, 0, mapWidthDefault, mapHeightDefault);
		
		//Set up fullscreen
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setShowAll();
		game.scale.refresh();
		
		//Create map
		map = game.add.tilemap('map_bookshop_building');
		map.addTilesetImage('roguelike_general', 'tiles_roguelike');
		layer0 = map.createLayer('building');
		layer0.resizeWorld();
		layer1 = map.createLayer('fixtures');
		layer1.resizeWorld();
		layer2 = map.createLayer('furniture');
		layer2.resizeWorld();
		
		//Load nav points
		
		navPoints_books = [
			{x: 24, y: 56},
			{x: 40, y: 56},
			{x: 56, y: 56},
			{x: 72, y: 56},
			{x: 104, y: 56},
			{x: 120, y: 56},
			{x: 136, y: 56},
			{x: 152, y: 56},
			{x: 168, y: 56},
			{x: 184, y: 56},
			{x: 200, y: 56},
			{x: 216, y: 56},
			{x: 232, y: 56},
			{x: 248, y: 56},
			{x: 264, y: 56},
			{x: 296, y: 56},
			{x: 312, y: 56},
			{x: 328, y: 56},
			{x: 88, y: 88},
			{x: 88, y: 136},
			{x: 136, y: 88},
			{x: 136, y: 136},
			{x: 200, y: 88},
			{x: 200, y: 136},
			{x: 248, y: 136}
		];		
		//At this point I'm hardcoding them but the easiest dynamic way (if needed) would be to read
		//directly from the Tiled JSON export. Don't use the Phaser functions for this.
		
        //Generate books
		this.generateBooks();
        
		game.world.bringToTop(groupItems);
		game.world.bringToTop(groupCharacters);
		game.world.bringToTop(groupEffects);
		game.world.bringToTop(groupText);

        this.spawnCustomer();
		spawnTimer = spawnMax;
		
		//UI stuff
        
        this.buildUI();
		newsTimer = 1;
        expenditure = 0;
        expenditureTimer = expenditureInterval;
	},
	
	update: function() {
		
		//The timer that triggers news events
		newsTimer -= game.time.physicsElapsed;
		if (newsTimer <= 0) {
			let newsStory = GenerateRandomNewsStory();
			tickerText.text = newsStory.text;
			game.time.events.add(tickerText.lifeTime, function(){tickerText.text = ''}, this);
			newsTimer = newsInterval;
			currentInterests[newsStory.tag] = Math.floor(Math.random()*15) + 5;
		}
		
		
		//Keep track of how much interest there is in books
		let totalInterest = 0;
		let interestDecayRate = 0.5;
		
		let topTest = -1;
		
		for (var i = 0; i < tags.length; i++) {
			if (currentInterests[tags[i]] > 0) {
				totalInterest += currentInterests[tags[i]];
				currentInterests[tags[i]] -= game.time.physicsElapsed * interestDecayRate;
			} else {
				currentInterests[tags[i]] = 0;
			}
			
			if (currentInterests[tags[i]] > topTest) {
				topTest = currentInterests[tags[i]];
				topInterest = tags[i];
			}
		}
        
        //Calculate and deduct expenditure from cash
		expenditureTimer -= game.time.physicsElapsed;
		if (expenditureTimer <= 0) {
            expenditure = bookStock.length;
			this.changeCash(-expenditure);
			expenditureTimer = expenditureInterval;
		}
		
		
		//Change spawn frequency based on total interest
		spawnTimer -= game.time.physicsElapsed;
		
		//How much does public opinion affect book buying urges?
		let publicOpinionCoefficient = 0.2;
		
		let spawnModifier = totalInterest * publicOpinionCoefficient * popularity;
		
		spawnModifier *= 0.1;
		
		if (spawnTimer <= 0) {
			this.spawnCustomer();
			spawnTimer = spawnMax - spawnModifier;
			if (spawnTimer <= 0)
				spawnTimer = 1;
		}		
		
	},
	
	render: function() {
		
		
	},
	
	generateBooks: function() {
        let numBooks = 4;
        for (var i = 0; i < numBooks; i++) {
			bookCatalogue.push(this.generateBook());
        }	
	},
	
	getNewCatalogue: function() {
		bookCatalogue = [];
		playState.generateBooks();
		playState.buildCatalogue();
	},
	
    spawnCustomer: function() {
		
		let maxChars = 15; //this is the number of characters in the spritesheet
		let selector = Math.floor(Math.random() * maxChars);
		
        let customer = new Customer(game, selector, point_enter.x, point_enter.y);
		groupCharacters.add(customer);
        
		
	},
	
    fullScreenToggle: function() {
        
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
    },
	

	getRandomNavPointBooks: function() {
		return navPoints_books[Math.floor(Math.random() * navPoints_books.length)];
	},
    
    buildUI: function() {

		var bar = game.add.graphics();
		bar.beginFill(0x000000, 0.4);
		bar.drawRect(0, 180, 400, 100);

		tickerText = game.add.text(0, 0, "", fontStyle);
		tickerText.setShadow(0, 0, 'rgba(0,0,0,1)', 2);

		tickerText.setTextBounds(2, 140, 330, 80);
		tickerText.lifeTime = 3500;
		
		//BUTTONS TO OPEN MENUS
        
        slickUI.add(button_buy = new SlickUI.Element.Button(280, 0, 80, 20));
        button_buy.events.onInputUp.add(this.openMenuCatalogue);
        button_buy.add(new SlickUI.Element.Text(6,0, "Buy stock", 10, styleDark));
		
        slickUI.add(button_view = new SlickUI.Element.Button(280, 22, 80, 20));
        button_view.events.onInputUp.add(this.openMenuStock);
        button_view.add(new SlickUI.Element.Text(6,0, "View stock", 10, styleDark));
		
        slickUI.add(button_status = new SlickUI.Element.Button(0, 0, 80, 20));
        button_status.events.onInputUp.add(this.openMenuStatus);
        button_status.add(new SlickUI.Element.Text(6,0, "Shop status", 10, styleDark));
		
		
		//MENU PANELS
        
        slickUI.add(panel_ordering = new SlickUI.Element.Panel(8, 50, 336, 140));
        panel_ordering.add(new SlickUI.Element.Text(10,0, "Books Catalogue", 10, styleDark));
        panel_ordering.add(panel_ordering.cashReadout = new SlickUI.Element.Text(120,0, "Money: £" + cash, 10, styleDark));
        panel_ordering.visible = false;
        panel_ordering.add(panel_ordering.exitButton = new SlickUI.Element.Button(310, 0, 16, 16));
		panel_ordering.exitButton.events.onInputUp.add(this.closeMenuCatalogue);
        panel_ordering.exitButton.add(new SlickUI.Element.Text(1,-3,'x', 10, styleDark));
        panel_ordering.add(panel_ordering.refreshButton = new SlickUI.Element.Button(6, 100, 90, 24));
		panel_ordering.refreshButton.events.onInputUp.add(this.getNewCatalogue);
        panel_ordering.refreshButton.add(new SlickUI.Element.Text(0,0,'Browse more', 10, styleDark));
        
        panel_ordering.carousel = panel_ordering.add(new SlickUI.Element.DisplayObject(0, 2, game.make.sprite(0,0, ''), 340, 118));
		
		this.buildCatalogue();
		
        slickUI.add(panel_stock = new SlickUI.Element.Panel(8, 50, 336, 160));
        panel_stock.add(new SlickUI.Element.Text(10,0, "Current Stock", 10, styleDark));
        panel_stock.visible = false;
        panel_stock.add(panel_stock.exitButton = new SlickUI.Element.Button(310, 0, 16, 16));
       	panel_stock.exitButton.events.onInputUp.add(this.closeMenuStock);
        panel_stock.exitButton.add(new SlickUI.Element.Text(1,-3,'x', 10, styleDark));
		
		this.buildStock();
		
		slickUI.add(panel_status = new SlickUI.Element.Panel(8, 50, 336, 160));
        panel_status.add(new SlickUI.Element.Text(10,0, "Bookseller's Computer", 10, styleDark));
        panel_status.visible = false;
        panel_status.add(panel_status.exitButton = new SlickUI.Element.Button(310, 0, 16, 16));
       	panel_status.exitButton.events.onInputUp.add(this.closeMenuStatus);
        panel_status.exitButton.add(new SlickUI.Element.Text(1,-3,'x', 10, styleDark));
		
        panel_status.cashText = panel_status.add(new SlickUI.Element.Text(12, 22,'Money: ' + cash, 10, styleDark));
        panel_status.popularityText = panel_status.add(new SlickUI.Element.Text(12, 22 + (12 * 1), 'Popularity: ' + popularity, 10, styleDark));
        panel_status.interestText = panel_status.add(new SlickUI.Element.Text(12, 22 + (12 * 2), "There aren't any trends at the moment.", 10, styleDark));
        panel_status.expenditureText = panel_status.add(new SlickUI.Element.Text(12, 22 + (12 * 3), "Current expenditure is: " + expenditure, 10, styleDark));
		
		this.buildStatus();
		
		
    },
	
	buildCatalogue: function() {
        for (var i = 0; i < bookCatalogue.length; i++) {
            let slab;
			let sprite = game.make.sprite(0,0, 'sprite_book' + bookCatalogue[i].spriteIndex);
            panel_ordering.carousel.add(slab = new SlickUI.Element.Button(6 + (80 * i), 16, 80, 80));
            slab.add(slab.icon = new SlickUI.Element.DisplayObject(2, 2, sprite));
			let bonusString = "+" + bookCatalogue[i].tag;
			slab.add(slab.bonusText = new SlickUI.Element.Text(20,4, bonusString, 6, styleDarkSmall, 20, 40));
            slab.add(slab.title = new SlickUI.Element.Text(2,20, bookCatalogue[i].title, 9, styleDarkWrap, 40, 80));
			slab.title.text.lineSpacing = -8;
            slab.add(slab.cost = new SlickUI.Element.Text(2, 60, "£" + bookCatalogue[i].cost, 10, styleDark));
			slab.events.onInputUp.add(this.orderBook.bind(this, i));
        }
	},
	
	buildStock: function() {
		
		//console.log('building stock');
		
		if (panel_stock.carousel !== undefined) {
			panel_stock.carousel.destroy();
		}
		
        
        panel_stock.carousel = panel_stock.add(new SlickUI.Element.DisplayObject(0, 2, game.make.sprite(0,0, ''), 340, 160));
		
		let maxInList = 4;
		let booksToList = Math.min(maxInList, bookStock.length - stockIndex);
		
        for (var i = stockIndex; i < stockIndex + booksToList; i++) {
            let slab;
            let title;
            let remainder;
			let sprite = game.make.sprite(0,0, 'sprite_book' + bookStock[i].spriteIndex);
            panel_stock.carousel.add(slab = new SlickUI.Element.Panel(6, 12 + (30 * (i - stockIndex)), 280, 30));
			slab.add(icon = new SlickUI.Element.DisplayObject(0, 2, sprite));
			let displayedTitle = bookStock[i].title;
			if (displayedTitle.length >= 30) {
				displayedTitle = displayedTitle.substr(0, 30) + "...";
			}
            slab.add(title = new SlickUI.Element.Text(18,2, displayedTitle, 9, styleDark, 180, 30));
			title.text.lineSpacing = -8;
            slab.add(remainder = new SlickUI.Element.Text(190, 2, "In stock: " + bookStock[i].amount, 10, styleDark));
        }
		
		let button_prev;
		panel_stock.carousel.add(button_prev = new SlickUI.Element.Button(300, 20, 20, 20));
		button_prev.events.onInputUp.add(function(){
			stockIndex -= 1;
			if (stockIndex < 0)
				stockIndex = 0;
			playState.buildStock();
		});
		button_prev.add(new SlickUI.Element.Text(4, 0, "^", 10, styleDark));
		let button_next;
		panel_stock.carousel.add(button_next = new SlickUI.Element.Button(300, 100, 20, 20));
		button_next.events.onInputUp.add(function(){
			stockIndex += 1;
			if (stockIndex > bookStock.length - maxInList)
				stockIndex = bookStock.length - maxInList;
			playState.buildStock();
		});
		button_next.add(new SlickUI.Element.Text(4, 0, "v", 10, styleDark));
		
		//panel_stock.carousel.add(new SlickUI.Element.Text(280, 130, "Page " + parseInt(stockIndex/4 + 1), 10, styleDark));
		
		//TODO: sometimes the pagination gets confused and sticky
		
		//console.log('index is ' + stockIndex);
	},
	
	buildStatus: function() {
		
		panel_status.cashText.value = 'Money: ' + cash;
		panel_status.popularityText.value = 'Popularity: ' + popularity;
		if (topInterest === undefined) {
			topInterest = 'nothing in particular';
		}
		panel_status.interestText.value = 'People seem interested in: ' + topInterest;
		panel_status.expenditureText.value = 'Current expenditure: £' + expenditure;
		
	},
    
	generateBook: function() {
		let chosenTag = pickRandomTag();
		let book = {
			tag: chosenTag,
			title: generateTitleShort(chosenTag),
			author: generateName(),
			cost: this.generateCost(),
			spriteIndex: Math.floor(Math.random()*12)
		};
		return book;
	},
	
    openMenuCatalogue: function() {
        panel_stock.visible = false;
        panel_status.visible = false;
        panel_ordering.visible = !panel_ordering.visible;
    },
    closeMenuCatalogue: function() {
        panel_ordering.visible = false;
        panel_ordering.carousel.x = 0;
    },
    openMenuStock: function() {
        panel_ordering.visible = false;
        panel_ordering.carousel.x = 0;
        panel_status.visible = false;
        panel_stock.visible = !panel_stock.visible;
    },
    closeMenuStock: function() {
        panel_stock.visible = false;
    },
    openMenuStatus: function() {
        panel_ordering.visible = false;
        panel_ordering.carousel.x = 0;
        panel_stock.visible = false;
        panel_status.visible = !panel_status.visible;
    },
    closeMenuStatus: function() {
        panel_status.visible = false;
    },
	
	orderBook: function(i) {
		if (bookCatalogue[i].cost > cash) {
			return;
		}
		this.changeCash(-bookCatalogue[i].cost);
		let book = bookCatalogue[i];
		book.amount = 10;
		bookStock.push(book)
		bookCatalogue[i] = this.generateBook();
		
		//Spawn a bonus customer burst if you choose a popular book
		if (book.tag === topInterest) {
			let delay = Math.floor(Math.random()*3) + 1;
			let numCustomers = 3 + Math.floor(Math.random() * 5);
			game.time.events.add(1000 * delay, function(){
				for (var i = 0; i < numCustomers; i++) {
					this.spawnCustomer();
				}
			}, this);
		}
		
		this.buildCatalogue();
		this.buildStock();
	},
	
	generateCost: function() {
		let result = Math.floor(Math.random() * 20) + 4;
		return result;
	},
	
	
	popularityIncrease: function(amount) {
		if (popularity < popularityMax) {
			popularity += amount;
		} else {
			popularity = popularityMax;
		}
		
		this.buildStatus();
	},

	popularityDecrease: function(amount) {
		if (popularity > popularityMin) {
			popularity -= amount;
		} else {
			popularity = popularityMin;
		}

		this.buildStatus();
	},
	
	changeCash: function(amount) {
		cash += amount;
		this.buildStatus();
		panel_ordering.cashReadout.value = "Money: £" + cash;
	}
};

class Customer extends Phaser.Sprite {
    
    constructor(game, spriteIndex, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sheet_char');
		
        //this.frame = spriteIndex;
		this.name = generateName();
        
        this.anchor.setTo(0.5, 0.5);
        
        this.behaviours = {
            BROWSE: 0,
            BUY: 1,
            LEAVE: 2
        };
        this.behaviour_current = this.behaviours.BROWSE;
		this.browseTarget = playState.getRandomNavPointBooks();
		
		this.animSpeed = 8;
		
        this.anim_idle = this.animations.add('anim_idle', [0]);
        this.anim_walk = this.animations.add('anim_walk', [0,1]);
        this.anim_interact = this.animations.add('anim_interact', [2,3]);
		
        game.add.existing(this);
        game.physics.arcade.enable(this);
		this.animations.play('anim_walk', this.animSpeed, true);
    }
    
    update() {

        switch (this.behaviour_current) {
            case this.behaviours.BROWSE: {
				
				this.animations.play('anim_walk', this.animSpeed, true);
                game.physics.arcade.moveToXY(this, this.browseTarget.x, this.browseTarget.y, 50);
				
				
                if (Math.abs(this.x - this.browseTarget.x) < 1 && Math.abs(this.y - this.browseTarget.y) < 1) {
                    this.behaviour_current = this.behaviours.IDLE;
					this.animations.play('anim_idle', this.animSpeed, true);
					
					let decisiveness = 0.9;
					
					//Randomly choose whether to buy this book or browse for another
					if (Math.random() < decisiveness) {
						//BUY!
    					if (bookStock.length < 1) {
							this.say('No books?');
							playState.popularityDecrease(2);
							if (Math.random() > 0.2) {
								game.time.events.add(200, this.makeMess, this);
							}	
							game.time.events.add(1000, function(){this.behaviour_current = this.behaviours.LEAVE}, this);
							break;
							
						}
						this.say('This one!')
						if (Math.random() > 0.5) {
							game.time.events.add(200, this.makeMess, this);
						}
						game.time.events.add(Phaser.Timer.SECOND, function(){this.behaviour_current = this.behaviours.BUY}, this);
						this.animations.play('anim_interact', 8, false);
						playState.popularityIncrease(1);
					} else {
						//Nah
						if (Math.random() > 0.5) {
							game.time.events.add(500, this.makeMess, this);
						}
						this.say('Nah.')
    					game.time.events.add(Phaser.Timer.SECOND * 2, function(){this.browseTarget = playState.getRandomNavPointBooks(); this.behaviour_current = this.behaviours.BROWSE;}, this);
					}
                }
                break;
            }
            case this.behaviours.BUY: {
                game.physics.arcade.moveToXY(this, point_buy.x, point_buy.y, 50);
				this.animations.play('anim_walk', 8, false);
                if (Math.abs(this.x - point_buy.x) < 1 && Math.abs(this.y - point_buy.y) < 1) {
					this.animations.play('anim_interact', 8, false);
                    this.behaviour_current = this.behaviours.IDLE;
					let book = this.selectBook();
					if (book === undefined) {
						game.time.events.add(500, this.makeMess, this);
						this.say(':(')
						console.log(this.name + " couldn't find the book they wanted.");
						playState.popularityDecrease(2);
						break;
					}
					playState.changeCash(book.cost);
					book.amount--;
					if (book.amount < 1) {
						bookStock.splice(bookStock.indexOf(book), 1);
					}
					
					this.say(':D');
					playState.buildStock();
//					console.log(this.name + " bought a copy of " + book.title);
					
                    game.time.events.add(1000, function(){this.behaviour_current = this.behaviours.LEAVE}, this);
                }
                break;
            }
            case this.behaviours.LEAVE: {
				this.animations.play('anim_walk', 8, false);
                game.physics.arcade.moveToXY(this, point_exit.x, point_exit.y, 50);
                if (Math.abs(this.x - point_exit.x) < 1 && Math.abs(this.y - point_exit.y) < 1) {
                    this.behaviour_current = -1;
                    this.die();
                }
                break;
            }
            case this.behaviours.IDLE: {
                this.body.velocity.setTo(0,0);
                break;
            }
        }
    }
    
	selectBook() {
		let result = bookStock[Math.floor(Math.random() * bookStock.length)];
		
		//Loop through stocked books and *probably* pick the one with the highest current interest
		let bestInterest = 0;
		let peerPressureCoefficient = 0.9;
		
		//get the most popular book
		for (var b in bookStock) {
			if (currentInterests[b.tag] > bestInterest) {
				bestInterest = currentInterests[b.tag];
				result = b;
			}
		}
		
		//test against peer pressure to try and buy a random book instead
		if (Math.random() > peerPressureCoefficient) {
			result = bookStock[Math.floor(Math.random() * bookStock.length)];
		}
		
		return result;
	}
	
    die() {
        this.destroy();
    }
	
	makeMess() {
		let mess = new Mess(game, this.x, this.y);
		groupItems.add(mess);
	}
	
	say(text) {
		let bubble = new SpeechBubble(game, this.x - 25, this.y - 30, text);
		groupEffects.add(bubble);
	}
    
};

class Mess extends Phaser.Sprite {
	
    constructor(game, x, y) {
        super(game, 0, 0);
		
		let spriteSelector = Math.floor(Math.random()*4);
		
        Phaser.Sprite.call(this, game, x, y, 'sprite_bookPile_' + spriteSelector);
        
        this.anchor.setTo(0.5, 0.5);
		this.inputEnabled = true;
		this.angle = Math.floor(Math.random() * 360);
		
        game.add.existing(this);
        //game.physics.arcade.enable(this);
		
    	this.events.onInputDown.add(this.onClick, this);
		
		//Set a timer that hurts your popularity if messes are left lying on the floor for too long
		this.popularityTimer = 7;
		
    }
    
    update() {
		
		if (this.popularityTimer > 0) {
        	this.popularityTimer -= game.time.physicsElapsed;
		} else {
			this.popularityTimer = 4;
			playState.popularityDecrease(1);
		}
    }
    
	onClick() {
    	let puff = game.add.emitter(this.x, this.y, 10);
		puff.makeParticles('particle_puff');
		
    	puff.start(true, 300, null, 5);
		
		puff.lifespan = 300;
		
		this.visible = false;
		
		game.time.events.add(350, function(){puff.on = false;puff.kill();this.destroy();}, this);
    }
    
};

class SpeechBubble extends Phaser.Sprite {
	
    constructor(game, x, y, text) {
        super(game, 0, 0);
		
		let width = 50;
		let height = 20;
		
        Phaser.Sprite.call(this, game, x, y, 'sprite_bubble');
        
		this.lifeTime = 1;
		
		let padding = 2;
		
		this.phrase = game.add.text(padding, padding, text, styleDarkSmall);
		this.phrase.setTextBounds(x+padding, y+padding, x+width-padding, y+height-padding);
		
		groupText.add(this.phrase);
		
    }
    
    update() {
		
		if (this.lifeTime > 0) {
        	this.lifeTime -= game.time.physicsElapsed;
		} else {
			this.phrase.destroy();
			this.destroy();
		}
    }
    
};