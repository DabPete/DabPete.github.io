var gl;
var uptime = 0.0; // time for which loop was on (in sec)

var mapNodes;

function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    };
    gl.deleteShader(shader);
}

function setGeometry(gl) {
    let cb_mesh = new Float32Array(cube_mesh(cube_spiral( [0,0,0], 1 ) ));
    console.log("xyz hex mesh coords: ");
    console.log(cb_mesh);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(cb_mesh),
        gl.STATIC_DRAW);
  }

function render(uptime){
    uptime *= 0.001; // time since 1st call - in seconds

    // clearing screen
	gl.clear(gl.COLOR_BUFFER_BIT);

    // map is drawn via triangle strips
    // gl.drawElements(gl.TRIANGLES, 19, gl.UNSIGNED_BYTE, 0);
    gl.drawElements(gl.TRIANGLES, 84, gl.UNSIGNED_BYTE, 0);
}

function renderLoop(){
    render();
    window.setTimeout(renderLoop, 100000.0/60.0);
}

//
// Start here
//
function main() {

    const canvas = document.querySelector('#glCanvas');
    // Initialize the GL context

    gl = canvas.getContext('webgl');

    // fragment shader code
    const fsGLSL = `
    // fragment shader script
  precision highp float;

  varying vec4 v_color;

  uniform vec2 u_resolution;
  uniform vec2 u_inc;
  
  void main() {
    gl_FragColor = v_color;
  }`;

    // vertex shader code
    const vsGLSL = `
    attribute vec4 a_position;
    attribute vec4 a_color;

    uniform mat4 u_matrix;

    varying vec4 v_color;

    void main() {
        gl_Position = u_matrix*a_position;
        v_color = a_color;
    }`;

    // If we don't have a GL context, give up now
    // Only continue if WebGL is available and working

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = createShader(gl.VERTEX_SHADER, vsGLSL);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsGLSL);

    const prg = gl.createProgram();

    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prg))
    };

    // It is safe to detach and delete shaders once program is linked and compiled
    gl.detachShader(prg, vertexShader);
    gl.deleteShader(vertexShader);
    gl.detachShader(prg, fragmentShader);
    gl.deleteShader(fragmentShader);

    const positionLoc = gl.getAttribLocation(prg, 'a_position');
    const colorLoc = gl.getAttribLocation(prg, 'a_color');
    const matrixLocation = gl.getUniformLocation(prg, "u_matrix");

    // Buffer for vertex posiotions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    // Buffer for colors
    let colors = [];
    for(i=0;i<336;i++){
        colors.push(Math.floor(Math.random()*255));
    }
    const colorsU = new Uint8Array(colors);
    console.log("U8Byte colors: ");
    console.log(colorsU);
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colorsU, gl.STATIC_DRAW);


    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        positionLoc,
        3,            // 2 values per vertex shader iteration
        gl.FLOAT,     // data is 32bit floats
        false,        // don't normalize
        0,            // stride (0 = auto)
        0,            // offset into buffer
    );


    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(
        colorLoc,
        4,                // 4 values per vertex shader iteration
        gl.UNSIGNED_BYTE, // data is 8bit unsigned bytes
        true,             // do normalize
        0,                // stride (0 = auto)
        0,                // offset into buffer
    );

    var matrix = m4.projection(64.0/9.0, 4.0, 16.0);
    matrix = m4.xRotate(matrix, 0.5);
    // matrix = m4.translate(matrix, 4.0, 2.0, -1.5)
    
    

    const indexArrayBYTE = new Uint8Array([...Array(84).keys()]);
    console.log("Element pointers: ");
    console.log(indexArrayBYTE);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArrayBYTE, gl.STATIC_DRAW);

    gl.useProgram(prg);
    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    renderLoop();
}