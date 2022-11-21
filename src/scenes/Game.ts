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
    this.load.image("blue", "/blue.png");
    this.load.image("green", "/green.png");
    this.load.image("red", "/red.png");
    this.load.image("bomb", "/bomb.png");
    this.load.image("ground", "/ground.png");
    this.load.image("collider", "/collider.png");
    this.load.image("bg", "bg.jpg");
  }

  create() {

    this.add.image(500, 500, "bg");

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

    if (this.gameover) return

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
    const gravity = Phaser.Math.Between(this.gravityMin, this.gravityMin + 100);
    // Get type of item
    const rand = Phaser.Math.Between(0, 100)
    const name = rand < 25 ? "blue" : rand > 25 && rand < 50 ? "green"
      : rand > 50 && rand < 75 ? "red" : "bomb";

    const el = this.physics.add
      .image(position, 75, name)
      .setGravityY(gravity)
      .setName(name);
    this.physics.add.overlap(el, this.collider!, this.outOfBounds, undefined, this.game);
    this.physics.add.overlap(el, this.ground!, this.checkForHit, undefined, this.game);

  }

  outOfBounds(el: Phaser.GameObjects.GameObject) {
    if (this.gameover) return;
    const points = el.name === "blue" ? 100 : el.name === "green" ? 50 : 0;
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
    const points = el.name === "blue" ? 500 : el.name === "green" ? 250 : el.name === "red" ? -250 : 0;
    el.destroy();
    this.score += points;
    if (this.score < 0) this.score = 0;
    scoreText.setText(`Score: ${this.score||0}`);
    bombText.setText(`Bombs Hit: ${this.bombs||0}`);
  }

}

