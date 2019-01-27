
// Basic configuration
var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var platforms;
var player;
var cursors;
var score = 0;
var scoreText;
var bombs;
var rats;
var houses;

var gameOver = false;
var map;
var velolcity = 290;
var junp = -375;
var game = new Phaser.Game(config);
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); 
    score += 10;
    scoreText.setText('SCORE: ' + score);
    return false;
}
function powerSoda(sprite, tile) {
    sodaLayer.removeTileAt(tile.x, tile.y); 
    velolcity += 260;
    setTimeout(function(){
        velolcity -= 260;
    }, 15000);
    
    return false;
}
function powerFish(sprite, tile) {
    fishLayer.removeTileAt(tile.x, tile.y); 
    junp -= 100;
    setTimeout(function(){
        junp += 100;
    }, 10000);
    
    return false;
} 
function houseWin(player, house){
    if(!gameOver) {
        house.play('houseAnimation');

    }
    this.physics.pause();

    gameOver = true;
    player.setVelocityX(0);
    player.setVelocityY(500);
    player.anims.play('turn');

}
/*
Bomba
 var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
*/

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

        this.physics.pause();

    gameOver = true;
}
function hitRat(player, rat) {
    if(!gameOver){
        this.physics.pause();

        player.setTint(0x07FF00);
    
        player.anims.play('turn');
    
        gameOver = true;
    }
    
}
function preload() {
    this.load.tilemapTiledJSON('map', 'assets/map.json');

    this.load.image('soda', 'assets/soda.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('fish', 'assets/fish.png');
    this.load.spritesheet('rat', 'assets/rat.png', {frameWidth: 70, frameHeight: 70});

    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 144, frameHeight: 144 }
    );
    this.load.spritesheet('tiles', 'assets/tiles.png', {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('fishGold', 'assets/fishGold.png');
    this.load.spritesheet('house', 'assets/house.png', {frameWidth: 450, frameHeight: 450});

    this.load.audio('theme', 'assets/ij.mp3');

}

function create() {
    music = this.sound.add('theme');
    music.play()
    // Score
    scoreText = this.add.text(20, 20, 'SCORE: 0', { fontSize: '32px', fill: '#FFF' });
    scoreText.setScrollFactor(0);
    // Player
    player = this.physics.add.sprite(50, 400, 'dude');

    player.setBounce(0.05);
    player.body.setSize(75, 138, 37.5, 66);
    player.body.setGravityY(-10)
    player.setCollideWorldBounds(true);

    // animations of the player
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
  
    // Bombs
    
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);



    // Controlling
    cursors = this.input.keyboard.createCursorKeys();
    
    // new codde
    
    map = this.make.tilemap({key: 'map'});
    
    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    // load the map 
     map = this.make.tilemap({key: 'map'});
    // camera
    this.physics.add.collider(groundLayer, player);

     // set bounds so the camera won't go outside the game world
     this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
     // make the camera follow the player
     this.cameras.main.startFollow(player, false, 1, 1, -500);
     
     // set background color, so the sky is not black    
     this.cameras.main.setBackgroundColor('#ccccff');
     
    // coin image used as tileset
    var coinTiles = map.addTilesetImage('fishGold');
    // add coins as tiles
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);
    // coins collapse and collectio
    coinLayer.setTileIndexCallback(19, collectCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin will be called    
    this.physics.add.overlap(player, coinLayer);

    // soda
    var sodaTiles = map.addTilesetImage('soda');
    // add coins as tiles
    sodaLayer = map.createDynamicLayer('Soda', sodaTiles, 0, 0);
    // coins collapse and collectio
    sodaLayer.setTileIndexCallback(17, powerSoda, this);
    // when the player overlaps with a tile with index 17, collectCoin will be called    
    this.physics.add.overlap(player, sodaLayer);

    // Fish
    var fishTiles = map.addTilesetImage('fish');
    // add coins as tiles
    fishLayer = map.createDynamicLayer('Fish', fishTiles, 0, 0);
    // coins collapse and collectio
    fishLayer.setTileIndexCallback(18, powerFish, this);
    // when the player overlaps with a tile with index 17, collectCoin will be called    
    this.physics.add.overlap(player, fishLayer);

    var ratAnimationLeft = {
        key: 'ratAnimationLeft',
        frames: this.anims.generateFrameNumbers('rat', { start: 0, end: 1 }),
        repeat: -1,
        showOnStart: true
    };
    var ratAnimationRigth = {
        key: 'ratAnimationRigth',
        frames: this.anims.generateFrameNumbers('rat', { start: 2, end: 3 }),
        repeat: -1,
        showOnStart: true
    };
    this.anims.create(ratAnimationRigth);
    this.anims.create(ratAnimationLeft);

     // Rats
     rats = this.physics.add.group({
        key: 'rat',
        repeat: 11,
        setXY: { x: 100, y: 500, stepX: 800 }
    });
    
    rats.children.iterate(function (rat) {

     rat.setBounce(0);
     rat.setCollideWorldBounds(false);
     rat.body.setSize(70, 25, 35, 12);

     rat.setVelocityX(200 * [1,-1][Math.floor(Math.random()*2)]);

    if(rat.body.velocity.x < 0){
        rat.play('ratAnimationLeft');

    }
    else{
        rat.play('ratAnimationRigth');
    }

    rat.origialX= rat.body.x
})
this.physics.add.collider(rats,groundLayer);
this.physics.add.collider(player, rats, hitRat, null, this);
houses = this.physics.add.group();
var house = houses.create(6000, 350, 'house');

this.physics.add.collider(houses,groundLayer);
this.physics.add.overlap(houses,player);
var houseAnimation = {
    key: 'houseAnimation',
    frames: this.anims.generateFrameNumbers('house', { start: 0, end: 4 }),
    repeat: -1,
    frameRate: 8

};
house.body.setSize(360, 450, 180, 225);

this.anims.create(houseAnimation);
this.physics.add.overlap(player, houses, houseWin, null, this);


}

function update() {

    rats.children.iterate(function (rat) {
        if(!isNaN(rat.x)){
        if (Math.sqrt((rat.origialX-rat.body.x )* (rat.origialX-rat.body.x )) > 1000) {
            rat.origialX = rat.body.x - 10
            let v = rat.body.velocity.x * -1
            rat.setVelocityX(v);
            console.log("change")
            if(v < 0){

                rat.play('ratAnimationLeft');

            }
            else{
                rat.play('ratAnimationRigth');

            }
        }
    }
    });
    if (gameOver)
    {
        return;
    }
    if (cursors.left.isDown) {
        player.setVelocityX(velolcity * -1);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(velolcity);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
    if ((cursors.space.isDown || cursors.up.isDown  )&& player.body.onFloor()) {
        player.setVelocityY(junp);
    }
    else if(cursors.down.isDown && !player.body.onFloor()){
        player.setVelocityY(400);

    }
   

}


$('html,body').on('click', function() {

    if (!inGame) {
        if (game != undefined) {
            game.sound.context.resume();
        }
    }

});