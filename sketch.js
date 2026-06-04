// input: the game player clicks buttons to change screens and uses arrow keys to move Santa
// output: the game displays different screens, Santa moving, gifts, their score, and thier number of lives left
let screen = "start";
let btns;
let bg;
let gifts = [];
let santaimage;
let giftsimage;
let instructscreen;
let gamescreen;
let losescreen;
let santa = {x:400, y:450, w:150, h:150, speed:5, img:null};
let lives = 4;
let score = 0;

function preload() {
  bg = loadImage("background.png");
  instructscreen = loadImage("instructions.png");
  santaimage = loadImage("santa.png");
  giftsimage = loadImage("gift.png");
  gamescreen = loadImage("game.jpg");
  losescreen = loadImage("losescreen.jpeg");
}

function setup() {
  createCanvas(800, 600);
  // list: stores button data used on different screens
  btns = [
    {x:width/2.5, y:350, w:200, h:55, label:"start game", color:250},
    {x:width/2.5, y:450, w:200, h:55, label:"instructions", color:250},
    {x:width/2.5, y:450, w:200, h:55, label:"back to start", color:250},
    {x:width/2.5, y:450, w:200, h:55, label:"restart", color:250}
  ];
}

function draw() {
  if (santa.img === null) santa.img = santaimage;
  if (screen === "start") startScreen();
  else if (screen === "instructions") instructionsScreen();
  else if (screen === "game") gameScreen();
  else if (screen === "lose") loseScreen();
}

// output: draws a button on the screen
function drawButton(bx, by, bw, bh, words, colo) {
  fill(colo);
  stroke(255);
  rect(bx, by, bw, bh);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text(words, bx + bw / 2, by + bh / 2);
}

// output: displays the start screen
function startScreen() {
  background(bg);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(30);

  drawButton(btns[0].x, btns[0].y, btns[0].w, btns[0].h, btns[0].label, btns[0].color);
  drawButton(btns[1].x, btns[1].y, btns[1].w, btns[1].h, btns[1].label, btns[1].color);

  fill(200, 20, 20);
  textSize(100);
  text("Help Santa!", 400, 200);
}

// output: displays the instructions screen
function instructionsScreen() {
  background(instructscreen);
  textSize(25);
  fill(0);
  text("Help Santa catch the presents falling from the sky! Use the left and right arrows on your keyboard to allow Santa to get the presents. Try to get the highest score possible, but don't miss any presents or else you lose a life. If you get to 0 lives you lose.", 200, 50, 400, 400);
  drawButton(btns[2].x, btns[2].y, btns[2].w, btns[2].h, btns[2].label, btns[2].color);
}

// output: it displays the game screen
function gameScreen() {
  if (lives <= 0) {
    screen = "lose";
    return;
  }
  background(gamescreen);
  makeGifts();
  // procedure call: speed 3 controls how fast the gifts fall
  moveGifts(3);
  moveSanta();
  textSize(30);
  fill(255);
  text("Score: " + score, 70, 30);
  text("Lives: " + lives, 70, 60);
}

// list: stores gift objects in the gifts list
function makeGifts() {
  if (gifts.length < 5) {
    gifts.push({x:random(0, width - 70), y:random(-200, 0), w:70, h:70});
  }
}

// procedure: moves the gifts, checks for collisions, updates the score and lives, and draws the falling gifts
// parameter: the speed controls how fast each gift falls
// this procedure uses sequencing, selection, and iteration
function moveGifts(speed) {
  if (speed > 0) {
    for (let i = gifts.length - 1; i >= 0; i--) {
      gifts[i].y += speed;

      if (checkCollision(gifts[i], santa)) {
        score++;
        gifts.splice(i, 1);
      } 
      else if (gifts[i].y > height) {
        lives--;
        gifts.splice(i, 1);
      } 
      else {
        image(giftsimage, gifts[i].x, gifts[i].y, gifts[i].w, gifts[i].h);
      }
    }
  }
}

// input: the arrow keys move Santa left and right
function moveSanta() {
  if (keyIsDown(LEFT_ARROW)) {
    santa.x = max(0, santa.x - santa.speed);
  }

  if (keyIsDown(RIGHT_ARROW)) {
    santa.x = min(width - santa.w, santa.x + santa.speed);
  }

  image(santa.img, santa.x, santa.y, santa.w, santa.h);
}

// output: it displays the game over screen
function loseScreen() {
  background(losescreen);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(60);
  fill(250);
  text("Game Over! Final score: " + score, 400, 300);
  drawButton(btns[3].x, btns[3].y, btns[3].w, btns[3].h, btns[3].label, btns[3].color);
}

// input: user mouse clicks  buttons and the screen changes
function mousePressed() {
  if (screen === "start") {
    if (isClicked(btns[0])) {
      screen = "game";
    } 
    else if (isClicked(btns[1])) {
      screen = "instructions";
    }
  } 
  else if (screen === "instructions") {
    if (isClicked(btns[2])) {
      screen = "start";
    }
  } 
  else if (screen === "lose") {
    if (isClicked(btns[3])) {
      screen = "start";
      lives = 4;
      score = 0;
      gifts = [];
    }
  }
}

// it checks if the mouse clicked a button
function isClicked(btn) {
  let xOverlap = mouseX > btn.x && mouseX < btn.x + btn.w;
  let yOverlap = mouseY > btn.y && mouseY < btn.y + btn.h;
  return xOverlap && yOverlap;
}

// it checks if 2 objects are touching
function checkCollision(a, b) {
  let xOverlap = a.x < b.x + b.w && a.x + a.w > b.x;
  let yOverlap = a.y < b.y + b.h && a.y + a.h > b.y;
  return xOverlap && yOverlap;
}
