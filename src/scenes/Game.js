import { Scene } from 'phaser';

export class Game extends Scene
{
 
    constructor ()
    {
        super('Game');
    }


    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');

        this.load.image('sky', 'sky.png');
        this.load.image('ground', 'platform.png');
        this.load.image('star', 'star.png');
        this.load.image('bomb', 'bomb.png');
        this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 });

        //this.load.image('tileset5', 'tilemaps/tiles/tileset5.png');
        //this.load.tilemapTiledJSON('tilemap', 'tilemaps/tiles/tileset5.json');
        //this.load.tilemapTiledJSON('tilemap', 'tilemaps/mapa1.json');

        // Load the tileset image
        this.load.image('tiles', 'tilesets/tileset5.png');

        // Load the tilemap
        this.load.tilemapTiledJSON('map', 'tilemaps/mapa1.json');

    }

    create ()
    {
        this.gameOver=false;

        this.add.image(400, 300, 'sky');

        this.cargarTiledMap();

        this.platforms=this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');


        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.player.body.setGravityY(30);


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.estrellas();

        this.bombas();
        
        this.scoreText = this.add.text(506, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.score=0;

        //this.add.image(0, 0, 'tiles');

        

        // Create layers from the map
        

        // Optional: set collision on a layer
        //wallLayer.setCollisionByProperty({ collides: true });

        //this.add.image(0, 0, 'tileset5');

        //const map = this.make.tilemap({ key: 'tilemap' });

        // add the tileset image we are using
        //const tileset = map.addTilesetImage('tileset5', 'tileset5');
        
        // create the layers we want in the right order
        //map.createStaticLayer('Background', tileset);

        // "Ground" layer will be on top of "Background" layer
        //map.createStaticLayer('Ground', tileset);

        
    }

    cargarTiledMap(){
        // Create the tilemap
        const map = this.make.tilemap({ key: 'map' });

        // Add the tileset image used in Tiled (name must match the name in Tiled)
        const tileset = map.addTilesetImage('tileset5', 'tiles');
        const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
        const groundLayer = map.createLayer('Ground', tileset, 0, 0);
        const treesLayer = map.createLayer('Trees', tileset, 0, 0);
        const wallLayer = map.createLayer('Walls', tileset, 0, 0);
    }

    estrellas() {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.stars.children.iterate(function (star) {
        
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    }

    bombas(){
        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    collectStar (player, star)
    {
        this.score=this.score+10;
        this.scoreText.setText('Score: ' + this.score);

        star.disableBody(true, true);

        if (this.stars.countActive(true) === 0)
        {
            this.stars.children.iterate(function (star) {
    
                star.enableBody(true, star.x, 0, true, true);
    
            });
    
            var x = 0;

            if(this.player.x<400){
                x=Phaser.Math.Between(400, 800);
            }
            else{
                x=Phaser.Math.Between(0, 400);
            }
    
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
        }

   
    }

    hitBomb (player, bomb)
    {
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.gameOver = true;
    }

    update(){
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
        
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
        
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
        
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }

        if(this.cursors.space.isDown){

            this.player.setVelocityY(-330);
        }

    }
}
