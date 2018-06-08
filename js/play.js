/* GLOBALS */

//Groups
var groupBackground;
var groupCharacters;
var groupItems;

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

var spawnMax = 1000;
var spawnTimer = spawnMax;

//UI
var slickUI;
var tickerText;
var cash = 50;
var cashText;

var newsTimer;
var bookCatalogue = [];
var bookStock = [];

/* SLICK COMPONENTS */
var button_buy;
var button_view;
var panel_ordering;
var panel_stock;

var currentInterests = {
	technology: 0,
	politics: 0,
	space: 0,
	nature: 0,
	business: 0,
	mindfulness: 0,
	history: 0,
	music: 0,
	gaming: 0
};

var playState = {
    
    //State Information
	
	preload: function() {
        
		//Slick UI library
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
		groupCharacters = game.add.group();
        
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
			{x: 56, y: 56},
			{x: 104, y: 56},
			{x: 136, y: 56},
			{x: 168, y: 56},
			{x: 200, y: 56},
			{x: 88, y: 88},
			{x: 88, y: 136},
			{x: 136, y: 88},
			{x: 136, y: 136},
			{x: 200, y: 72},
			{x: 200, y: 136},
			{x: 248, y: 136}
		];		
		//At this point I'm hardcoding them but the easiest dynamic way will be to read
		//directly from the Tiled JSON export. Don't use the Phaser functions for this.
		
        //Generate books
        let numBooks = 4;
        for (var i = 0; i < numBooks; i++) {
			bookCatalogue.push(this.generateBook());
        }
        
		game.world.bringToTop(groupCharacters);
		
		game.time.events.loop(spawnMax, this.spawnCustomer, this);

        this.spawnCustomer();
		
		
		//UI stuff
        
        this.buildUI();
		newsTimer = 1;
	},
	
	update: function() {
		
		newsTimer -= game.time.physicsElapsed;
		
		if (newsTimer <= 0) {
			let newsStory = GenerateRandomNewsStory();
			tickerText.text = newsStory.text;
			newsTimer = 3;
			//TODO: on this line we need to look up the relevant interest in currentInterests and change its value. We look it up using newsStory.tag. There's a simple javascript way to do this but i don't know it and i want some gin so this is a problem for future nige
			console.log(currentInterests);
		}
		
		for (var [key, value] of Object.entries(currentInterests)) {
			if (value > 0) {
				value -= game.time.physicsElapsed;
			} else {
				value = 0;
			}
		}
		
	},
	
	render: function() {
		
		
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
        
		var fontStyle = { font: "10px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "bottom", wordWrap: "true", wordWrapWidth: 330};

		var bar = game.add.graphics();
		bar.beginFill(0x000000, 0.4);
		bar.drawRect(0, 180, 400, 100);

		tickerText = game.add.text(0, 0, "", fontStyle);
		tickerText.setShadow(0, 0, 'rgba(0,0,0,1)', 2);

		tickerText.setTextBounds(2, 140, 330, 80);

		cashText = game.add.text(0, 0, "£" + cash, fontStyle);
		cashText.setShadow(0, 0, 'rgba(0,0,0,1)', 2);

		cashText.setTextBounds(4, 2, 120, 16);
        
        slickUI.add(button_buy = new SlickUI.Element.Button(280, 0, 80, 20));
        button_buy.events.onInputUp.add(this.openMenuCatalogue);
        button_buy.add(new SlickUI.Element.Text(6,0, "Buy stock"));
        slickUI.add(button_view = new SlickUI.Element.Button(280, 22, 80, 20));
        button_view.events.onInputUp.add(this.openMenuStock);
        button_view.add(new SlickUI.Element.Text(6,0, "View stock"));
        
        slickUI.add(panel_ordering = new SlickUI.Element.Panel(8, 50, 336, 120));
        panel_ordering.add(new SlickUI.Element.Text(10,0, "Books Catalogue"));
        panel_ordering.visible = false;
        panel_ordering.add(panel_ordering.exitButton = new SlickUI.Element.Button(310, 0, 16, 16));
        panel_ordering.exitButton.events.onInputUp.add(this.closeMenuCatalogue);
        panel_ordering.exitButton.add(new SlickUI.Element.Text(0,0,'x')).center();
        
        panel_ordering.carousel = panel_ordering.add(new SlickUI.Element.DisplayObject(0, 2, game.make.sprite(0,0, ''), 340, 118));
		
		this.buildCatalogue();
		
        slickUI.add(panel_stock = new SlickUI.Element.Panel(8, 50, 336, 120));
        panel_stock.add(new SlickUI.Element.Text(10,0, "Current Stock"));
        panel_stock.visible = false;
        panel_stock.add(panel_stock.exitButton = new SlickUI.Element.Button(310, 0, 16, 16));
        panel_stock.exitButton.events.onInputUp.add(this.closeMenuStock);
        panel_stock.exitButton.add(new SlickUI.Element.Text(0,0,'x')).center();
		
    },
	
	buildCatalogue: function() {
        for (var i = 0; i < bookCatalogue.length; i++) {
            let slab;
            let icon;
            let text;
			let sprite = game.make.sprite(0,0, 'sprite_book' + bookCatalogue[i].spriteIndex);
            panel_ordering.carousel.add(slab = new SlickUI.Element.Button(6 + (80 * i), 16, 70, 80));
            slab.add(icon = new SlickUI.Element.DisplayObject(16, 2, sprite));
            slab.add(text = new SlickUI.Element.Text(2,24, bookCatalogue[i].title, 16, 'minecraftia', 60, 80));
            slab.add(text = new SlickUI.Element.Text(2, 60, bookCatalogue[i].cost + " GBP", 16, 'minecraftia', 60, 80));
			slab.events.onInputUp.add(this.orderBook.bind(this, i));
        }
	},
    
	generateBook: function() {
		let book = {
			title: GenerateTitleShort(),
			author: generateName(),
			cost: this.generateCost(),
			spriteIndex: Math.floor(Math.random()*12)
		};
		return book;
	},
	
    openMenuCatalogue: function() {
        panel_stock.visible = false;
        panel_ordering.visible = !panel_ordering.visible;
    },
    closeMenuCatalogue: function() {
        panel_ordering.visible = false;
        panel_ordering.carousel.x = 0;
    },
    openMenuStock: function() {
        panel_ordering.visible = false;
        panel_ordering.carousel.x = 0;
        panel_stock.visible = !panel_stock.visible;
    },
    closeMenuStock: function() {
        panel_stock.visible = false;
    },
	
	orderBook: function(i) {
		if (bookCatalogue[i].cost > cash) {
			return;
		}
		cash -= bookCatalogue[i].cost;
		bookStock.push(bookCatalogue[i])
		console.log(bookStock);
		cashText.text = "£" + cash;
		bookCatalogue[i] = this.generateBook();
		this.buildCatalogue();
	},
	
	generateCost: function() {
		let result = Math.floor(Math.random() * 20) + 4;
		return result;
	}
};

class Customer extends Phaser.Sprite {
    
    constructor(game, spriteIndex, x, y) {
        super(game, 0, 0);
         
        Phaser.Sprite.call(this, game, x, y, 'sprites_characters');

        this.frame = spriteIndex;
		this.name = generateName();
        
        this.anchor.setTo(0.5, 0.5);
        
        this.behaviours = {
            BROWSE: 0,
            BUY: 1,
            LEAVE: 2
        };
        this.behaviour_current = this.behaviours.BROWSE;
		this.browseTarget = playState.getRandomNavPointBooks();
        
        this.bobMax = 1;
        this.bobTimer = 1;
        
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }
    
    update() {

        this.bobTimer -= game.time.physicsElapsed;
        
        if (this.bobTimer <= 0)
        {
            this.bob();
            this.bobTimer = this.bobMax;
        }
        
        switch (this.behaviour_current) {
            case this.behaviours.BROWSE: {
                game.physics.arcade.moveToXY(this, this.browseTarget.x, this.browseTarget.y, 50);
                if (Math.abs(this.x - this.browseTarget.x) < 1 && Math.abs(this.y - this.browseTarget.y) < 1) {
                    this.behaviour_current = this.behaviours.IDLE;
					
					//Randomly choose whether to buy this book or browse for another
					if (Math.random() > 0.5) {
						//BUY!
    					game.time.events.add(Phaser.Timer.SECOND, function(){this.behaviour_current = this.behaviours.BUY}, this);
					} else {
						//Nah
    					game.time.events.add(Phaser.Timer.SECOND * 2, function(){this.browseTarget = playState.getRandomNavPointBooks(); this.behaviour_current = this.behaviours.BROWSE}, this);
					}
                }
                break;
            }
            case this.behaviours.BUY: {
                game.physics.arcade.moveToXY(this, point_buy.x, point_buy.y, 50);
                if (Math.abs(this.x - point_buy.x) < 1 && Math.abs(this.y - point_buy.y) < 1) {
                    this.behaviour_current = this.behaviours.IDLE;
					//tickerText.text = this.name + " bought a copy of " + GenerateTitle();
					cash += 5;
					cashText.text = "£" + cash;
                    game.time.events.add(1000, function(){this.behaviour_current = this.behaviours.LEAVE}, this);
                }
                break;
            }
            case this.behaviours.LEAVE: {
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
    
    bob() {
        
    }
    
    die() {
        this.destroy();
    }
    
};