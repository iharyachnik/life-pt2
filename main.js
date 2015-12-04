"use strict";
var width = 480;
var height = 270;
var boardArr = matrixArray(height, width);
var nextStateArr = matrixArray(height, width);

init();

// computing

function init() {
    var canvas = document.getElementById("board");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);
        resizeCanvas();
        setStartState();
        changeState();
    }
}

function setStartState() {
    var startCount = getRandomInt(10000, 40000);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            boardArr[i][j] = 0;
        }
    }

    copyArrays(boardArr, nextStateArr);

    for (var i = 0; i < startCount; i++) {
        var x = getRandomInt(0, height - 1);
        var y = getRandomInt(0, width - 1);

        boardArr[x][y] = 1;
    }

    // start 2-state life formation
    // boardArr[0][3] = 1;
    // boardArr[1][1] = 1;
    // boardArr[1][3] = 1;
    // boardArr[2][2] = 1;
    // boardArr[2][3] = 1;

    paint(boardArr);
}

function changeState() {

    copyArrays(boardArr, nextStateArr);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var count = calculateNeighbours(i, j);
            if (count == 3 && boardArr[i][j] == 0) nextStateArr[i][j] = 1;
            else if ((count < 2 || count > 3) && boardArr[i][j] == 1) nextStateArr[i][j] = 0;
        }
    }
    copyArrays(nextStateArr, boardArr);
    paint(boardArr);
    setTimeout(changeState, 100);
}

function calculateNeighbours(x, y) {
    var neighbours = 0;
    var prevRow, prevCol, nextRow, nextCol;

    if (x - 1 < 0)
        prevRow = height - 1;
    else
        prevRow = x - 1;

    if (x + 1 == height)
        nextRow = 0;
    else
        nextRow = x + 1;

    if (y - 1 < 0)
        prevCol = width - 1;
    else
        prevCol = y - 1;

    if (y + 1 == width)
        nextCol = 0;
    else
        nextCol = y + 1;

    if (isALive(x, prevCol)) neighbours++;
    if (isALive(x, nextCol)) neighbours++;
    if (isALive(prevRow, prevCol)) neighbours++;
    if (isALive(prevRow, y)) neighbours++;
    if (isALive(prevRow, nextCol)) neighbours++;
    if (isALive(nextRow, prevCol)) neighbours++;
    if (isALive(nextRow, y)) neighbours++;
    if (isALive(nextRow, nextCol)) neighbours++;

    return neighbours;
}

function isALive(x, y) {
    return boardArr[x][y] == 1 ? 1 : 0;
}

function matrixArray(rows, columns) {
    var arr = new Array();
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array();
        for (var j = 0; j < columns; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function copyArrays(source, destination) {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            destination[i][j] = source[i][j];
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// painting

function resizeCanvas() {
    var canvas = document.getElementById('board');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paint(boardArr);
}

function paint(arr) {
    var canvas = document.getElementById('board');
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (boardArr[i][j] == 1)
                paintPixel(j, i);
        }

    }
}

function paintPixel(x, y) {
    var canvas = document.getElementById('board');
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(scale(x).w, scale(y).h, scale(1).w, scale(1).h);
    }
}

function scale(pix) {
    var canvas = document.getElementById('board');
    var scaleWidth = pix / width * canvas.width;
    var scaleHeight = pix / height * canvas.height
    return {
        w: scaleWidth,
        h: scaleHeight
    }
}
