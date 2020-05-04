import Phaser from 'phaser';
import ScoreLabel from '../ui/scoreLabel';
import star from '../assets/star.png';
import dude from '../assets/dude.png';
import sky from '../assets/sky.png';
import bomb from '../assets/bomb.png';
import platform from '../assets/platform.png';
import BombSpawner from './bombSpawner';
import coin from '../assets/coin.png';

const DUDE_KEY = 'dude';
const GROUND_KEY = 'ground';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';
const COIN_KEY = 'coin';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');

    this.player = undefined;
    this.cursors = undefined;
    this.stars = undefined;
    this.ScoreLabel = undefined;
    this.bombSpawner = undefined;

    this.gameOver = false;

    this.gameOptions = {
      platformSpeedRange: [300, 400],
      spawnRange: [80, 400],
      platformSizeRange: [90, 300],
      platformHeightRange: [-10, 10],
      platformHeighScale: 10,
      platformVerticalLimit: [0.4, 0.8],
      playerGravity: 900,
      jumpForce: 400,
      playerStartPosition: 200,
      jumps: 2,
      coinPercent: 25,
      bombPercent: 25,
    };
  }

  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
  }

  // eslint-disable-next-line no-shadow
  collectStar(player, star) {
    star.disableBody(true, true);
    this.ScoreLabel.add(10);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
    this.bombSpawner.spawn(player.x);
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(800, 620, GROUND_KEY).setScale(4).refreshBody();
    platforms.create(170, 370, GROUND_KEY);
    platforms.create(470, 170, GROUND_KEY);
    platforms.create(800, 300, GROUND_KEY);
    platforms.create(1300, 400, GROUND_KEY);
    platforms.create(390, 470, GROUND_KEY).setScale(0.5).refreshBody();

    return platforms;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 22,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    return stars;
  }

  createCoins() {
    this.coins = this.add.group({
      removeCallback: (coin) => {
        coin.scene.coinPool.add(coin);
      },
    });

    this.coinPool = this.add.group({
      removeCallback: (coin) => {
        coin.scene.coins.add(coin);
      },
    });

    this.anims.create({
      key: 'rotate',
      frames: this.anims.generateFrameNumbers(COIN_KEY, {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, DUDE_KEY);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: DUDE_KEY, frame: 4 }],
      frameRate: 20,
    });

    return this.player;
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }

  preload() {
    this.load.image('sky', sky);
    this.load.image('star', star);
    this.load.image('ground', platform);
    this.load.image('bomb', bomb);

    this.load.spritesheet('dude', dude, {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.spritesheet('coin', coin, {
      frameWidth: 20,
      frameHeight: 20,
    });
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(1200, 300, 'sky');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();

    this.ScoreLabel = this.createScoreLabel(16, 15, 0);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(
      this.player,
      bombsGroup,
      this.hitBomb,
      null,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this,
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.gameOver) {
      return;
    }
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-260);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(260);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(700);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-380);
    }
  }
}
