window.onload = init;

var winW, winH;
var ball, hole;
var Ballradius = 10;
var Holeradius = 20;
var mouseDownInsideball;
var touchDownInsideball;
var movementTimer;
var lastMouse, lastOrientation, lastTouch;
var randomPos = genPos();
var points = new Array();
var time = new Array();
var counter = 0;
var interval1;
var interval2;
var result = 0;

var position;
var levels = 10;
var Game = "Ball in hole";

var message = "";

// Initialisation on opening of the window
function init() {
   

    levels = 1;
    counter = 0;
    points = new Array();

    lastOrientation = {};
    window.addEventListener('resize', doLayout, false);
    document.body.addEventListener('mousemove', onMouseMove, false);
    document.body.addEventListener('mousedown', onMouseDown, false);
    document.body.addEventListener('mouseup', onMouseUp, false);
    document.body.addEventListener('touchmove', onTouchMove, false);
    document.body.addEventListener('touchstart', onTouchDown, false);
    document.body.addEventListener('touchend', onTouchUp, false);
    window.addEventListener('deviceorientation', deviceOrientationTest, false);
    lastMouse = {x: 0, y: 0};
    lastTouch = {x: 0, y: 0};
    mouseDownInsideball = false;
    touchDownInsideball = false;
    doLayout(document);
}


function deviceOrientationTest(event) {
    window.removeEventListener('deviceorientation', deviceOrientationTest);
    if (event.beta !== null && event.gamma !== null) {
        window.addEventListener('deviceorientation', onDeviceOrientationChange, false);
        movementTimer = setInterval(onRenderUpdate, 10);
    }
}


function doLayout(event) {
    winW = window.innerWidth;
    winH = window.innerHeight;
    var surface = document.getElementById('surface');
    surface.width = winW;
    surface.height = winH;
    ball = {radius: Ballradius,
        x: Ballradius + 100,
        y: winH / 2,
        color: 'white'};
    hole = {radius: Holeradius,
        x: Math.round(winW / randomPos),
        y: Math.round(winH / randomPos),
        color: 'red'};
    renderBallAndHole();
    start();
   
    var canvas = document.getElementById("surface");
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.font = "bold 10px Arial";
    context.fillText(message, 10, 100);


}

function renderBallAndHole() {
    var surface = document.getElementById('surface');
    var context = surface.getContext('2d');
    context.clearRect(0, 0, surface.width, surface.height);
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = ball.color;
    context.fill();
    context.strokeStyle = hole.color;
    context.stroke();
    renderHole(context);
}

function renderHole(context) {
    context.beginPath();
    context.arc(hole.x, hole.y, hole.radius, 0, 2 * Math.PI, false);
    context.fillStyle = hole.color;
    context.fill();
    context.strokeStyle = ball.color;
    context.stroke();
}

function onRenderUpdate(event) {
    var xDelta, yDelta;
    switch (window.orientation) {
        case 0: // portrait - normal
            xDelta = lastOrientation.gamma;
            yDelta = lastOrientation.beta;
            break;
        case 180: // portrait - upside down
            xDelta = lastOrientation.gamma * -1;
            yDelta = lastOrientation.beta * -1;
            break;
        case 90: // landscape - bottom right
            xDelta = lastOrientation.beta;
            yDelta = lastOrientation.gamma * -1;
            break;
        case -90: // landscape - bottom left
            xDelta = lastOrientation.beta * -1;
            yDelta = lastOrientation.gamma;
            break;
        default:
            xDelta = lastOrientation.gamma;
            yDelta = lastOrientation.beta;
    }
    moveBall(xDelta, yDelta);
}

function moveBall(xDelta, yDelta) {
    ball.x += xDelta;
    ball.y += yDelta;
    renderBallAndHole();
    if ((ball.x < (hole.x + (Holeradius / 2))) && (ball.x > (hole.x - (Holeradius / 2)))
            && (ball.y < (hole.y + (Holeradius / 2))) && (ball.y > (hole.y - (Holeradius / 2)))) {
        points.push(1);
        goal();
    }
    position = " X ( " + ball.x + " ) ; Y ( " + ball.y + " )";
    if (ball.x + Ballradius >= winW) {
        ball.x = winW - Ballradius;
    }
    if (ball.x - Ballradius <= 0) {
        ball.x = Ballradius;
    }
    if (ball.y - Ballradius <= 0) {
        ball.y = Ballradius;
    }
    if (ball.y + Ballradius >= winH) {
        ball.y = winH - Ballradius;
    }
    var canvas = document.getElementById("surface");
    var context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.font = "bold 15px Arial";
    context.fillText(Game, 10, 10);
    context.fillText("Time: " + result, 10, 290);
}

function start() {
    interval1 = setInterval(function chrono() {
        counter++;
        result = counter;
    }, 1000);
}


function goal() {
    var sec = 0;
    for (var i = 0; i < points.length; i++) {
        sec += points[i];
    }
    if (points.length === levels) {
        var canvas = document.getElementById("surface");
        var context = canvas.getContext("2d");
        message = "Gewonnen in"  + result + "s";
        alert(message);
        location.reload(true);
        //init();
    }
	
    hole.x = holePosition();
    hole.y = holePosition();
}
	
function holePosition(){
	return (Holeradius+10)+(Math.Random()*(winH+Holeradius+10)+1);
}
function genPos() {
    var res = Math.floor(Math.random() * 10) + 1;
    return res;
}

function onMouseMove(event) {
    if (mouseDownInsideball) {
        var xDelta, yDelta;
        xDelta = event.clientX - lastMouse.x;
        yDelta = event.clientY - lastMouse.y;
        moveBall(xDelta, yDelta);
        lastMouse.x = event.clientX;
        lastMouse.y = event.clientY;
    }
}

function onMouseDown(event) {
    var x = event.clientX;
    var y = event.clientY;
    if (x > ball.x - ball.radius &&
            x < ball.x + ball.radius &&
            y > ball.y - ball.radius &&
            y < ball.y + ball.radius) {
        mouseDownInsideball = true;
        lastMouse.x = x;
        lastMouse.y = y;
    } else {
        mouseDownInsideball = false;
    }
}

function onMouseUp(event) {
    mouseDownInsideball = false;
}

function onTouchMove(event) {
    event.preventDefault();
    if (touchDownInsideball) {
        var touches = event.changedTouches;
        var xav = 0;
        var yav = 0;
        for (var i = 0; i < touches.length; i++) {
            var x = touches[i].pageX;
            var y = touches[i].pageY;
            xav += x;
            yav += y;
        }
        xav /= touches.length;
        yav /= touches.length;
        var xDelta, yDelta;

        xDelta = xav - lastTouch.x;
        yDelta = yav - lastTouch.y;
        moveBall(xDelta, yDelta);
        lastTouch.x = xav;
        lastTouch.y = yav;
    }
}

function onTouchDown(event) {
    event.preventDefault();
    touchDownInsideball = false;
    var touches = event.changedTouches;
    for (var i = 0; i < touches.length && !touchDownInsideball; i++) {
        var x = touches[i].pageX;
        var y = touches[i].pageY;
        if (x > ball.x - ball.radius &&
                x < ball.x + ball.radius &&
                y > ball.y - ball.radius &&
                y < ball.y + ball.radius) {
            touchDownInsideball = true;
            lastTouch.x = x;
            lastTouch.y = y;
        }
    }
}

function onTouchUp(event) {
    touchDownInsideball = false;
}

function onDeviceOrientationChange(event) {
    lastOrientation.gamma = event.gamma;
    lastOrientation.beta = event.beta;
}