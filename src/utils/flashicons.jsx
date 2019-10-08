
export {load, unload, imgSwitch, flashIconOnLoad};

window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();

var canvas, gl,
    ratio,
    cw,
    ch,
    colorLoc,
    drawType,
    imgLoadedCount,
    numLines;
var target;
var id;
var isScroll;

var imageURLArr = [];
var snsNameArr = [];

var perspectiveMatrix;
var randomTargetXArr = [], randomTargetYArr = [];
var drawType = 0;
var onLoad;
var canvasId;

function flashIconOnLoad(callback){
    if(typeof(callback) === "function") {
        onLoad = callback;
    }
}

function initVaribles() {
    numLines = 100000;
    imgLoadedCount = 0;
    target = [];
    isScroll = false;
    imageURLArr = [
        "webgl/imgs/facebook.png",
        "webgl/imgs/google.png",
        "webgl/imgs/instgram.png",
        "webgl/imgs/pinterest.png",
        "webgl/imgs/twitter.png",
        "webgl/imgs/github.png",
    ]
    snsNameArr = ["Facebook", "Google+", "Instagram", "Pinterest", "Twitter", "GitHub"];
    randomTargetXArr = [];
    randomTargetYArr = [];
    drawType = 0;
    canvas = document.getElementById(canvasId);
    gl = canvas.getContext("experimental-webgl");
    cw = window.innerWidth;
    ch = window.innerHeight;
}



const load = function(i_canvasId) {
    canvasId = i_canvasId;
    // 初始化变量
    initVaribles();
    var tempCanvas = document.createElement("canvas");
    var ctx = tempCanvas.getContext('2d');

    for (var ii = 0; ii < imageURLArr.length; ii++) {
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageURLArr[ii];
        image.onload = onLoadImageHandler.bind(this, image, tempCanvas, ctx, ii);
    }
};



const unload = function () {

    window.cancelRequestAnimFrame(id);
    console.log(canvas);
    console.log(gl);
    // gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearRect(0, 0, canvas.width, canvas.height);    
}


function onLoadImageHandler(image, tempCanvas, ctx, number) {
    //console.log(image);
    var size = image.width;
    tempCanvas.width = size;
    tempCanvas.height = size;

    ctx.drawImage(image, 0, 0)
    var imageData = ctx.getImageData(0, 0, size, size);

    var data = imageData.data;

    // 之前遍历的图片，number就是第几张图
    target[number] = [];

    var density = 1;

    // 这是个Mask，搜索图片里所有的黑点，后面只打印黑点
    for (let index = 0; index < data.length; index += 4) {

        if (data[index] == 0) {
            var currentI = index / 4
            var currentX = currentI % size;
            var currentY = parseInt(currentI / size);

            if (data[index] == 0 && (currentX % density === 0 || currentY % density === 0)) {
                var pos = { x: currentX / size - .5, y: -currentY / size + 0.5 }
                target[number].push(pos);
            }
        }
    }
    imgLoadedCount ++;


    if (imgLoadedCount == imageURLArr.length) {

        loadScene();
    }
}

/**
 * Initialises WebGL and creates the 3D scene.
 * 只运行一次
 */
function loadScene() {

    if (!gl) {
        alert("There's no WebGL context available.");
        return;
    }

    canvas.width = cw;
    canvas.height = ch;
    gl.viewport(0, 0, canvas.width, canvas.height);

    var vertexShaderScript = document.getElementById("shader-vs");
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderScript.text);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert("Couldn't compile the vertex shader");
        gl.deleteShader(vertexShader);
        return;
    }

    var fragmentShaderScript = document.getElementById("shader-fs");
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderScript.text);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert("Couldn't compile the fragment shader");
        gl.deleteShader(fragmentShader);
        return;
    }

    gl.program = gl.createProgram();
    gl.attachShader(gl.program, vertexShader);
    gl.attachShader(gl.program, fragmentShader);
    gl.linkProgram(gl.program);
    if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
        alert("Unable to initialise shaders");
        gl.deleteProgram(gl.program);
        gl.deleteProgram(vertexShader);
        gl.deleteProgram(fragmentShader);
        return;
    }
    gl.useProgram(gl.program);
    var vertexPosition = gl.getAttribLocation(gl.program, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // ------------------

    setup();

    // vertices = new Float32Array(vertices);
    // randomTargetXArr = new Float32Array(randomTargetXArr);
    // randomTargetYArr = new Float32Array(randomTargetYArr);

    // ------------------

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    resetSize();
    window.cancelRequestAnimFrame(id);
    animate();

    if(typeof(onLoad) === "function") {
        onLoad();
    }

    // window.addEventListener("mousewheel", onScrollEventHandler);
    // window.addEventListener("DOMMouseScroll", onScrollEventHandler);

    window.addEventListener("resize", onResizeHandler);
    // window.addEventListener("click", onClickHandler);
}
// var count = 0;
// var cn = 0;

function resetSize() {

    var fieldOfView = 30.0;
    var aspectRatio = canvas.width / canvas.height;
    var nearPlane = 1.0;
    var farPlane = 10000.0;
    var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
    var bottom = -top;
    var right = top * aspectRatio;
    var left = -right;

    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = (farPlane + nearPlane) / (farPlane - nearPlane);
    var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
    var x = (2 * nearPlane) / (right - left);
    var y = (2 * nearPlane) / (top - bottom);
    perspectiveMatrix = [
        x, 0, a, 0,
        0, y, b, 0,
        0, 0, c, d,
        0, 0, -1, 0
    ];

    var modelViewMatrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    var vertexPosAttribLocation = gl.getAttribLocation(gl.program, "vertexPosition");
    gl.vertexAttribPointer(vertexPosAttribLocation, 3.0, gl.FLOAT, false, 0, 0);

    var uModelViewMatrix = gl.getUniformLocation(gl.program, "modelViewMatrix");
    var uPerspectiveMatrix = gl.getUniformLocation(gl.program, "perspectiveMatrix");
    gl.uniformMatrix4fv(uModelViewMatrix, false, new Float32Array(perspectiveMatrix));
    gl.uniformMatrix4fv(uPerspectiveMatrix, false, new Float32Array(modelViewMatrix));
}



// js trigger animate
function animate() {
    id = requestAnimationFrame(animate);
    drawScene();
}

function drawScene() {
    draw();

    gl.lineWidth(1);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, numLines);
    gl.flush();
}

// ===================================
var coefficient = .4;
var targetCoefficient = .01;

var vertices,
    velocities,
    freqArr,
    thetaArr,
    velThetaArr,
    velRadArr,
    boldRateArr;

// -------------------------------

function setup() {

    vertices = [];
    randomTargetXArr = [];
    randomTargetYArr = [];
    // -------------------------------


    for (var ii = 0; ii < numLines; ii++) {
        vertices.push(0, 0, 1.83);
        vertices.push(0, 0, 1.83);


        var randomPos = target[drawType][parseInt(target[drawType].length * Math.random())];
        randomTargetXArr.push(randomPos.x);
        randomTargetYArr.push(randomPos.y);
    }


    vertices = new Float32Array(vertices);
    randomTargetXArr = new Float32Array(randomTargetXArr);
    randomTargetYArr = new Float32Array(randomTargetYArr);

}

// -------------------------------

// -------------------------------

function draw() {
    // cn += .1;

    var i, n = vertices.length, p, bp;
    var px, py;
    // var pTheta;
    // var rad;
    var num;

    coefficient += (targetCoefficient - coefficient) * .1;


    for (i = 0; i < numLines * 2; i += 2) {
        // count += .3;
        bp = i * 3;
        // copy old positions

        vertices[bp] = vertices[bp + 3];
        vertices[bp + 1] = vertices[bp + 4];

        num = parseInt(i / 2);
        //pTheta = thetaArr[num];

        //rad = velRadArr[num];// + Math.cos(pTheta + i * freqArr[i]) *  boldRateArr[num];

        //pTheta = pTheta + velThetaArr[num];
        //thetaArr[num] = pTheta;
        //var pos = target[parseInt(target.length * Math.random())];
        var targetPosX = randomTargetXArr[num];
        var targetPosY = randomTargetYArr[num];
        //va
        px = vertices[bp + 3];
        px += (targetPosX - px) * coefficient + (Math.random() - .5) * coefficient;
        vertices[bp + 3] = px;


        py = vertices[bp + 4];
        py += (targetPosY - py) * coefficient + (Math.random() - .5) * coefficient;
        vertices[bp + 4] = py;
    }
}

// -------------------------------
function onResizeHandler(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    resetSize();

    // imgSwitch(drawType);
    
}

// window.addEventListener("keypress", function (event) {
//     if (event.charCode == 99) {
//         cancelRequestAnimFrame(id);
//     }
// });

function onScrollEventHandler(event) {
    if (isScroll) return;
    var delta = event.wheelDelta;

    isScroll = true;
    if (delta < 0) {
        drawType -= 1;
        if (drawType < 0) drawType += imageURLArr.length;

    } else {
        drawType = (drawType + 1) % imageURLArr.length;

    }

    imgSwitch(drawType);

    setTimeout(function () {
        isScroll = false;
    }, 600);
}
function onClickHandler() {

    if (isScroll) return;


    isScroll = true;
    drawType = (drawType + 1) % imageURLArr.length;

    imgSwitch(drawType);



    setTimeout(function () {
        isScroll = false;
    }, 600);
}

const imgSwitch = function(picNumber) {

    coefficient = .3;
    randomTargetXArr = [];
    randomTargetYArr = [];

    // -------------------------------

    for (var ii = 0; ii < numLines; ii++) {
        var randomPos = target[picNumber][parseInt(target[picNumber].length * Math.random())];
        randomTargetXArr.push(randomPos.x);
        randomTargetYArr.push(randomPos.y);
    }

    vertices = new Float32Array(vertices);
    randomTargetXArr = new Float32Array(randomTargetXArr);
    randomTargetYArr = new Float32Array(randomTargetYArr);

}