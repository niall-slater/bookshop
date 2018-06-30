var gameWidth = 480; //was 352
var gameHeight = 270; //was 224

var game = new Phaser.Game(gameWidth, gameHeight, 'game', false, false);

game.antialias = false;

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);

game.state.start('boot');