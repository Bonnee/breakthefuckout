var ball;
var ballSpdX = 0;
var ballSpdY = -4;
var pad;
var AKey = keyboard(65);
var DKey = keyboard(68);
var running = true;

var movePadDefault = 10;
var movePadIncreaser = 1.2;  //set the pixel increase every time the pad is moving. giving the pad acceleration while key that move pad is pressed
var movePad = movePadDefault;

var aPressed = false;
var dPressed = false;

var width = 919, height = 768;

/*  JSON Test  */
var lev1 = '{"blocks":[' +
'{"x":"0","y":"400","width":"45","height":"23","color":"red"},' +
'{"x":"46","y":"400","width":"45","height":"23","color":"red"},' +
'{"x":"92","y":"400","width":"45","height":"23","color":"red"}]}';

var bricks;

function init() {
    console.log("game.js loaded");
    stage = new PIXI.Stage(0x66FF99);
    renderer = PIXI.autoDetectRenderer(
      width,
      height,
      { view: document.getElementById("game-canvas") }
      , true  //antialiasing set to true
    );
    bricks=JSON.parse(lev1);

    var i,l;
    for (i = 0, l = bricks.blocks.length; i < l; i++)
    {
        var wbTexture = PIXI.Texture.fromImage("../images/" + bricks.blocks[i].color + ".png");
        wb = new PIXI.Sprite(wbTexture);
        wb.position.x = bricks.blocks[i].x;
        wb.position.y = bricks.blocks[i].y;
        stage.addChild(wb);
    }


/*var deltaX = 46;
var deltaY = 24;
for (var y = 0; y < 7; y++) {
    for (var x = 0; x < 20; x++) {
        var color;
        switch (y) {
            case 0:
                color = "../images/violet.png";
                break;
            case 1:
                color = "../images/indigo.png";
                break;
            case 2:
                color = "../images/blue.png";
                break;
            case 3:
                color = "../images/green.png";
                break;
            case 4:
                color = "../images/yellow.png";
                break;
            case 5:
                color = "../images/orange.png";
                break;
            case 6:
                color = "../images/red.png";
                break;
        }
        var wbTexture = PIXI.Texture.fromImage(color);
        wb = new PIXI.Sprite(wbTexture);
        wb.position.x = x * deltaX;
        console.log(y * deltaY);
        wb.position.y = y * deltaY + 100;
        stage.addChild(wb);
    }
}*/


var ballTexture = PIXI.Texture.fromImage("../images/ball.png");
ball = new PIXI.Sprite(ballTexture);
ball.position.x = 10;//width / 2;
ball.position.y = 700//height / 2;
stage.addChild(ball);

//create pad
var padTexture = PIXI.Texture.fromImage("../images/pad.png");
pad = new PIXI.Sprite(padTexture);
pad.position.x = width / 2;
pad.position.y = height - 23;
stage.addChild(pad);

requestAnimationFrame(update);
}

AKey.press = function () {
    //key object pressed
    aPressed = true;
};
AKey.release = function () {
    //key object released
    aPressed = false;
    movePad = movePadDefault;
};

DKey.press = function () {
    //key object pressed
    dPressed = true;
};
DKey.release = function () {
    //key object released
    dPressed = false;
    movePad = movePadDefault;
};

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
}

function update() {

    CheckCollisions();

    if (aPressed) {
        if (pad.position.x - movePad > 0) {
            pad.position.x -= movePad;
            movePad += movePadIncreaser;
        } else
            pad.position.x = 0;
    }
    if (dPressed) {
        if (pad.position.x + movePad < width - pad.width) {
            pad.position.x += movePad;
            movePad += movePadIncreaser;
        }
        else
            pad.position.x = width - pad.width;
    }

    renderer.render(stage);
    if (running)
        requestAnimationFrame(update);
}

function CheckCollisions() {

    if (ballSpdY > 0 && ball.position.y + ball.height >= pad.position.y && (ball.position.x + ball.width > pad.position.x && ball.position.x < pad.position.x + pad.width))
        ballSpdY = -ballSpdY;

    if ((ball.position.x + ballSpdX) > 0 && (ball.position.x + ballSpdX) < (width - ball.width)) {
        ball.position.x += ballSpdX;
    }
    else {
        ballSpdX = -ballSpdX;
    }
    if (ball.position.y + ballSpdY > 0)
        ball.position.y += ballSpdY;
    else
        ballSpdY = -ballSpdY;

    if (ball.position.y + ballSpdY >= height - ball.height) {
        ball.position.y = height - ball.height;
        running = false;
    }

    var i, b, l;
    for (i = 0, l = bricks.blocks.length; i < l; i++) {
        b = bricks.blocks[i];
        console.log(b.height);
        if ((ball.position.y <= b.y + b.height && ball.position.y + ball.height >= b.y) && (ball.position.x <= b.x + b.width && ball.position.x + ball.width >= b.x));
            console.log("Collision with block " + i);
    }

    function refr() {
        renderer.render(stage);
    }
}