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

function render(uptime){
    uptime *= 0.001; // time since 1st call - in seconds

    // clearing screen
	gl.clear(gl.COLOR_BUFFER_BIT);

    // map is drawn via triangle strips
    gl.drawElements(gl.GL_POINTS, mapNodes, gl.UNSIGNED_BYTE, 0);
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
    vec2 st = (2.0 * (gl_FragCoord.xy/u_resolution)) - 1.0;
    vec2 pos = gl_PointCoord.xy;

    float inHex = ceil( (-0.5 * pos.x) - pos.y + 1.25 );

    gl_FragColor = v_color*inHex;
    }`;

    // vertex shader code
    const vsGLSL = `
    attribute vec4 position;
    attribute vec4 color;

    varying vec4 v_color;

    uniform vec2 u_inc;

    void main() {
        gl_Position = position;
        gl_PointSize = 120.0;
        v_color = color;

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

    // creation of hexagonal space
    const outR = 1.0;
    const innR = Math.sqrt(3.0) / 2.0;

    const cnvHeight = new Float32Array([gl.canvas.height]);
    const cnvWidth = new Float32Array([gl.canvas.width]);


    const xnodes = 10.0;
    const ynodes = Math.ceil(cnvHeight / (innR * cnvWidth)) * (xnodes - 1.0);
    console.log(xnodes);
    console.log(ynodes);

    const xinc = 2.0 / (xnodes - 1.0);
    const yinc = (cnvWidth / cnvHeight) * xinc * innR;

    const hexGrid = [];
    var colors = [];

    // generating coordinates for hex mesh (+random colours for lulz)
    for (i = 0.0; i < ynodes; i++) {
        var skew = (i % 2.0)*0.5;

        for (j = 0.0; j < xnodes; j++) {
            // fix this to point to proper triangles
            hexGrid[2*j + 2*i*xnodes + 0] = -1.0 + (j+skew) * xinc;   // x coord of hex grid
            hexGrid[2*j + 2*i*xnodes + 1] = -1.0 + (i) * yinc;      // y coord of hex grid

            colors = colors.concat([255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255]);
        }
    }

    const indexArray = [1, 2, 3, 11, 12, 13, 20, 69];

    // generating indicies array for mesh
    // loop for edges

    

    mapNodes = indexArray.length;
    console.log(hexGrid);
    console.log(indexArray);
    console.log("mapNodes count: "+mapNodes);

    const vertexShader = createShader(gl.VERTEX_SHADER, vsGLSL);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsGLSL);

    const prg = gl.createProgram();

    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prg))
    };

    // NOTE! These are only here to unclutter the diagram.
    // It is safe to detach and delete shaders once
    // a program is linked though it is arguably not common.
    // and I usually don't do it.
    gl.detachShader(prg, vertexShader);
    gl.deleteShader(vertexShader);
    gl.detachShader(prg, fragmentShader);
    gl.deleteShader(fragmentShader);

    const positionLoc = gl.getAttribLocation(prg, 'position');
    const colorLoc = gl.getAttribLocation(prg, 'color');

    const resolutionLoc = gl.getUniformLocation(prg, 'u_resolution')
    const incrementsLoc = gl.getUniformLocation(prg, 'u_inc')


    // Buffer for vertex posiotions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexGrid), gl.STATIC_DRAW);

    // Buffer for colors
    const colorsU = new Uint8Array(colors);
    console.log("Array of colors in 8-byte depth:" + colorsU);
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colorsU, gl.STATIC_DRAW);


    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        positionLoc,
        2,            // 2 values per vertex shader iteration
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


    const indexArrayBYTE = new Uint8Array(indexArray);
    console.log(indexArrayBYTE);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArrayBYTE, gl.STATIC_DRAW);

    gl.useProgram(prg);

    gl.uniform2fv(resolutionLoc, [cnvWidth, cnvHeight]);
    gl.uniform2fv(incrementsLoc, [xinc/2.0, yinc/2.0]);


    renderLoop();
}