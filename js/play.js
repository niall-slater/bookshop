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
var cash = 0;
var cashText;

var bookCatalogue = [];

/* SLICK COMPONENTS */
var button_books;
var panel_ordering;

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
        let numBooks = 10;
        for (var i = 0; i < numBooks; i++) {
            let publication = {
                title: GenerateTitleShort(),
                author: generateName()
            };
            bookCatalogue.push(publication);
        }
        
		game.world.bringToTop(groupCharacters);
		
		game.time.events.loop(spawnMax, this.spawnCustomer, this);

        this.spawnCustomer();
		
		
		//UI stuff
        
        this.buildUI();
	},
	
	update: function() {
		
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
        
        slickUI.add(button_books = new SlickUI.Element.Button(300,0, 60, 20));
        button_books.events.onInputUp.add(this.openMenuBooks);
        button_books.add(new SlickUI.Element.Text(0,0, "Books")).center();
        
        slickUI.add(panel_ordering = new SlickUI.Element.Panel(50, 50, 260, 120));
        panel_ordering.add(new SlickUI.Element.Text(0,0, "Books Catalogue"));
        panel_ordering.visible = false;
        panel_ordering.add(panel_ordering.exitButton = new SlickUI.Element.Button(232, 0, 16, 16));
        panel_ordering.exitButton.events.onInputUp.add(this.closeMenuBooks);
        panel_ordering.exitButton.add(new SlickUI.Element.Text(0,0,'x')).center();
        panel_ordering.carousel = [];
        for (var i = 0; i < bookCatalogue.length; i++) {
            let icon;
            let item = panel_ordering.add(icon = new SlickUI.Element.DisplayObject(4 + (82 * i), 16, game.make.sprite(0,0, 'sprite_book'))).add(new SlickUI.Element.Text(0,32, bookCatalogue[i].title, 16, 'minecraftia', 74, 100));
            panel_ordering.carousel.push(item);
            if (i >= 3) {
                icon.visible = false;
            }
        }
    },
    
    openMenuBooks: function() {
        panel_ordering.visible = true;
    },
    closeMenuBooks: function() {
        panel_ordering.visible = false;
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
					tickerText.text = this.name + " bought a copy of " + GenerateTitle();
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