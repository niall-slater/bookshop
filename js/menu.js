//MENU OBJECTS

let menuMain = {};
let menuStart = {};

//UI values
let uiSize = {
	buttonWidth: 128,
	buttonHeight: 32,
	margin: 4,
	panelX: 4,
	panelY: 72,
	panelWidth: 480-8,
	panelHeight: 270-78
};

var menuState = {
	
	preload: function() {
		
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
		game.add.plugin(PhaserInput.Plugin);
	},
	
	create: function() {
		
		let panel;
		
		//set up main menu panel
		slickUI.add(menuMain.panel = new SlickUI.Element.Panel(0, 0, gameWidth, gameHeight));
		
		menuMain.panel.add(menuMain.panel.title = new SlickUI.Element.DisplayObject(0, 0, game.make.sprite(0, 0, 'sprite_title')));
		menuMain.panel.add(menuMain.panel.buttonNewGame = new SlickUI.Element.Button(gameWidth/2-uiSize.buttonWidth/2, 100, uiSize.buttonWidth, uiSize.buttonHeight));
		menuMain.panel.buttonNewGame.add(new SlickUI.Element.Text(0,0, 'New Game', 10, styleDarkBig)).centerHorizontally();
		menuMain.panel.add(menuMain.panel.buttonLoadGame = new SlickUI.Element.Button(gameWidth/2-uiSize.buttonWidth/2, 100 + 32 + 14, uiSize.buttonWidth, uiSize.buttonHeight));
		menuMain.panel.buttonLoadGame.add(new SlickUI.Element.Text(0,0, 'Load Game', 10, styleDarkBig)).centerHorizontally();
		
		
		//set button functions
		menuMain.panel.buttonNewGame.events.onInputUp.add(this.openNewGameMenu);
		menuMain.panel.buttonLoadGame.events.onInputUp.add(function(){menuState.loadGame('test')});
		
		
		//set up new game panel
		slickUI.add(menuStart.panel = new SlickUI.Element.Panel(0, 0, gameWidth, gameHeight));
		//title
		menuStart.panel.add(menuStart.panel.title = new SlickUI.Element.Text(0, 12, 'New Game', 14, styleTitle)).centerHorizontally();
		//start button
		menuStart.panel.add(menuStart.panel.buttonStart = new SlickUI.Element.Button(menuStart.panel.width - uiSize.buttonWidth, menuStart.panel.height - uiSize.buttonHeight, uiSize.buttonWidth, uiSize.buttonHeight));
		menuStart.panel.buttonStart.add(new SlickUI.Element.Text(0,0, 'Start', 10, styleDarkBig)).centerHorizontally();
		//cancel button
		menuStart.panel.add(menuStart.panel.buttonCancel = new SlickUI.Element.Button(0, menuStart.panel.height - uiSize.buttonHeight, uiSize.buttonWidth, uiSize.buttonHeight));
		menuStart.panel.buttonCancel.add(new SlickUI.Element.Text(0,0, 'Cancel', 10, styleDarkBig)).centerHorizontally();
		//name shop
		menuStart.panel.add(menuStart.panel.nameLabel = new SlickUI.Element.Text(uiSize.buttonWidth/2, uiSize.buttonHeight * 1.3, 'Bookshop Name', 14, styleDark));
		menuStart.panel.nameField = game.add.inputField(uiSize.buttonWidth/2,  uiSize.buttonHeight * 2, {padding: 4, borderRadius:2});
		menuStart.panel.nameField.visible = false;
		menuStart.panel.nameField.setText(gameData.shopName);
		
		//set button functions
		menuStart.panel.buttonStart.events.onInputUp.add(this.startGame);
		menuStart.panel.buttonCancel.events.onInputUp.add(this.cancel);
		
		menuStart.panel.visible = false;
		
		
		//Set up fullscreen
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setShowAll();
		game.scale.refresh();
	},
	
	openNewGameMenu: function() {
		menuMain.panel.visible = false;
		menuStart.panel.visible = true;
		menuStart.panel.nameField.visible = true;
	},
	
	loadGame: function(name) {
		
		var loadedData = localStorage.getItem("save_" + name);

		
		if (loadedData === null) {
			console.log("Failed to load " + name);
			return;
		}
		
		gameData = JSON.parse(loadedData);
	
		console.log("Loading game " + name);
		
		game.state.start('play');
	},
	
	cancel: function() {
		menuStart.panel.visible = false;
		menuStart.panel.nameField.visible = false;
		menuMain.panel.visible = true;
	},
	
	setShopName: function(value) {
		gameData.shopName = value;
		console.log("shop name is " + gameData.shopName);
	},
	
	startGame: function() {
		menuState.setShopName(menuStart.panel.nameField.value);
		game.state.start('play');
	}
};