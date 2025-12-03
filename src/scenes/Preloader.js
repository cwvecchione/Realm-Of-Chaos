export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('../../assets');
        // load images
        this.loadImages();
        // load spritesheets
        this.loadSpriteSheets();
        // load audio
        this.loadAudio();
        // load tilemap
        this.loadTileMap();
    }

    loadImages() {
        this.load.image('button1', '/images/ui/blue_button01.png');
        this.load.image('button2', '/images/ui/blue_button02.png');
        // load the map tileset image
        this.load.image('background', '/level/background-extruded.png');
    }

    loadSpriteSheets() {
        this.load.spritesheet('items', '/images/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('characters', '/images/characters.png', { frameWidth: 32, frameHeight: 32, startFrame: 9 });
        this.load.spritesheet('monsters', '/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
    }

    loadAudio() {
        this.load.audio('goldSound', ['/audio/Pickup.wav']);
        this.load.audio('enemyDeath', ['/audio/EnemyDeath.wav']);
        this.load.audio('playerAttack', ['/audio/PlayerAttack.wav']);
        this.load.audio('playerDamage', ['/audio/PlayerDamage.wav']);
        this.load.audio('playerDeath', ['/audio/PlayerDeath.wav']);
    }

    loadTileMap() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '/level/large_level.json');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Title');
    }
}
