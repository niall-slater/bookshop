/* GLOBALS */

/*
TODO:	allow customisation:
		-place your bookshop
		-decorate your bookshop
            -game save should include messes and customers/authors
		-buy and manage more bookshops
TODO:	add progression and achievements to reward high popularity and income
TODO:	spend money for upgrades to bookshop
TODO:	popularity should have a more obvious impact on foot traffic
TODO:	bad decisions should impact gameplay
TODO:	authors should move faster the longer the game goes on (?)
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

var tileSize = 16;

var point_enter = {
	x: 8,
	y: tileSize * 4 + 8
}
var point_exit = {
	x: 8,
	y: tileSize * 11 + 8
}
var point_buy = {
	x: tileSize * 25 + 8,
	y: tileSize * 7 + 8
}
var point_bookseller = {
	x: tileSize * 27 + 8,
	y: tileSize * 7 + 8
}

var spawnMax = 10;
var spawnTimer = spawnMax;

//UI
var tickerText;

var stockIndex = 0;

var newsTimer;
var newsInterval = 30;
var markup = 1.25;

var popularityMin = 0;
var popularityMax = 100;

var expenditure = 0;
var expenditureInterval = 5;
var expenditureTimer;

var gameData = {
	shopName: 'Bookshop',
	cash: 250,
	bookCatalogue: [],
	bookStock: [],
	popularity: 20
};


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
		groupCharacters = game.add.group();
		groupItems = game.add.group();
		groupEffects = game.add.group();
		groupText = game.add.group();
        
        game.stage.disableVisibilityChange = true;
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
	},

	create: function () {
		
		//Start physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
    	game.world.setBounds(0, 0, gameWidth, gameHeight);
		
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
			{x: 88 + 16, y: 88 + 16},
			{x: 88 + 16, y: 136 + 16},
			{x: 136 + 16, y: 88} + 16,
			{x: 136 + 16, y: 136 + 16},
			{x: 200 + 16, y: 88 + 16},
			{x: 200 + 16, y: 136 + 16},
			{x: 248 + 16, y: 136 + 16}
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
            expenditure = gameData.bookStock.length;
			this.changeCash(-expenditure);
			expenditureTimer = expenditureInterval;
		}
		
		
		//Change spawn frequency based on total interest
		spawnTimer -= game.time.physicsElapsed;
		
		//How much does public opinion affect book buying urges?
		let publicOpinionCoefficient = 0.2;
		
		let spawnModifier = totalInterest * publicOpinionCoefficient * gameData.popularity;
		
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
		
		//Reduce demand for individual books the older they get
		let demandDecayRate = 1;
		
		for (var i = 0; i < gameData.bookStock.length; i++) {
			let book = gameData.bookStock[i];
			if (i.demand > 0) {
				i.demand -= game.time.physicsElapsed * demandDecayRate;
			} else {
				i.demand = 0;
			}
		}
		
	},
	
	render: function() {
		
		
	},
	
	generateBooks: function() {
        let numBooks = 4;
        for (var i = 0; i < numBooks; i++) {
			gameData.bookCatalogue.push(this.generateBook());
        }	
	},
	
	getNewCatalogue: function() {
		gameData.bookCatalogue = [];
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
		bar.drawRect(0, gameHeight - 40, gameWidth, 40);

		tickerText = game.add.text(0, 0, "", styleTicker);

		tickerText.setTextBounds(8, gameHeight-26, gameWidth, gameHeight);
		tickerText.lifeTime = 3500;
		
		//BUTTONS TO OPEN MENUS
        
        slickUI.add(button_buy = new SlickUI.Element.Button(gameWidth - uiSize.buttonWidth, 0, uiSize.buttonWidth, uiSize.buttonHeight));
        button_buy.events.onInputUp.add(this.openMenuCatalogue);
        button_buy.add(new SlickUI.Element.Text(6,0, "Buy stock", 10, styleDarkBig)).centerHorizontally();
		
        slickUI.add(button_view = new SlickUI.Element.Button(gameWidth - uiSize.buttonWidth, uiSize.buttonHeight + uiSize.margin, uiSize.buttonWidth, uiSize.buttonHeight));
        button_view.events.onInputUp.add(this.openMenuStock);
        button_view.add(new SlickUI.Element.Text(6,0, "View stock", 10, styleDarkBig)).centerHorizontally();
		
        slickUI.add(button_status = new SlickUI.Element.Button(0, 0, uiSize.buttonWidth, uiSize.buttonHeight));
        button_status.events.onInputUp.add(this.openMenuStatus);
        button_status.add(new SlickUI.Element.Text(6,0, "Shop status", 10, styleDarkBig)).centerHorizontally();
		
		
		//MENU PANELS
        
        slickUI.add(panel_ordering = new SlickUI.Element.Panel(uiSize.panelX, uiSize.panelY, uiSize.panelWidth, uiSize.panelHeight));
        panel_ordering.add(new SlickUI.Element.Text(10,0, "Books Catalogue", 10, styleDark));
        panel_ordering.add(panel_ordering.cashReadout = new SlickUI.Element.Text(120,0, "Funds: £" + gameData.cash, 10, styleDark));
        panel_ordering.visible = false;
        panel_ordering.add(panel_ordering.exitButton = new SlickUI.Element.Button(uiSize.panelWidth - 32, 0, 16, 16));
		panel_ordering.exitButton.events.onInputUp.add(this.closeMenuCatalogue);
        panel_ordering.exitButton.add(new SlickUI.Element.Text(1,-3,'x', 10, styleDark));
        panel_ordering.add(panel_ordering.refreshButton = new SlickUI.Element.Button(uiSize.margin, uiSize.panelHeight - 36, 90, 24));
		panel_ordering.refreshButton.events.onInputUp.add(this.getNewCatalogue);
        panel_ordering.refreshButton.add(new SlickUI.Element.Text(4,0,'Browse more', 10, styleDark));
		panel_ordering.add(panel_ordering.quantityDown = new SlickUI.Element.Button(100, uiSize.panelHeight - 36, 24, 24));
		panel_ordering.add(panel_ordering.quantityUp = new SlickUI.Element.Button(170, uiSize.panelHeight - 36, 24, 24));
        panel_ordering.quantityDown.add(new SlickUI.Element.Text(3,2,'-', 10, styleDark));
        panel_ordering.quantityUp.add(new SlickUI.Element.Text(3,2,'+', 10, styleDark));
		panel_ordering.quantity = 5;
		panel_ordering.quantityDown.events.onInputUp.add(function(){if (panel_ordering.quantity > 1){panel_ordering.quantity--;playState.buildCatalogue();}});
		panel_ordering.quantityUp.events.onInputUp.add(function(){if (panel_ordering.quantity < 99){panel_ordering.quantity++;playState.buildCatalogue();}});
        panel_ordering.quantityText = panel_ordering.add(new SlickUI.Element.Text(126, uiSize.panelHeight - 30, panel_ordering.quantity + ' copies', 10, styleDark));
		
        panel_ordering.carousel = panel_ordering.add(new SlickUI.Element.DisplayObject(0, 2, game.make.sprite(0,0, ''), 340, 118));
		
		panel_ordering.slabs = []
		
		this.buildCatalogue();
		
        slickUI.add(panel_stock = new SlickUI.Element.Panel(uiSize.panelX, uiSize.panelY, uiSize.panelWidth, uiSize.panelHeight));
        panel_stock.add(new SlickUI.Element.Text(10,0, "Current Stock", 10, styleDark));
        panel_stock.visible = false;
        panel_stock.add(panel_stock.exitButton = new SlickUI.Element.Button(uiSize.panelWidth - 32, 0, 16, 16));
       	panel_stock.exitButton.events.onInputUp.add(this.closeMenuStock);
        panel_stock.exitButton.add(new SlickUI.Element.Text(1,-3,'x', 10, styleDark));
		
		this.buildStock();
		
		slickUI.add(panel_status = new SlickUI.Element.Panel(uiSize.panelX, uiSize.panelY, uiSize.panelWidth, uiSize.panelHeight));
        panel_status.add(new SlickUI.Element.Text(10,0, gameData.shopName, 10, styleTitle));
        panel_status.visible = false;
        panel_status.add(panel_status.exitButton = new SlickUI.Element.Button(uiSize.panelWidth - 32, 0, 16, 16));
       	panel_status.exitButton.events.onInputUp.add(this.closeMenuStatus);
        panel_status.exitButton.add(new SlickUI.Element.Text(1,-3,'x', 10, styleDark));
		
        panel_status.cashText = panel_status.add(new SlickUI.Element.Text(12, uiSize.buttonHeight*1,'Funds: £' + gameData.cash, 10, styleDark));
        panel_status.popularityText = panel_status.add(new SlickUI.Element.Text(12, uiSize.buttonHeight*1.5, 'Popularity: ' + gameData.popularity, 10, styleDark));
        panel_status.interestText = panel_status.add(new SlickUI.Element.Text(12, uiSize.buttonHeight*2, "There aren't any trends at the moment.", 10, styleDark));
        panel_status.expenditureText = panel_status.add(new SlickUI.Element.Text(12, uiSize.buttonHeight*2.5, "Current expenditure is: " + expenditure, 10, styleDark));
		
        panel_status.add(panel_status.saveButton = new SlickUI.Element.Button(uiSize.margin, uiSize.panelHeight - 36, 90, 24));
       	panel_status.saveButton.events.onInputUp.add(this.saveGame);
        panel_status.saveButton.add(new SlickUI.Element.Text(4,0,'Save game', 10, styleDark));
		
		this.buildStatus();
		
		
    },
	
	buildCatalogue: function() {
		
		for (var i = 0; i < panel_ordering.slabs.length; i++) {
			panel_ordering.slabs[i].destroy();
		}
		
		panel_ordering.quantityText.value = panel_ordering.quantity + ' copies';
		
        for (var i = 0; i < gameData.bookCatalogue.length; i++) {
            let slab;
			let sprite = game.make.sprite(0,0, 'sprite_book' + gameData.bookCatalogue[i].spriteIndex);
            panel_ordering.add(slab = new SlickUI.Element.Button(12 + uiSize.panelWidth/4.5 * i + (uiSize.margin*i), 24, uiSize.panelWidth/4.5, uiSize.panelHeight/1.5));
            slab.add(slab.icon = new SlickUI.Element.DisplayObject(2, 2, sprite));
			let bonusString = "+" + gameData.bookCatalogue[i].tag;
			slab.add(slab.bonusText = new SlickUI.Element.Text(20,4, bonusString, 6, styleDarkSmall, 20, 40));
            slab.add(slab.title = new SlickUI.Element.Text(2,24, gameData.bookCatalogue[i].title, 9, styleBookTitle, 40, 80));
            slab.add(slab.author = new SlickUI.Element.Text(2, slab.height - 32, "by " + gameData.bookCatalogue[i].author, 9, styleDarkSmall, 40, 80));
			slab.title.text.lineSpacing = -8;
            slab.add(slab.cost = new SlickUI.Element.Text(2, slab.height - 18, "£" + gameData.bookCatalogue[i].cost + " per copy", 10, styleDark));
			slab.events.onInputUp.add(this.orderBook.bind(this, i));
			panel_ordering.slabs.push(slab);
        }
	},
	
	buildStock: function() {
		
		if (panel_stock.carousel !== undefined) {
			panel_stock.carousel.destroy();
		}
		
        panel_stock.carousel = panel_stock.add(new SlickUI.Element.DisplayObject(0, 2, game.make.sprite(0,0, ''), panel_stock.width, panel_stock.height));
		
		let maxInList = 5;
		let booksToList = Math.min(maxInList, gameData.bookStock.length - stockIndex);
		
        for (var i = stockIndex; i < stockIndex + booksToList; i++) {
			
			if (gameData.bookStock.length < 1) {
				break;
			}
			
            let slab;
            let title;
            let remainder;
			let sprite = game.make.sprite(0,0, 'sprite_book' + gameData.bookStock[i].spriteIndex);
            panel_stock.carousel.add(slab = new SlickUI.Element.Panel(6, 12 + (30 * (i - stockIndex)), panel_stock.width-40, 30));
			slab.add(icon = new SlickUI.Element.DisplayObject(0, 2, sprite));
			let displayedTitle = gameData.bookStock[i].title;
			if (displayedTitle.length >= 50) {
				displayedTitle = displayedTitle.substr(0, 50) + "...";
			}
            slab.add(title = new SlickUI.Element.Text(18,2, displayedTitle, 9, styleDark, 180, 30));
			title.text.lineSpacing = -8;
            slab.add(remainder = new SlickUI.Element.Text(slab.width - 108, 2, "In stock: " + gameData.bookStock[i].amount, 10, styleDark));
			let returnButton;
			slab.add(returnButton = new SlickUI.Element.Button(slab.width - 48, 1, 40, 20));
			returnButton.add(new SlickUI.Element.Text(2,0, "Return", 9, styleDarkSmall));
			
			let currentBook = gameData.bookStock[i];
			
			returnButton.events.onInputUp.add(function(){playState.returnBook(currentBook);});
        }
		
		let button_prev;
		panel_stock.add(button_prev = new SlickUI.Element.Button(uiSize.panelWidth - 42, 20, 24, 24));
		button_prev.events.onInputUp.add(function(){
			stockIndex -= 1;
			if (stockIndex < 0)
				stockIndex = 0;
			playState.buildStock();
		});
		button_prev.add(new SlickUI.Element.Text(4, 0, "^", 10, styleDark));
		let button_next;
		panel_stock.add(button_next = new SlickUI.Element.Button(uiSize.panelWidth - 42, uiSize.panelHeight - 40, 24, 24));
		button_next.events.onInputUp.add(function(){
			stockIndex += 1;
			if (stockIndex > gameData.bookStock.length - booksToList)
				stockIndex = gameData.bookStock.length - booksToList;
			playState.buildStock();
		});
		button_next.add(new SlickUI.Element.Text(4, 0, "v", 10, styleDark));
	},
	
	buildStatus: function() {
		
		panel_status.cashText.value = 'Money: £' + gameData.cash;
		panel_status.popularityText.value = 'Popularity: ' + gameData.popularity;
		if (topInterest === undefined) {
			topInterest = 'nothing in particular';
		}
		panel_status.interestText.value = 'People seem interested in: ' + topInterest;
		panel_status.expenditureText.value = 'Current expenditure: £' + expenditure;
		
	},
    
	generateBook: function() {
		let chosenTag = pickRandomTag();
		let chosenTitle = generateTitleShort(chosenTag);
		let book = {
			tag: chosenTag,
			title: chosenTitle,
			author: generateName(),
			cost: this.generateCost(),
			spriteIndex: Math.floor(Math.random()*12),
			demand: 100,
			id: chosenTitle + '_' + Math.floor(Math.random()*99)
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
		
		let spend = gameData.bookCatalogue[i].cost * panel_ordering.quantity;
		
		if (spend > gameData.cash) {
			return;
		}
		this.changeCash(-spend);
		let book = gameData.bookCatalogue[i];
		book.amount = panel_ordering.quantity;
		gameData.bookStock.push(book)
		gameData.bookCatalogue[i] = this.generateBook();
		
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
	
	returnBook: function(book) {
		book.amount = 0;
		let index = gameData.bookStock.findIndex(i => i.id === book.id);
		gameData.bookStock.splice(index, 1);
		this.buildStock();
	},
	
	generateCost: function() {
		let result = Math.floor(Math.random() * 10) + 4;
		return result;
	},
	
	
	popularityIncrease: function(amount) {
		if (gameData.popularity < popularityMax) {
			gameData.popularity += amount;
		} else {
			gameData.popularity = popularityMax;
		}
		
		this.buildStatus();
	},

	popularityDecrease: function(amount) {
		if (gameData.popularity > popularityMin) {
			gameData.popularity -= amount;
		} else {
			gameData.popularity = popularityMin;
		}

		this.buildStatus();
	},
	
	changeCash: function(amount) {
		gameData.cash += amount;
		this.buildStatus();
		panel_ordering.cashReadout.value = "Money: £" + gameData.cash;
	},
	
	makeSale: function(book) {
		this.changeCash(book.cost * markup);
		book.amount--;
		if (book.amount < 1) {
			gameData.bookStock.splice(gameData.bookStock.indexOf(book), 1);
		}
		this.buildStock();
	},
	
	saveGame: function() {
        
        let id = 'save_' + gameData.shopName;
		
		var saveObject = gameData;
        
		localStorage.setItem(id, JSON.stringify(saveObject));
        
        //TODO: maintain a list of saves in local storage and load it every time,
        //      then push new saves to the end of that list for use in the loadgame screen.
        
		console.log('Saved game as ' + id);
	}
};