//MENU OBJECTS

let menuMain = {};
let menuStart = {};

var menuState = {
	
	preload: function() {
		
		slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
		slickUI.load('res/ui/kenney/kenney.json');
		
		game.add.plugin(PhaserInput.Plugin);
	},
	
	create: function() {
		
		let panel;
		
		//set up main menu panel
		slickUI.add(menuMain.panel = new SlickUI.Element.Panel(0, 0, mapWidthDefault, mapHeightDefault));
		
		menuMain.panel.add(menuMain.panel.title = new SlickUI.Element.DisplayObject(menuMain.panel.width/2 - 400/2, 2, game.make.sprite(0, 0, 'sprite_title')));
		menuMain.panel.add(menuMain.panel.buttonNewGame = new SlickUI.Element.Button(2, 100, 200, 32));
		menuMain.panel.buttonNewGame.add(new SlickUI.Element.Text(8,4, 'New Game', 10, styleDark));
		menuMain.panel.add(menuMain.panel.buttonLoadGame = new SlickUI.Element.Button(2, 100 + 32 + 14, 200, 32));
		menuMain.panel.buttonLoadGame.add(new SlickUI.Element.Text(8,4, 'Load Game', 10, styleDark));
		
		
		//set button functions
		menuMain.panel.buttonNewGame.events.onInputUp.add(this.openNewGameMenu);
		menuMain.panel.buttonLoadGame.events.onInputUp.add(function(){menuState.loadGame('test')});
		
		
		//set up new game panel
		slickUI.add(menuStart.panel = new SlickUI.Element.Panel(0, 0, mapWidthDefault, mapHeightDefault));
		//title
		menuStart.panel.add(menuStart.panel.title = new SlickUI.Element.Text(80, 5, 'New Game', 14, styleTitle));
		//start button
		menuStart.panel.add(menuStart.panel.buttonStart = new SlickUI.Element.Button(200, 32*5+14, 100, 32));
		menuStart.panel.buttonStart.add(new SlickUI.Element.Text(8,4, 'Start', 10, styleDark));
		//cancel button
		menuStart.panel.add(menuStart.panel.buttonCancel = new SlickUI.Element.Button(2, 32*5+14, 100, 32));
		menuStart.panel.buttonCancel.add(new SlickUI.Element.Text(8,4, 'Cancel', 10, styleDark));
		//name shop
		menuStart.panel.add(menuStart.panel.nameLabel = new SlickUI.Element.Text(8, 32 + 2, 'Bookshop Name', 14, styleDark));
		menuStart.panel.nameField = game.add.inputField(menuStart.panel.x + 14, menuStart.panel.y + 56, {padding: 4, borderRadius:2});
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