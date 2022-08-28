// ball class for all methods of ball
const initial_velocity = 0.025;
const velocity_inc = 0.0000001;
class Ball {
  constructor(ele, score) {
    this.ball = ele;
    this.score = score;

    this.reset();
  }
  get x() {
    return parseFloat(getComputedStyle(this.ball).getPropertyValue("--x"));
  }
  get y() {
    return parseFloat(getComputedStyle(this.ball).getPropertyValue("--y"));
  }
  set x(value) {
    this.ball.style.setProperty("--x", value);
  }
  set y(value) {
    this.ball.style.setProperty("--y", value);
  }
  rect() {
    return this.ball.getBoundingClientRect();
  }
  reset() {
    this.x = 93;
    this.y = 50;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = getRandombetweenRange(0, 2 * Math.PI);
      this.direction = { x: Math.sin(heading), y: Math.cos(heading) };
    }
    this.velocity = initial_velocity;
  }

  update(delay, paddle) {
    this.x += this.direction.x * this.velocity * delay;
    this.y += this.direction.y * this.velocity * delay;
    const pos = this.rect();
    this.velocity += velocity_inc * delay;

    if (pos.x <= 0.1 || pos.x >= window.innerWidth) {
      let newHeading = getRandombetweenRange(0, 2 * Math.PI);
      this.direction.y *= -1;
    }
    if (paddle.some((ele) => IsCollision(ele, pos))) {
      let newHeading = getRandombetweenRange(0, 2 * Math.PI);
      count++;
      this.direction.x *= -1;
      this.score.innerText = ` Score:${count}`;
    }
    // logic for check loose and reset
    if (pos.y <= 0) {
      let alertContent = this.scoreManage();
      count = 0;
      alert(alertContent);
      key = false;
      this.x = 3.3;
      this.y = 50;
      paddles.reset();
      this.score.innerText = ` Score:${count}`;
    } else if (pos.y >= window.innerHeight) {
      let content = this.scoreManage();
      count = 0;
      alert(content);
      key = false;

      this.reset();

      paddles.reset();
      this.score.innerText = ` Score:${count}`;
    }
  }
  // logic to manage score alert
  scoreManage() {
    let score =
      localStorage.getItem("Highestscore"); /*getting data from local strorage*/
    if (!score) {
      localStorage.setItem(
        "Highestscore",
        count
      ); /*stoaring data form local storage*/
      return `Your have set  ${count} point`;
    } else if (score) {
      if (count > score) {
        localStorage.setItem("Highestscore", count);
        return `Congratulation! You crossed the highest score:${score} and Your score is ${count}`;
      } else {
        return `Your score is ${count} `;
      }
    }
  }
}
// logic to get random number
function getRandombetweenRange(min, max) {
  return Math.random() * (max - min) + min;
}

// logic for collision detection
function IsCollision(rect1, rect2) {
  return (
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top &&
    rect1.left <= rect2.left &&
    rect1.right >= rect2.right
  );
}

// paddle class --section

class Paddles {
  constructor(paddle, r) {
    this.paddle = paddle;
    this.root = r;
  }
  get l() {
    return parseInt(getComputedStyle(this.root).getPropertyValue("--left"));
  }
  set l(value) {
    this.root.style.setProperty("--left", value);
  }
  rect() {
    return this.paddle[0].getBoundingClientRect();
  }
  reset() {
    this.l = 43;
  }
}
const ball = new Ball(
  document.getElementById("ball"),
  document.querySelector("#score_container")
);
const paddles = new Paddles(
  document.querySelectorAll(".paddle"),
  document.querySelector(":root")
);
// Animation section of ball
let last;
let count = 0;
// logic to show alert after each refresh
let scoreStart = localStorage.getItem("Highestscore");
if (scoreStart) {
  alert(`Welcome!Highest score of this game is ${scoreStart}`);
} else {
  alert("Hi! this is your first time.Press Ok and Enter key to play");
}

let key = false;
function update(time) {
  if (last != null && key) {
    const delay = time - last;
    ball.update(delay, [
      paddles.rect(),
      paddles.paddle[1].getBoundingClientRect(),
    ]);
  }
  last = time;
  // for smooth animation

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);

// Adding keydown event listener

window.addEventListener("keydown", handleKey);
function handleKey(e) {
  let x = paddles.rect().x;
  if (e.keyCode == 65 && x > 15) {
    paddles.l -= 8;
  } else if (e.keyCode == 68 && x < window.innerWidth - 200) {
    paddles.l += 8;
  } else if (e.keyCode == 13) {
    key = true;
  }
}
