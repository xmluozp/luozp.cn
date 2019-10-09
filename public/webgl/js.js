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
    numLines = 100000;
var target = [];
var id;
var isScroll = false;

var imageURLArr = ["http://192.168.0.10:3000/webgl/imgs/me.png",
                    "http://192.168.0.10:3000/webgl/imgs/facebook.png",
                   "http://192.168.0.10:3000/webgl/imgs/google.png",
                   "http://192.168.0.10:3000/webgl/imgs/instgram.png",
                    "http://192.168.0.10:3000/webgl/imgs/pinterest.png",
                   "http://192.168.0.10:3000/webgl/imgs/twitter.png", 
                   "http://192.168.0.10:3000/webgl/imgs/github.png",

                   ]
var snsNameArr  = ["me","Facebook", "Google+", "Instagram", "Pinterest", "Twitter", "GitHub"];

var perspectiveMatrix
var randomTargetXArr = [], randomTargetYArr = [];
drawType = 0;
var count = 0;

window.onload = init();


function init() {
 
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');

//test
    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imageURLArr[1];


    for (var ii = 0; ii < imageURLArr.length; ii++) {
        var image = new Image();
      	image.crossOrigin = "Anonymous";
        image.src = imageURLArr[ii];

        image.onload = onLoadImageHandler.bind(this, image, canvas, ctx, ii);
    }
};

function onLoadImageHandler(image, canvas, ctx, number) {
    //console.log(image);

    var size = image.width;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(image, 0, 0)
    var imageData = ctx.getImageData(0, 0, size, size);

    var data = imageData.data;

    // 之前遍历的图片，number就是第几张图
    target[number] = [];

    // 遍历所有像素
    // for (var ii = 0; ii < data.length; ii += 4) { // 一次横着跳过+4。
        
    //     if (data[ii] == 0) { // 如果像素是黑色.比如第36个

    //         var pixNumber = ii / 4;
    //         var xPos = pixNumber % size; // size是总高宽，默认32。这里得出在新图里位于第几行.还在第一列
    //         var yPos = parseInt(pixNumber / size); // 在新图里的y，竖着跳过4
    //         var pos = {x: xPos / size - .5, y: -yPos / size + 0.5}; // 形成坐标. 后面的加减是坐标整体偏移值

    //         // 如果要跳过2呢？

    //         target[number].push(pos); // 形成一个数组，里面的对象格式 {x: int, y: int}
            
    //     }
    // }

    var density = 1;


    // 这是个Mask，搜索图片里所有的黑点，后面只打印黑点
    for (let index = 0; index < data.length; index += 4) {
        
        if( data[index] == 0) {
            var currentI = index / 4
            var currentX = currentI % size;
            var currentY = parseInt(currentI / size);
            
            if( data[index] == 0 && (currentX % density === 0 || currentY % density === 0) ) {
                var pos = {x: currentX / size - .5, y: -currentY / size + 0.5}
                target[number].push(pos);
            }    
        }
    }


    count++;


    if(count == imageURLArr.length){

        loadScene();
    }
}




/**
 * Initialises WebGL and creates the 3D scene.
 */
function loadScene() {
    canvas = document.getElementById("c");
    gl = canvas.getContext("experimental-webgl");


    if (!gl) {
        alert("There's no WebGL context available.");
        return;
    }

    cw = window.innerWidth;
    ch = window.innerHeight;
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
    gl.clearColor(0.5, 0.8, 0.1, 1.0);
    gl.clearDepth(1.0);

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // ------------------

    setup();

    // ------------------

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
    animate();

    window.addEventListener("mousewheel", onScrollEventHandler);
    window.addEventListener("DOMMouseScroll", onScrollEventHandler);

    window.addEventListener("resize", onResizeHandler);
}
var count = 0;
var cn = 0;

function animate() {

    id = requestAnimationFrame(animate);
    if(id%2 ===0)
    {
        drawScene();
    }
    
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
    cn += .1;

    var i, n = vertices.length, p, bp;
    var px, py;
    var pTheta;
    var rad;
    var num;

    coefficient += (targetCoefficient - coefficient) * .1;


    for (i = 0; i < numLines * 2; i += 2) {
        count += .3;
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


function onScrollEventHandler(event) {
    if(isScroll) return;
    var delta = event.wheelDelta;

    isScroll = true;
    if(delta < 0){
        drawType -= 1;
        if(drawType < 0) drawType += imageURLArr.length;

    }else{
       drawType = (drawType + 1) % imageURLArr.length;

     }

    onPicChange(drawType);

    setTimeout(function(){
        isScroll = false;
    }, 600);
}



function onResizeHandler(event){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    onPicChange(drawType);
    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.clearRect(0, 0, canvas.width, canvas.height)
}

window.addEventListener("keypress", function (event) {
    if (event.charCode == 99) {
        cancelRequestAnimFrame(id);
    }
});

window.addEventListener("click", function (event) {
if(isScroll) return;


    isScroll = true;
       drawType = (drawType + 1) % imageURLArr.length;

       onPicChange(drawType);



    setTimeout(function(){
        isScroll = false;
    }, 600);
});

function onPicChange(picNumber) {

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