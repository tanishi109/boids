import React from "react";
import Head from "next/head";

const MAX_SPEED = 7;
class Vars {
  constructor() {
    this.canvas;
    this.ctx;
    this.width;
    this.height;
    this.boids = [];
  }
}
const vars = new Vars();

const initStage = () => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const width = document.getElementById("wrapper").clientWidth;
  const height = document.getElementById("wrapper").clientHeight;

  vars.canvas = canvas;
  vars.ctx = ctx;
  vars.width = width;
  vars.height = height;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  Array.from(" ".repeat(10)).map((_, i) => {
    vars.boids.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      id: i,
    });
  });
};

const getDistance = function(b1, b2) {
  const x = b1.x - b2.x;
  const y = b1.y - b2.y;

  return Math.sqrt(x ** 2 + y ** 2);
};

const renderStage = () => {
  const {ctx, width, height, boids} = vars;
  ctx.clearRect(0, 0, width, height);

  const r = 5;
  boids.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, r, 0, 360 * Math.PI / 180);
    ctx.stroke();
  });

  boids.forEach((boid) => {
    // rule1
    const c = {x: 0, y:0};

    boids.forEach((b) => {
      if (b.id != boid.id) {
        c.x += b.x;
        c.y += b.y;
      }
    });

    c.x /= boids.length - 1;
    c.y /= boids.length - 1;
    boid.vx += (c.x - boid.x) / 100;
    boid.vy += (c.y - boid.y) / 100;

    // rule2
    boids.forEach((b) => {
      if (b.id !== boid.id) {
        const d = getDistance(b, boid);

        if (d < 5) {
          boid.vx -= b.x - boid.x;
          boid.vy -= b.y - boid.y;
        }
      }
    });

    // rule3
    const pv = {x: 0, y: 0};

    boids.forEach((b) => {
      if (b.id !== boid.id) {
        pv.x += b.vx;
        pv.y += b.vy;
      }
    });
    pv.x /= boids.length - 1;
    pv.y /= boids.length - 1;
    boid.vx += (pv.x - boid.vx) / 8;
    boid.vy += (pv.y - boid.vy) / 8;

    // limit speed
    const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);

    if (speed >= MAX_SPEED) {
        const r = MAX_SPEED / speed;

        boid.vx *= r;
        boid.vy *= r;
    }

    // check wall
    if (boid.x < 0 && boid.vx < 0 || boid.x > width && boid.vx > 0) boid.vx *= -1;
    if (boid.y < 0 && boid.vy < 0 || boid.y > height && boid.vy > 0) boid.vy *= -1;

    // update position
    boid.x += boid.vx;
    boid.y += boid.vy;
  });

  requestAnimationFrame(renderStage);
};

export default class extends React.Component {
  componentDidMount() {
    this.initDatGUI();

    initStage();
    renderStage();
  }

  initDatGUI() {
    const gui = new dat.GUI();
  }

  render() {
    return (
      <div id="wrapper" className="wrapper">
        {this.head()}
        <canvas id="stage" className="stage" />
        <style jsx>{`
          div {
            width: calc(100vw - 50px);
            height: 100vh;
            margin: 25px;
          }
          canvas {
            width: calc(100vw - 25px - 25px);
            height: calc(100vh - 25px - 25px);
            border: 1px solid #000;
            border-radius: 2px;
          }
        `}</style>
        <style jsx global>{`
          html,
          body {
            margin: 0;
            padding: 0;
          }
        `}</style>
      </div>
    );
  }

  head() {
    return (
      <Head>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js"></script>
      </Head>
    );
  }
}