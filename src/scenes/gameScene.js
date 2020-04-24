import Phaser from 'phaser';
import logoImg from '../assets/logo.png';
import star from '../assets/star.png';
import dude from '../assets/dude.png';
import sky from '../assets/sky.png';
import bomb from '../assets/bomb.png';
import platform from '../assets/platform.png';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('logo', logoImg);
    this.load.image('dude', dude);
    this.load.image('sky', sky);
    this.load.image('star', star);
    this.load.image('platform', platform);
    this.load.image('bomb', bomb);
  }

  create() {
    const logo = this.add.image(400, 150, 'logo');

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}
