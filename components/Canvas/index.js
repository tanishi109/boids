import React from "react";
import Head from "next/head";

const renderStage = () => {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const width = document.getElementById("wrapper").clientWidth;
  const height = document.getElementById("wrapper").clientHeight;

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  ctx.clearRect(0, 0, width, height);

  const arcs = [
    [100, 100],
  ];

  const r = 5;
  arcs.forEach((arc) => {
    ctx.beginPath();
    ctx.arc(...arc, r, 0, 360 * Math.PI / 180);
    ctx.stroke();
  });
};

export default class extends React.Component {
  componentDidMount() {
    this.initDatGUI();

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