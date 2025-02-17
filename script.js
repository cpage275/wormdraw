let canvas = document.getElementById("bigCanvas");
let ctx = canvas.getContext("2d");

// get buttons
let wormButton = document.getElementById("worm");
let dirtButton = document.getElementById("dirt");
let grassButton = document.getElementById("grass");

let currentPen = "worm"; // default to worm
wormButton.className = "active"; // set worm as active by default

// function to remove active class from all buttons
function clearActive() {
  wormButton.className = "";
  dirtButton.className = "";
  grassButton.className = "";
}

let grassImage = new Image();
grassImage.src = "assets/grass.png"; 


// event listeners for buttons
wormButton.addEventListener("click", function () {
  currentPen = "worm";
  clearActive();
  wormButton.className = "active";
});

dirtButton.addEventListener("click", function () {
  currentPen = "dirt";
  clearActive();
  dirtButton.className = "active";
});

grassButton.addEventListener("click", function () {
  currentPen = "grass";
  clearActive();
  grassButton.className = "active";
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// set background color
ctx.fillStyle = "#301903";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let lastX = null;
let lastY = null;
let size = 5; // starting size


function rand2() {
    return Math.random() - 0.5;
  }

  function distance(aX, aY, bX, bY) {
    return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
  }
  //stuff for smooth interpolation
  function pointsAlongLine(startx, starty, endx, endy, spacing) {
    let dist = distance(startx, starty, endx, endy);
    let steps = dist / spacing;
  
    let points = [];
    for (var d = 0; d <= 1; d += 1 / steps) {
      let point = {
        x: startx * d + endx * (1 - d),
        y: starty * d + endy * (1 - d),
      };
      points.push(point);
    }
    return points;
  }



function drawStart(event) {
  isDrawing = true;
  lastX = event.clientX;
  lastY = event.clientY;

  if (currentPen === "worm") {
    size = 5; // reset size when starting a new worm
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(lastX, lastY, size / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawMove(event) {
    if (isDrawing === false) {
        return;
      }

  let x = event.clientX;
  let y = event.clientY;

  if (currentPen === "worm") {
    size = Math.min(size + 1, 30); // gradually increase size to max 20

    ctx.strokeStyle = "pink";
    ctx.fillStyle = "pink";
    ctx.lineWidth = size;
    ctx.lineCap = "round";

    // draw connected segment
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
  } else if (currentPen === "dirt") {


    let thickness = 20;
    ctx.strokeStyle = "#6E4E31";
  
    ctx.lineWidth = thickness;
  
    let points = pointsAlongLine(x, y, lastX, lastY, 1);
  
    points.forEach((point) => {
      // draw cloud
  
      let d = distance(point.x, point.y, lastX, lastY);
      lastX = point.x;
      lastY = point.y;
      let size = 60;
      ctx.fillStyle = "#91725580";
  
      for (let i = 0; i < 10; i++) {
        ctx.fillRect(point.x + size * rand2(), point.y + size * rand2(), 1, 1); //rand2 lets me use another rand function for the grass 
      }
    });
  
    lastX = x;
    lastY = y;

  

  } else if (currentPen === "grass") {
    let thickness = 1;
    ctx.strokeStyle = "white";
    ctx.lineWidth = thickness;
    
  
    
   
      ctx.drawImage(
        grassImage, // Use the single grass image
        x + rand(44), 
        y + rand(44)
      );
    
    
    lastX = x;
    lastY = y;
  }
}

function rand(scale) {
    return (Math.random() - 0.5) * scale;
  }

function drawEnd(event) {
  isDrawing = false;

  if (currentPen === "worm") {
    // draw worm head at last point
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(lastX, lastY, size / 2, 0, 2 * Math.PI);
    ctx.fill();

    // draw eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(lastX - size * 0.5, lastY - size * 0.15, size * 0.35, 0, 2 * Math.PI);
    ctx.arc(lastX + size * 0.5, lastY - size * 0.15, size * 0.35, 0, 2 * Math.PI);
    ctx.fill();

    // draw pupils
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(lastX - size * 0.5, lastY - size * 0.15, size * 0.2, 0, 2 * Math.PI);
    ctx.arc(lastX + size * 0.5, lastY - size * 0.15, size * 0.2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// event listeners for drawing
canvas.addEventListener("pointerdown", drawStart);
canvas.addEventListener("pointerup", drawEnd);
canvas.addEventListener("pointerout", drawEnd);
canvas.addEventListener("pointermove", drawMove);