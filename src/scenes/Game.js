import PlayerContainer from '../classes/player/PlayerContainer.js';
import Chest from '../classes/Chest.js';
import Monster from '../classes/Monster.js';
import Map from '../classes/Map.js';
import GameManager from '../game_manager/GameManager.js';
import Item from '../classes/Item.js';

export class Game extends Phaser.Scene
{
    constructor()
    {
        super('Game');
    }

    init(data) {
        this.scene.launch('Ui');
        this.selectedCharacter = data.selectedCharacter || 0;
    }
    
    create ()
    {
        this.createMap();
        this.createAudio();
        this.createGroups();
        this.createInput();

        this.createGameManager();

        // handle game resize
        this.scale.on('resize', this.resize, this);
        // resize our game
        this.resize({ height: this.scale.height, width: this.scale.width });
    }

    update() {
        if (this.player) this.player.update(this.cursors);
    }

    createAudio() {
        this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.3 });
        this.playerAttackAudio = this.sound.add('playerAttack', { loop: false, volume: 0.01 });
        this.playerDamageAudio = this.sound.add('playerDamage', { loop: false, volume: 0.2 });
        this.playerDeathAudio = this.sound.add('playerDeath', { loop: false, volume: 0.2 });
        this.monsterDeathAudio = this.sound.add('enemyDeath', { loop: false, volume: 0.2 });
    }

    createPlayer(playerObject) {
        this.player = new PlayerContainer(
        this,
        playerObject.x * 2,
        playerObject.y * 2,
        'characters',
        0,
        playerObject.health,
        playerObject.maxHealth,
        playerObject.id,
        this.playerAttackAudio,
        );
    }

    createGroups() {
        // create a chest group
        this.chests = this.physics.add.group();
        // create a monster group
        this.monsters = this.physics.add.group();
        this.monsters.runChildUpdate = true;
    }

    spawnChest(chestObject) {
        let chest = this.chests.getFirstDead();
        if (!chest) {
        chest = new Chest(this, chestObject.x * 2, chestObject.y * 2, 'items', 0, chestObject.gold, chestObject.id);
        // add chest to chests group
        this.chests.add(chest);
        } else {
        chest.coins = chestObject.gold;
        chest.id = chestObject.id;
        chest.setPosition(chestObject.x * 2, chestObject.y * 2);
        chest.makeActive();
        }
    }

    spawnMonster(monsterObject) {
        let monster = this.monsters.getFirstDead();
        if (!monster) {
        monster = new Monster(
            this,
            monsterObject.x,
            monsterObject.y,
            'monsters',
            monsterObject.frame,
            monsterObject.id,
            monsterObject.health,
            monsterObject.maxHealth,
        );
        // add monster to monsters group
        this.monsters.add(monster);
        } else {
        monster.id = monsterObject.id;
        monster.health = monsterObject.health;
        monster.maxHealth = monsterObject.maxHealth;
        monster.setTexture('monsters', monsterObject.frame);
        monster.setPosition(monsterObject.x, monsterObject.y);
        monster.makeActive();
        }
    }

    spawnItem(itemObject) {
        let item = this.items.getFirstDead();
        if (!item) {
            item = new Item(this, itemObject.x * 2, itemObject.y * 2, 'tools', itemObject.frame, itemObject.id);
            // add item to items group
            this.items.add(item);
        } else {
            item.id = itemObject.id;
            item.frame = itemObject.frame;
            item.setFrame(item.frame);
            item.setPosition(itemObject.x * 2, itemObject.y * 2);
            item.makeActive();
        }
    }

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    addCollisions() {
        // check for collisions between the player and the tiled blocked layer
        this.physics.add.collider(this.player, this.map.blockedLayer);
        // check for overlaps between player and chest game objects
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
        // check for collisions between the monster group and the tiled blocked layer
        this.physics.add.collider(this.monsters, this.map.blockedLayer);
        // check for overlaps between the player's weapon and monster game objects
        this.physics.add.overlap(this.player.weapon, this.monsters, this.enemyOverlap, null, this);
        // check for overlaps between player and item game objects
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);
    }

    enemyOverlap(weapon, enemy) {
        if (this.player.playerAttacking && !this.player.swordHit) {
        this.player.swordHit = true;
        this.events.emit('monsterAttacked', enemy.id, this.player.id);
        }
    }

    collectChest(player, chest) {
        // play gold pickup sound
        this.goldPickupAudio.play();
        this.events.emit('pickUpChest', chest.id, player.id);
    }

    collectItem(player, item) {
        this.socket.emit('pickUpItem', item.id);
    }

    createMap() {
        // create map
        this.map = new Map(this, 'map', 'background', 'background', 'blocked');
    }

    resize(gameSize) {
        const { width, height } = gameSize;

        this.cameras.resize(width, height);
    }

    createGameManager() {
        this.events.on('spawnPlayer', (playerObject) => {
        this.createPlayer(playerObject);
        this.addCollisions();
        });

        this.events.on('chestSpawned', (chest) => {
        this.spawnChest(chest);
        });

        this.events.on('monsterSpawned', (monster) => {
        this.spawnMonster(monster);
        });

        this.events.on('chestRemoved', (chestId) => {
        this.chests.getChildren().forEach((chest) => {
            if (chest.id === chestId) {
            chest.makeInactive();
            }
        });
        });

        this.events.on('monsterRemoved', (monsterId) => {
        this.monsters.getChildren().forEach((monster) => {
            if (monster.id === monsterId) {
            monster.makeInactive();
            this.monsterDeathAudio.play();
            }
        });
        });

        this.events.on('updateMonsterHealth', (monsterId, health) => {
        this.monsters.getChildren().forEach((monster) => {
            if (monster.id === monsterId) {
            monster.updateHealth(health);
            }
        });
        });

        this.events.on('monsterMovement', (monsters) => {
        this.monsters.getChildren().forEach((monster) => {
            Object.keys(monsters).forEach((monsterId) => {
            if (monster.id === monsterId) {
                this.physics.moveToObject(monster, monsters[monsterId], 40);
            }
            });
        });
        });

        this.events.on('updatePlayerHealth', (playerId, health) => {
        if (health < this.player.health) {
            this.playerDamageAudio.play();
        }
        this.player.updateHealth(health);
        });

        this.events.on('respawnPlayer', (playerObject) => {
            this.playerDeathAudio.play();
            this.player.respawn(playerObject);
        });

        this.events.on('currentItems', (items) => {
            Object.keys(items).forEach((id) => {
                this.spawnItem(items[id]);
            });
        });

        this.events.on('itemSpawned', (item) => {
            this.spawnItem(item);
        });

        this.events.on('updateItems', (playerObject) => {
            this.player.items = playerObject.playerItems;
            this.player.maxHealth = playerObject.maxHealth;
            this.player.attackValue = playerObject.attack;
            this.player.defenseValue = playerObject.defense;
            this.player.updateHealthBar();
        });

        this.events.on('itemRemoved', (itemId) => {
            this.items.getChildren().forEach((item) => {
                if (item.id === itemId) {
                    item.makeInactive();
                }
            });
        });

        this.gameManager = new GameManager(this, this.map.map.objects);
        this.gameManager.setup();
    }
}
