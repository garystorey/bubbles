import Phaser from 'phaser';
import config from '../gameconfig'
let isPressed = false



let scoreText: Phaser.GameObjects.Text,
  bombText: Phaser.GameObjects.Text,
  hiscoreText: Phaser.GameObjects.Text
export default class Bubbles extends Phaser.Scene {

  ground?: Phaser.Physics.Arcade.StaticGroup
  collider?: Phaser.Physics.Arcade.StaticGroup
  items?: Phaser.Physics.Arcade.Group

  hiscore: number = 0
  score: number = 0
  bombs: number = 0
  reset: number = 0

  gravityMin: number = config.gravityIncrement
  gameover: boolean = false

  catch?: Phaser.Sound.BaseSound
  explosion?: Phaser.Sound.BaseSound

  constructor() {
    super('Bubbles');

    this.outOfBounds = this.outOfBounds.bind(this)
    this.checkForHit = this.checkForHit.bind(this)

    this.hiscore = Number(localStorage.getItem(config.storage)) || 0
    this.score = 0;
    this.bombs = 0


    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      if (e.key === ' ') isPressed = true
    })

    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.key === ' ') isPressed = false
    })

  }

  preload() {
    this.load.atlas('items', 'sprite.png', 'sprite.json')
    this.load.audio('explosion', ['boom.wav'])
    this.load.audio('catch', ['catch.ogg'])
    this.load.image("ground", "/ground.png");
    this.load.image("collider", "/collider.png");
    this.load.image("bg", "bg.jpg");
  }

  create() {

    this.explosion = this.sound.add("explosion", { loop: false });
    this.catch = this.sound.add("catch", { loop: false });
    this.add.image(500, 500, "bg");

    this.anims.create({ key: config.items[3], frames: this.anims.generateFrameNames('items', { prefix: `${config.items[3]}-`, suffix: '.png', start: 1, end: 8 }), repeat: -1, duration: 1000 })
    this.anims.create({ key: config.items[2], frames: this.anims.generateFrameNames('items', { prefix:  `${config.items[2]}-`, suffix: '.png', start: 1, end: 8 }), repeat: -1, duration: 1500 })
    this.anims.create({ key: config.items[1], frames: this.anims.generateFrameNames('items', { prefix:  `${config.items[1]}-`, suffix: '.png', start: 1, end: 8 }), repeat: -1, duration: 1000 })
    this.anims.create({ key: config.items[0], frames: this.anims.generateFrameNames('items', { prefix:  `${config.items[0]}-`, suffix: '.png', start: 1, end: 8 }), repeat: -1, duration: 1500 })

    this.ground = this.physics.add.staticGroup();
    this.collider = this.physics.add.staticGroup();
    this.items = this.physics.add.group()

    this.ground.create(225, 610, "ground");
    this.ground.create(600, 610, "ground");
    this.collider.create(225, 700, "collider");
    this.collider.create(600, 700, "collider");

    scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "16px", color: '#eee' });
    bombText = this.add.text(450, 16, "Bombs Hit: 0", { fontSize: "16px", color: "#eee" });
    hiscoreText = this.add.text(175, 16, `High Score: ${this.hiscore}`, {
      fontSize: "22px",
      color: "#eee"
    }
    );
  }

  update() {

    if (this.gameover && isPressed && this.reset > 50) {
      isPressed = false
      this.reset = 0
      this.gameover = false
      this.score = 0
      this.bombs = 0
      this.reset = 0
      this.gravityMin = 100

      this.scene.stop('Bubbles')
      this.scene.start('Start')
    }

    if (this.gameover) {
      this.reset++
    }

    if (this.bombs >= config.hitsToLose) {
      this.gameover = true
      this.add.text(175, 250, "Game Over", {
        fontSize: "50px",
        color: "#eee"
      });
      this.add.text(176, 251, "Game Over", {
        fontSize: "50px",
        color: "#eee"
      });
      this.add.text(177, 252, "Game Over", {
        fontSize: "50px",
        color: "#eee"
      });
      this.add.text(175, 350, "Hit SPACE to return", {
        fontSize: "24px",
        color: "#eee"
      });

      if (this.score > this.hiscore) {
        this.hiscore = this.score;
        hiscoreText.setText(`High Score: ${this.hiscore}`);
        localStorage.setItem(config.storage, String(this.score));
      }

      return
    }

    if (Phaser.Math.Between(0, 100) < 98) return

    if (this.score % config.incrementEvery === 0 && this.score > 0) this.gravityMin += config.gravityIncrement

    const position = Phaser.Math.Between(50, 550);
    const gravity = Phaser.Math.Between(this.gravityMin, this.gravityMin + 150);
    const rand = Phaser.Math.Between(0, 100)
    const name = rand < 30 ? config.items[3] : rand > 30 && rand < 60 ? config.items[2]
      : rand > 60 && rand < 80 ? config.items[1] : config.items[0];

    const el = this.physics.add.sprite(position, 75, 'items', `${name}-1.png`)
    this.items?.add(el,true)
    el.setBodySize(el.width,el.height,true).setGravityY(gravity).setName(name).setScale(0.25).play(name, true)
    this.physics.add.collider(el, this.collider!, this.outOfBounds, undefined, this.game);
    this.physics.add.overlap(el, this.ground!, this.checkForHit, undefined, this.game);
  }

  outOfBounds(el: Phaser.GameObjects.GameObject) {
    if (this.gameover) return;
    const points = el.name === config.items[0] ? 100 : el.name === config.items[1] ? 50 : 0;
    el.destroy();
    this.score -= points;
    if (this.score < 0) this.score = 0;
    scoreText.setText(`Score: ${this.score || 0}`);
  }

  checkForHit(el: Phaser.GameObjects.GameObject) {
    if (this.gameover) return
    if (!isPressed) return

    // hit a bomb
    if (el.name === config.items[3]) {
      this.bombs++
      const b = this.bombs
      this.explosion?.play()
      this.items?.children.each(i => i.destroy())
      this.bombs=b
      bombText.setText(`Bombs Hit: ${this.bombs || 0}`);
      el.destroy();
      return
    }
    // hit something else
    const name = el.name
    el.destroy()
    const points = name === config.items[0] ? 500 : name === config.items[2] ? 250 : name === config.items[1] ? 50 : 0;
    if (points > 0) this.catch?.play()
    this.score += points;
    if (this.score < 0) this.score = 0;
    scoreText.setText(`Score: ${this.score || 0}`);
  }

}

