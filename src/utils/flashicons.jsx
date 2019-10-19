window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();

var canvas, gl,
    standard_width,
    standard_height,
    drawType,
    imgLoadedCount,
    g_density,
    numLines;
var target;
var id;
const SHOW_UP_SPEED = .3;
const Z_DIMENSION = 1.3;

var imageURLArr = [];
var imageInfoArr = [];

var perspectiveMatrix;
var g_RandomTargetXArr = [], g_RandomTargetYArr = [];
var onLoad;
var loaded;
// var isResizing = false;
var canvasId;
// var animate_z_deviation = {};

function callBack(i_callback) {
    if (typeof (i_callback) === "function") {
        onLoad = i_callback;
    }
}

function initVaribles() {
    loaded = false;

    //-------blow are to calculate new pixcel number when switching
    g_density = 0.3;
    standard_width = 512;
    standard_height = 512;
    numLines = getNumLines(0);

    imgLoadedCount = 0;
    target = [];
    // isScroll = false;
    imageURLArr = [
        "images/icons/icons8-anonymous-mask-250.png",
        "images/icons/logo.png",
        "images/icons/hammer.png",
        "images/icons/light-bulb.png",
        "images/icons/contact.png",
        "images/icons/icons8-anonymous-mask-250.png",
        "images/icons/nav.png",
    ]
    imageInfoArr = [];
    g_RandomTargetXArr = [];
    g_RandomTargetYArr = [];
    // drawType = 0;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // ...then set the internal size to match

    gl = canvas.getContext("experimental-webgl");

    // gl = canvas.getContext("experimental-webgl", {alpha: false});

    // Make it visually fill the positioned parent
}


/**
 * loading all. pass images in the future
 * @param {} i_canvasId 
 * @param {*} defaultPicture 
 */
const load = function (i_canvasId, defaultPicture, init_w, init_h) {

    canvasId = i_canvasId;
    drawType = (defaultPicture && defaultPicture >= 0)? defaultPicture : 0;

    canvas = document.getElementById(canvasId);

    // prevent cpu calculation
    canvas.width = init_w;
    canvas.height = init_h;
    // canvas.width = canvas.offsetWidth;
    // canvas.height = canvas.offsetHeight;


    // 初始化变量
    initVaribles();
    var tempCanvas = document.createElement("canvas");
    var ctx = tempCanvas.getContext('2d', { alpha: false });

    for (var ii = 0; ii < imageURLArr.length; ii++) {
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageURLArr[ii];
        image.onload = onLoadImageHandler.bind(this, image, tempCanvas, ctx, ii);
    }
};

/**
 * 需要研究一下怎么清空
 */
const unload = function () {
    // window.cancelRequestAnimFrame(id);
    // gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearRect(0, 0, canvas.width, canvas.height);    
}

/**
 * process all images passed in
 * @param {} image 
 * @param {*} tempCanvas 
 * @param {*} ctx 
 * @param {*} number 
 */
function onLoadImageHandler(image, tempCanvas, ctx, number) {

    var size = image.width;
    tempCanvas.width = size;
    tempCanvas.height = size;

    ctx.drawImage(image, 0, 0)
    var imageData = ctx.getImageData(0, 0, size, size);

    var data = imageData.data;

    // 之前遍历的图片，number就是第几张图
    target[number] = [];

    // 保存高宽，后面switch的时候和standar比较，计算g_density用（小图就用比较少的点）
    imageInfoArr[number] = { width: image.width, height: image.height };

    var density = 1;

    // 这是个Mask，搜索图片里所有的黑点，后面只打印黑点
    for (let index = 0; index < data.length; index += 4) {

        if (data[index] === 0) {
            var currentI = index / 4
            var currentX = currentI % size;
            var currentY = parseInt(currentI / size);

            if (currentX % density === 0 || currentY % density === 0) {
                var pos = { x: currentX / size - .5, y: -currentY / size + 0.5 }
                target[number].push(pos);
            }
        }
    }
    imgLoadedCount++;


    if (imgLoadedCount === imageURLArr.length) {
        loadScene();
    }
}

/**
 * prepare to calculate lines.
 * @param {} w 
 * @param {*} h 
 */
const getNumLines = () => {

    var returnValue = standard_height * standard_width * 0.3; // standard number

    // if (imageInfoArr[picNumber]) {
    // 根据图片取精度
    // returnValue = returnValue * imageInfoArr[picNumber].width/ standard_height * g_density;

    // 根据指定的宽高决定精度
    returnValue = parseInt(returnValue * (canvas.width / standard_width) * g_density);
    // }

    return 100000 > returnValue ? returnValue : 100000;
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

    // ------------------
    // 下面animate里面已经有了不知道为何还要buff一次
    // gl.bufferData(gl.ARRAY_BUFFER, g_Vertices, gl.DYNAMIC_DRAW);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    setSize(canvas.width, canvas.height);
    window.cancelRequestAnimFrame(id);


    loaded = true;
    if (typeof (onLoad) === "function") {
        onLoad();
    }
    fadeIn();
    // window.addEventListener("mousemove", (e) => {
    //     var [bw, bh] = [document.body.clientWidth / 2, document.body.clientHeight / 2];
    //     animate_z_deviation = [((e.clientX - bw) / bw).toFixed(1), ((e.clientY - bh) / bw).toFixed(1)];
    // });
}

function setSize(w, h) {

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

let numLinesFade = 0;
/**
 * fade out
 */
const fadeOut = function () {
    if (loaded) {
        coefficient = .1;
        window.cancelRequestAnimFrame(id);
        numLinesFade = numLines;
        fadeOut_play();
    }
}
function fadeOut_play() {
    id = requestAnimationFrame(fadeOut_play);
    if (id % 2 === 0) {
        drawScene_fadeOut_play();
    }
}
/**
 * fade in
 */
const fadeIn = function () {
    if (loaded) {
        // coefficient = .3;
        window.cancelRequestAnimFrame(id);
        numLinesFade = 0;
        fadeIn_play();
    }
}
function fadeIn_play() {

    id = requestAnimationFrame(fadeIn_play);
    if (id % 2 === 0) {
        drawScene_fadeIn_play();
    }
}

function drawScene_fadeOut_play() {

    if (numLinesFade > 0) {
        numLinesFade -= SHOW_UP_SPEED * 1000;
        const printLines = numLinesFade > 0 ? numLinesFade : 0;

        draw();
        gl.lineWidth(1);
        gl.bufferData(gl.ARRAY_BUFFER, g_Vertices, gl.DYNAMIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, printLines);
        gl.flush();

    }
}
function drawScene_fadeIn_play() {

    if (numLinesFade < numLines) {
        numLinesFade += SHOW_UP_SPEED * 1000;
        const printLines = numLinesFade < numLines ? numLinesFade : numLines;

        draw();
        gl.lineWidth(1);
        gl.bufferData(gl.ARRAY_BUFFER, g_Vertices, gl.DYNAMIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.LINES, 0, printLines);
        gl.flush();
    }
    else {
        window.cancelRequestAnimFrame(id);
        id = requestAnimationFrame(animate);
    }
}
function drawScene() {

    draw();
    gl.lineWidth(1);
    gl.bufferData(gl.ARRAY_BUFFER, g_Vertices, gl.DYNAMIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, numLines);
    gl.flush();
}
// -------------------------------
// =================================================================================
// =================================================================================
// ==========================       main rendering    ==============================
// =================================================================================
// =================================================================================

var coefficient = .1;
var targetCoefficient = .01;

function draw() {
    // cn += .1;

    var bp, px, py, num, targetPosX, targetPosY;

    // coefficient 跳荡，无限趋近于targetCoefficient. 幅度取决于：初始值多大
    coefficient += (targetCoefficient - coefficient) * .1;

    // mouse deviation
    // animate_z_deviation = animate_z_deviation[1] ? animate_z_deviation : [0, 0];
    // var dx = - 1 * animate_z_deviation[0] / 100;
    // var dy = animate_z_deviation[1] / 100;

    const blur = coefficient /2 ;
    const movingSpeed = coefficient * 2;
    // blur = 0.001;

    const t_numOfLines = numLines * 2;

    // draw pixels

    for (let i = 0; i < t_numOfLines; i += 2) {

        num = parseInt(i / 2);
        bp = i * 3;

        g_Vertices[bp] = g_Vertices[bp + 3];
        g_Vertices[bp + 1] = g_Vertices[bp + 4];

        //var pos = target[parseInt(target.length * Math.random())];

        // 备份用，在此基础上随机。不记录随机状态，所以每一帧都会重新随机
        targetPosX = g_RandomTargetXArr[num];
        targetPosY = g_RandomTargetYArr[num];

        px = g_Vertices[bp + 3];
        // 前者是速度，后者是散布
        // cof等于tcof之前，都加速，等于的时候就不加速。所以加速度取决于这两个差
        px += (targetPosX - px) * movingSpeed + (Math.random() - .5) * blur;
        g_Vertices[bp + 3] = px;


        py = g_Vertices[bp + 4];
        py += (targetPosY - py) * movingSpeed + (Math.random() - .5) * blur;
        g_Vertices[bp + 4] = py;
    }
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
        // g_density = (parseInt((canvas.height / standard_width) * 10) / 10);
        // initilizeVertices();
        // resetVertices(drawType);
        // setSize(w, h);
        gl.viewport(0, 0, w, h);
    }
}
// ===================================


var g_Vertices;
    // velocities,
    // freqArr,
    // thetaArr,
    // velThetaArr,
    // velRadArr,
    // boldRateArr;

// -------------------------------

/**
 * first: set vertices
 */
function initilizeVertices() {

    var vertices = [];
    var randomTargetXArr = [];
    var randomTargetYArr = [];
    // -------------------------------
    numLines = getNumLines(drawType);

    // 强行循环n次，每次都从图片里任意x,t值上取一个点，处理以后存起来.这个点的信息只有x和y（之前自定义的对象）
    for (var ii = 0; ii < numLines; ii++) {
        vertices.push(0, 0, Z_DIMENSION, 0, 0, Z_DIMENSION);
        var randomPos = target[drawType][parseInt(target[drawType].length * Math.random())];
        randomTargetXArr.push(randomPos.x);
        randomTargetYArr.push(randomPos.y);
    }


    g_Vertices = new Float32Array(vertices);
    g_RandomTargetXArr = new Float32Array(randomTargetXArr);
    g_RandomTargetYArr = new Float32Array(randomTargetYArr);
}

/**
 * switch: set vertices
 */
function resetVertices() {

    try {
        var randomTargetXArr = [];
        var randomTargetYArr = [];

        // -------------------------------
        const newNumLines = getNumLines(drawType);
        const image = target[drawType];
        const imageLength = image.length;

        const gvLength = g_Vertices.length;
        const newVLength = newNumLines * 6;


        for (var ii = 0; ii < newNumLines; ii++) {
            var randomPos = image[parseInt(imageLength * Math.random())];
            randomTargetXArr.push(randomPos.x);
            randomTargetYArr.push(randomPos.y);
        }

        // vertices = new Float32Array(vertices);
        g_RandomTargetXArr = new Float32Array(randomTargetXArr);
        g_RandomTargetYArr = new Float32Array(randomTargetYArr);


        // 增加或者删除顶点数量。超过了就删掉多余的

        if (newVLength < gvLength) {
            g_Vertices = g_Vertices.subarray(0, newVLength);
            numLines = newNumLines;
        }

        if (newVLength > gvLength) {
            var tempVArray = new Float32Array(newNumLines * 6);

            for (let index = 0; index < gvLength; index++) {
                tempVArray[index] = g_Vertices[index];
            }
            for (let index = 0; index < newVLength; index += 6) {

                const targetIndex = index / 6;
                tempVArray[index] = g_RandomTargetXArr[targetIndex];
                tempVArray[index + 1] = g_RandomTargetYArr[targetIndex];
                tempVArray[index + 2] = Z_DIMENSION;
                tempVArray[index + 3] = g_RandomTargetXArr[targetIndex];
                tempVArray[index + 4] = g_RandomTargetYArr[targetIndex];
                tempVArray[index + 5] = Z_DIMENSION;
            }
            g_Vertices = tempVArray;
        }

        numLines = newNumLines;
    } catch (error) {
        console.error(error);
    }
}


// -------------------------------

const imgSwitch = function (picNumber, w, h, newCoefficient) {
    // console.log("switch icon to ", picNumber);
    coefficient = newCoefficient ? newCoefficient : .2;
    if (loaded) {

        // call it simple way to prevent cpu calculation
        if (w && h && (w !== canvas.width || h !== canvas.height)) {
            resize(w, h);
        }
        drawType = picNumber;
        resetVertices();
    }
}

export { load, unload, imgSwitch, callBack, resize, fadeOut, fadeIn };
