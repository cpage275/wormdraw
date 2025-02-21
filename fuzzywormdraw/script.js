let canvas = document.getElementById("bigCanvas");
let ctx = canvas.getContext("2d");

// Load fuzzy worm images
let wormImages = {
    pink: new Image(),
    green: new Image(),
    blue: new Image()
};

wormImages.pink.src = "assets/pinkfuzz.png";
wormImages.green.src = "assets/greenfuzz.png";
wormImages.blue.src = "assets/bluefuzz.png";

// Get buttons
let pinkWormButton = document.getElementById("pinkWorm");
let greenWormButton = document.getElementById("greenWorm");
let blueWormButton = document.getElementById("blueWorm");

// Set default pen
let currentPen = "pink"; 
pinkWormButton.className = "active"; 

// Function to remove active class
function clearActive() {
    pinkWormButton.className = "";
    greenWormButton.className = "";
    blueWormButton.className = "";
}

// Event listeners for worm pens
pinkWormButton.addEventListener("click", function () {
    currentPen = "pink";
    clearActive();
    pinkWormButton.className = "active";
});

greenWormButton.addEventListener("click", function () {
    currentPen = "green";
    clearActive();
    greenWormButton.className = "active";
});

blueWormButton.addEventListener("click", function () {
    currentPen = "blue";
    clearActive();
    blueWormButton.className = "active";
});

// Canvas setup
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "#301903";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let lastX = null;
let lastY = null;
let size = 5; // starting size
let wormPath = [];

// Utility functions
function rand2() {
    return Math.random() - 0.5;
}

function distance(aX, aY, bX, bY) {
    return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
}

function pointsAlongLine(startx, starty, endx, endy, spacing) {
    let dist = distance(startx, starty, endx, endy);
    let steps = dist / spacing;
  
    let points = [];
    for (let d = 0; d <= 1; d += 1 / steps) {
        let point = {
            x: startx * d + endx * (1 - d),
            y: starty * d + endy * (1 - d),
        };
        points.push(point);
    }
    return points;
}

// Start drawing
function drawStart(event) {
    isDrawing = true;
    lastX = event.clientX;
    lastY = event.clientY;
    size = 5;
    wormPath = [{ x: lastX, y: lastY, size }];
}

// Draw the worm
function drawMove(event) {
    if (!isDrawing) return;

    let x = event.clientX;
    let y = event.clientY;
    size = Math.min(size + 1, 30);

    let points = pointsAlongLine(lastX, lastY, x, y, 5);
    points.forEach((point) => {
        wormPath.push({ x: point.x, y: point.y, size });
    });

    drawWorm();
    
    lastX = x;
    lastY = y;
}

// Function to render the worm path with fuzz image
function drawWorm() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#301903";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let wormImage = wormImages[currentPen];

    wormPath.forEach((segment, index) => {
        let taperFactor = Math.max(0.2, index / wormPath.length);
        let segmentSize = segment.size * taperFactor;

        ctx.drawImage(wormImage, segment.x - segmentSize / 2, segment.y - segmentSize / 2, segmentSize, segmentSize);
    });
}

// End drawing: add eyes and a nose
function drawEnd(event) {
    isDrawing = false;

    if (wormPath.length > 0) {
        let head = wormPath[wormPath.length - 1];

        // Draw nose
        ctx.fillStyle = wormImages[currentPen];
        ctx.beginPath();
        ctx.ellipse(head.x, head.y + head.size * 0.6, head.size * 0.3, head.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(head.x - head.size * 0.3, head.y - head.size * 0.3, head.size * 0.3, 0, Math.PI * 2);
        ctx.arc(head.x + head.size * 0.3, head.y - head.size * 0.3, head.size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(head.x - head.size * 0.3, head.y - head.size * 0.3, head.size * 0.15, 0, Math.PI * 2);
        ctx.arc(head.x + head.size * 0.3, head.y - head.size * 0.3, head.size * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Event listeners
canvas.addEventListener("pointerdown", drawStart);
canvas.addEventListener("pointerup", drawEnd);
canvas.addEventListener("pointerout", drawEnd);
canvas.addEventListener("pointermove", drawMove);