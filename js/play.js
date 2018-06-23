/* GLOBALS */

/*
TODO:	add progression and achievements to reward high popularity and income
TODO:	spend money for upgrades to bookshop
TODO:	popularity should have a more obvious impact on foot traffic
TODO:	bad decisions should impact gameplay
TODO:	authors should move faster the longer the game goes on
TODO:	there should be an option to return books that haven't
		sold at a penalty
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
var point_bookseller = {
	x: 312,
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
		
		//Create bookseller
		
        let bookseller = new Bookseller(game, 0, point_bookseller.x, point_bookseller.y);
		groupCharacters.add(bookseller);
		
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
			if (Math.random() < 0.9) {
				this.spawnCustomer();	
			} else {
				this.spawnAuthor();
			}
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
	
    spawnAuthor: function() {
		
		let maxChars = 15; //this is the number of characters in the spritesheet
		let selector = Math.floor(Math.random() * maxChars);
		
        let author = new Author(game, selector, point_enter.x, point_enter.y);
		groupCharacters.add(author);
        
		
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
		panel_ordering.add(panel_ordering.quantityDown = new SlickUI.Element.Button(100, 104, 20, 18));
		panel_ordering.add(panel_ordering.quantityUp = new SlickUI.Element.Button(170, 104, 20, 18));
        panel_ordering.quantityDown.add(new SlickUI.Element.Text(0,0,'-', 10, styleDark));
        panel_ordering.quantityUp.add(new SlickUI.Element.Text(0,0,'+', 10, styleDark));
		panel_ordering.quantity = 10;
		panel_ordering.quantityDown.events.onInputUp.add(function(){if (panel_ordering.quantity > 0){panel_ordering.quantity--;playState.buildCatalogue();}});
		panel_ordering.quantityUp.events.onInputUp.add(function(){if (panel_ordering.quantity < 99){panel_ordering.quantity++;playState.buildCatalogue();}});
        panel_ordering.quantityText = panel_ordering.add(new SlickUI.Element.Text(120, 106, panel_ordering.quantity + ' copies', 10, styleDark));
		
        panel_ordering.carousel = panel_ordering.add(new SlickUI.Element.DisplayObject(0, 2, game.make.sprite(0,0, ''), 340, 118));
		
		panel_ordering.slabs = []
		
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
		
        panel_status.cashText = panel_status.add(new SlickUI.Element.Text(12, 22,'Money: £' + cash, 10, styleDark));
        panel_status.popularityText = panel_status.add(new SlickUI.Element.Text(12, 22 + (12 * 1), 'Popularity: ' + popularity, 10, styleDark));
        panel_status.interestText = panel_status.add(new SlickUI.Element.Text(12, 22 + (12 * 2), "There aren't any trends at the moment.", 10, styleDark));
        panel_status.expenditureText = panel_status.add(new SlickUI.Element.Text(12, 22 + (12 * 3), "Current expenditure is: " + expenditure, 10, styleDark));
		
		this.buildStatus();
		
		
    },
	
	buildCatalogue: function() {
		
		for (var i = 0; i < panel_ordering.slabs.length; i++) {
			panel_ordering.slabs[i].destroy();
		}
		
		panel_ordering.quantityText.value = panel_ordering.quantity + ' copies';
		
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
			panel_ordering.slabs.push(slab);
        }
	},
	
	buildStock: function() {
		
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
	},
	
	buildStatus: function() {
		
		panel_status.cashText.value = 'Money: £' + cash;
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
		
		let spend = bookCatalogue[i].cost * panel_ordering.quantity;
		
		if (spend > cash) {
			return;
		}
		this.changeCash(-spend);
		let book = bookCatalogue[i];
		book.amount = panel_ordering.quantity;
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
		let result = Math.floor(Math.random() * 10) + 4;
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