export { load, unload, imgSwitch, callBack, resizeStart, resizeEnd, resize };

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
    // cw,
    // ch,
    original_width,
    original_height,
    colorLoc,
    drawType,
    imgLoadedCount,
    g_density,
    numLines;
var target;
var id;
var isScroll;
var SHOW_UP_SPEED = 0.2;

var imageURLArr = [];
var snsNameArr = [];

var perspectiveMatrix;
var g_RandomTargetXArr = [], g_RandomTargetYArr = [];
var drawType;
var onLoad;
var loaded;
var isResizing = false;
var canvasId;
var animate_z_deviation = {};

function callBack(i_callback) {
    if (typeof (i_callback) === "function") {
        onLoad = i_callback;
    }
}

function initVaribles() {
    loaded = false;
    g_density = 1;
    numLines = 0;
    imgLoadedCount = 0;
    target = [];
    isScroll = false;
    imageURLArr = [
        "webgl/imgs/me.png",
        "webgl/imgs/google.png",
        "webgl/imgs/instgram.png",
        "webgl/imgs/pinterest.png",
        "webgl/imgs/twitter.png",
        "webgl/imgs/github.png",
    ]
    snsNameArr = ["Facebook", "Google+", "Instagram", "Pinterest", "Twitter", "GitHub"];
    g_RandomTargetXArr = [];
    g_RandomTargetYArr = [];
    // drawType = 0;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // ...then set the internal size to match

    gl = canvas.getContext("experimental-webgl");

    // gl = canvas.getContext("experimental-webgl", {alpha: false});

    // Make it visually fill the positioned parent

    // cw = window.innerWidth;
    // ch = window.innerHeight;
}



const load = function (i_canvasId, defaultPicture) {
    canvasId = i_canvasId;
    drawType = defaultPicture;
    console.log(drawType);
    canvas = document.getElementById(canvasId);
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

    // gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearRect(0, 0, canvas.width, canvas.height);    
}


function onLoadImageHandler(image, tempCanvas, ctx, number) {
    //console.log(image);
    var size = image.width;
    tempCanvas.width = size;
    tempCanvas.height = size;

    original_width = size * 10;
    original_height = size * 10;

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
    imgLoadedCount++;


    if (imgLoadedCount == imageURLArr.length) {
        loadScene();
    }
}

const getNumLines = (w, h) => {
    // return canvas.width * canvas.height * g_density;
    return 50000;
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
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    numLines = getNumLines(canvas.width, canvas.height);
    // canvas.width = cw;
    // canvas.height = ch;
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

    initilizeVertices();

    // g_Vertices = new Float32Array(vertices);
    // randomTargetXArr = new Float32Array(randomTargetXArr);
    // randomTargetYArr = new Float32Array(randomTargetYArr);

    // ------------------
    // 下面animate里面已经有了不知道为何还要buff一次
    // gl.bufferData(gl.ARRAY_BUFFER, g_Vertices, gl.DYNAMIC_DRAW);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    resetSize(canvas.width, canvas.height);
    window.cancelRequestAnimFrame(id);
    animate();

    loaded = true;
    if (typeof (onLoad) === "function") {

        onLoad();
    }

    // window.addEventListener("mousewheel", onScrollEventHandler);
    // window.addEventListener("DOMMouseScroll", onScrollEventHandler);

    // window.addEventListener("resize", resize);

    // canvas.addEventListener("resize", resize);

    // var observer = new MutationObserver(resize);
    // observer.observe(canvas, {attributes: true});

    // window.addEventListener("click", onClickHandler);

    // document.body.clientHeight;


    window.addEventListener("mousemove", (e) => {
        // var [bw, bh] = [document.body.clientWidth / 2, document.body.clientHeight / 2];
        // animate_z_deviation = [((e.clientX - bw) / bw).toFixed(1), ((e.clientY - bh) / bw).toFixed(1)];
    });
}
// var count = 0;
// var cn = 0;

function resetSize(w, h) {

    numLines = getNumLines(w, h);

    var fieldOfView = 30.0;
    var aspectRatio = w / h;
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
    if (id % 2 === 0) {
        drawScene();
    }
}

function drawScene() {
    if (isResizing) { resize(); }
    draw();
    // gl.lineWidth(1);
    gl.bufferData(gl.ARRAY_BUFFER, g_Vertices, gl.DYNAMIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, numLines);
    gl.flush();
}
// -------------------------------
var coefficient = .4;
var targetCoefficient = .01;

function draw() {
    // cn += .1;

    var i, bp, px, py, num, tempdensity, blur;

    // coefficient 跳荡，无限趋近于targetCoefficient. 幅度取决于：初始值多大
    coefficient += (targetCoefficient - coefficient) * .1;

    // prepare for density
    if (g_density > 1 || g_density < 0) tempdensity = 1;
    else tempdensity = g_density;

    // mouse deviation
    animate_z_deviation = animate_z_deviation[1] ? animate_z_deviation : [0, 0];
    var dx = - 1 * animate_z_deviation[0] / 100;
    var dy = animate_z_deviation[1] / 100;

    blur = coefficient * 0.6;

    // draw pixels
    for (i = 0; i < numLines * 2; i += 2) {

        num = parseInt(i / 2);
        bp = i * 3;

        if (num % 5 < parseInt(5 * tempdensity)) {
            // copy old positions
            g_Vertices[bp + 2] = 1.23;
            g_Vertices[bp + 5] = 1.23;
        }
        else // 不绘制的部分隐藏到画面外
        {
            g_Vertices[bp + 2] = 0;
            g_Vertices[bp + 5] = 0;
        }

        g_Vertices[bp] = g_Vertices[bp + 3] + dx;
        g_Vertices[bp + 1] = g_Vertices[bp + 4] + dy;

        //var pos = target[parseInt(target.length * Math.random())];

        // 备份用，在此基础上随机。不记录随机状态，所以每一帧都会重新随机
        var targetPosX = g_RandomTargetXArr[num] - dx;
        var targetPosY = g_RandomTargetYArr[num] - dy;

        px = g_Vertices[bp + 3];

        // 前者是速度，后者是散布
        // cof等于tcof之前，都加速，等于的时候就不加速。所以加速度取决于这两个差
        px += (targetPosX - px) * coefficient + (Math.random() - .5) * blur;
        g_Vertices[bp + 3] = px;


        py = g_Vertices[bp + 4];
        py += (targetPosY - py) * coefficient + (Math.random() - .5) * blur;
        g_Vertices[bp + 4] = py;


    }

}


const resizeStart = () => {
    isResizing = true;
}

const resizeEnd = () => {
    isResizing = false;
    g_density = (parseInt((canvas.height / original_width) * 10) / 10);
}
// -------------------------------
const resize = (w, h) => {

    if (loaded) {

        if (!(w || h)) {
            w = canvas.offsetWidth;
            h = canvas.offsetHeight;
        }

        canvas.width = w;
        canvas.height = h;

        // initilizeVertices();
        // resetVertices();
        // resetSize(w, h);
        gl.viewport(0, 0, w, h);
    }
}
// ===================================


var g_Vertices,
    velocities,
    freqArr,
    thetaArr,
    velThetaArr,
    velRadArr,
    boldRateArr;

// -------------------------------

function initilizeVertices() {

    var vertices = [];
    var randomTargetXArr = [];
    var randomTargetYArr = [];
    // -------------------------------


    for (var ii = 0; ii < numLines; ii++) {
        vertices.push(0, 0, 1.23, 0, 0, 1.23);
        var randomPos = target[drawType][parseInt(target[drawType].length * Math.random())];
        randomTargetXArr.push(randomPos.x);
        randomTargetYArr.push(randomPos.y);
    }


    g_Vertices = new Float32Array(vertices);
    g_RandomTargetXArr = new Float32Array(randomTargetXArr);
    g_RandomTargetYArr = new Float32Array(randomTargetYArr);
}

function resetVertices() {

    // coefficient = .3;
    var randomTargetXArr = [];
    var randomTargetYArr = [];

    // -------------------------------

    for (var ii = 0; ii < numLines; ii++) {
        var randomPos = target[drawType][parseInt(target[drawType].length * Math.random())];
        randomTargetXArr.push(randomPos.x);
        randomTargetYArr.push(randomPos.y);
    }

    // vertices = new Float32Array(vertices);
    g_RandomTargetXArr = new Float32Array(randomTargetXArr);
    g_RandomTargetYArr = new Float32Array(randomTargetYArr);
}


// -------------------------------



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

const imgSwitch = function (picNumber) {

    if (loaded) {

        coefficient = .3;
        var randomTargetXArr = [];
        var randomTargetYArr = [];

        // -------------------------------

        for (var ii = 0; ii < numLines; ii++) {
            var randomPos = target[picNumber][parseInt(target[picNumber].length * Math.random())];
            randomTargetXArr.push(randomPos.x);
            randomTargetYArr.push(randomPos.y);
        }

        // vertices = new Float32Array(vertices);
        g_RandomTargetXArr = new Float32Array(randomTargetXArr);
        g_RandomTargetYArr = new Float32Array(randomTargetYArr);
    }
}