import Phaser from 'phaser';

let isPressed = false
const BOMBS_TO_HIT_BEFORE_GAME_OVER = 5

let scoreText: Phaser.GameObjects.Text,
    bombText: Phaser.GameObjects.Text,
    hiscoreText: Phaser.GameObjects.Text
export default class Bubbles extends Phaser.Scene {

  ground?: Phaser.Physics.Arcade.StaticGroup
  collider?: Phaser.Physics.Arcade.StaticGroup

  hiscore: number = 0
  score: number = 0
  bombs: number = 0
  reset: number = 0

  gravityMin: number = 100
  gameover: boolean = false

  constructor() {
    super('Bubbles');

    this.outOfBounds =  this.outOfBounds.bind(this)
    this.checkForHit = this.checkForHit.bind(this)

    this.hiscore = Number(localStorage.getItem("bomber_high_score")) || 0
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
    this.load.atlas('items','sprite.png','sprite.json')
    this.load.image("ground", "/ground.png");
    this.load.image("collider", "/collider.png");
    this.load.image("bg", "bg.jpg");
  }

  create() {

    this.add.image(500, 500, "bg");
    this.anims.create({key:'bomb', frames: this.anims.generateFrameNames('items', { prefix: 'bomb-', suffix:'.png', start:1, end:8 }), repeat:-1,duration: 1000})
    this.anims.create({key:'gem', frames: this.anims.generateFrameNames('items', { prefix: 'gem-', suffix:'.png', start:1, end:8 }), repeat:-1,duration: 1500})
    this.anims.create({key:'clover', frames: this.anims.generateFrameNames('items', { prefix: 'clover-', suffix:'.png', start:1, end:8 }), repeat:-1,duration: 1000})
    this.anims.create({key:'watermelon', frames: this.anims.generateFrameNames('items', { prefix: 'watermelon-', suffix:'.png', start:1, end:8 }), repeat:-1,duration: 1500})


    this.ground = this.physics.add.staticGroup();
    this.collider = this.physics.add.staticGroup();

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

    if (this.gameover && isPressed && this.reset >50) {
      isPressed = false
      this.reset =0
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

    if (this.bombs >= BOMBS_TO_HIT_BEFORE_GAME_OVER) {
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

      if (this.score > this.hiscore) {
        this.hiscore = this.score;
        hiscoreText.setText(`High Score: ${this.hiscore}`);
        localStorage.setItem("bomber_high_score", String(this.score));
      }
  
      return
    }

    if (Phaser.Math.Between(0, 100) < 95) return

    // update speed based on score
    if (this.score % 5000 === 0 && this.score > 0) {
      this.gravityMin += 100
    }
    // Random start point
    const position = Phaser.Math.Between(50, 550);
    // Add random gravity
    const gravity = Phaser.Math.Between(this.gravityMin, this.gravityMin + 200);
    // Get type of item
    const rand = Phaser.Math.Between(0, 100)
    const name = rand < 30 ? "bomb" : rand > 30 && rand < 60 ? "gem"
      : rand > 60 && rand < 80 ? "clover" : "watermelon";

    const el = this.physics.add.sprite(position,75,'items', `${name}-1.png`).setGravityY(gravity).setName(name).setScale(0.25).play(name,true)
    this.physics.add.overlap(el, this.collider!, this.outOfBounds, undefined, this.game);
    this.physics.add.overlap(el, this.ground!, this.checkForHit, undefined, this.game);
   

  }

  outOfBounds(el: Phaser.GameObjects.GameObject) {
    if (this.gameover) return;
    const points = el.name === "watermelon" ? 100 : el.name === "clover" ? 50 : 0;
    el.destroy();
    this.score -= points;
    if (this.score < 0) this.score = 0;
    scoreText.setText(`Score: ${this.score||0}`);
    bombText.setText(`Bombs Hit: ${this.bombs||0}`);
  }

  checkForHit(el: Phaser.GameObjects.GameObject) {
    if (this.gameover) return
    if (!isPressed) return
    if (el.name === "bomb") this.bombs++;
    const points = el.name === "watermelon" ? 500 : el.name === "clover" ? 250 : el.name === "gem" ? 50 : 0;
    el.destroy();
    this.score += points;
    if (this.score < 0) this.score = 0;
    scoreText.setText(`Score: ${this.score||0}`);
    bombText.setText(`Bombs Hit: ${this.bombs||0}`);
  }

}

