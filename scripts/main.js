'use strict'

var gl;
var ext;
var matrixLoc;
var then = 0.0; // time for which loop was on (in sec)
var dt = 0.0;
var elapsed = 0.0;

var verticies = 6;
var tiles_rad = 5;
var tiles_cnt = 48;

var relaxation_node = 5;
const rotation_steps = 40;
let step = 0;
let dir = 1;


var dt;
function drawScene(now){
    now *= 0.001; // time since 1st call - in seconds
    dt = now - then;
    elapsed += dt;

    // polymerChainChange(now);
    polymerChainUpdate();
    
    if(elapsed > 1/rotation_steps && step < 40){
        console.log("relaxing")
        relaxBigLoop(relaxation_node, rotation_steps);
        step+=1;
        elapsed = 0;
    }
    if(step == 40){
        relaxation_node += 3*dir;
        step = 0;
    }
    if((relaxation_node > 48 || relaxation_node<3)&&step==0){
        dir *= -1;
        relaxation_node += 3*dir;
    }

    then = now;

    // clearing screen
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    

    camera = m4.setCam(m4.subtractVectors(focused_mer, [10.0*Math.sin(0), 0.0, -10.0*Math.cos(0)]), focused_mer);
    matrix = m4.multiply(perspective, camera);
    gl.uniformMatrix4fv(matrixLoc, false, matrix);
    
    ext.drawArraysInstancedANGLE(
        gl.TRIANGLE_STRIP,
        0,             // offset
        verticies,   // num vertices per instance
        chainLength //wrd_map.size,  // num instances
      );
    
    // drawBorders();
    /* ext.drawArraysInstancedANGLE(
	gl.LINE_STRIP,
        0,             // offset
        verticies + 3,   // num vertices per instance
        chainLength //wrd_map.size,  // num instances
      );
      */
      
    requestAnimationFrame(drawScene);
}

// Start here
function main() {

    // Obtain canvas on site
    const canvas = document.querySelector('#glCanvas');
    // Initialize the GL context
    gl = canvas.getContext('webgl');

    // If we don't have a GL context, give up now
    // Only continue if WebGL is available and working
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    ext = gl.getExtension('ANGLE_instanced_arrays');
    if (!ext) {
        return alert('need ANGLE_instanced_arrays');
    }

    // declutter attempt - refer shaders-util.js
    
    bufferSetup();
    gl.lineWidth(5);

    // Creating shaders
    const vertexShader = createShader(gl.VERTEX_SHADER, vsGLSL);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsGLSL);
    
    // creating empty gl program
    const prg = gl.createProgram();
    // linking and compiling given shaders
    compileProgram(gl, prg, vertexShader, fragmentShader);
    

    const positionLoc = gl.getAttribLocation(prg, 'a_position');
    const transLoc = gl.getAttribLocation(prg, 'a_trans');
    const colorLoc = gl.getAttribLocation(prg, 'a_color');
    matrixLoc = gl.getUniformLocation(prg, "u_camp");

    // Buffer for vertex posiotions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    // Buffer for transformation matricies

    const transBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, transBuffer);
    setTrans(gl);

    // Buffer for colors
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);
    

    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
        positionLoc,
        4,            // 4 values per vertex shader iteration
        gl.FLOAT,     // data is 32bit floats
        false,        // don't normalize
        0,            // stride (0 = auto)
        0,            // offset into buffer
    );

    gl.enableVertexAttribArray(transLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, transBuffer);
    for (let i = 0; i < 4; ++i) {
        const loc = transLoc + i;
        gl.enableVertexAttribArray(loc);
        // note the stride and offset
        const offset = i * 16;  // 4 floats per row, 4 bytes per float
        gl.vertexAttribPointer(
            loc,              // location
            4,                // size (num values to pull from buffer per iteration)
            gl.FLOAT,         // type of data in buffer
            false,            // normalize
            64,   // stride, num bytes to advance to get to next set of values
            offset,           // offset in buffer
        );
        // this line says this attribute only changes for each 1 instance
        ext.vertexAttribDivisorANGLE(loc, 1);
      }

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
    ext.vertexAttribDivisorANGLE(colorLoc, 1);

    let camera = m4.setCam([0, 16.0, 12.0], [0, 0, 0]);
    perspective = m4.perspective(Math.PI*0.5, 16.0/9.0, 150.0*1.732, 1.0*1.732);

    let matrix = m4.multiply(perspective, camera);

        // redundant code below - what it was even used for?
    /* 
    const indexArray2BYTE = new Uint16Array([...Array(verticies).keys()]);
    console.log("Element pointers: ");
    console.log(indexArray2BYTE);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray2BYTE, gl.STATIC_DRAW); */

    gl.useProgram(prg);
    gl.enable(gl.DEPTH_TEST);
    // Set the matrix.
    gl.uniformMatrix4fv(matrixLoc, false, matrix);
    
    registerBuffers(transBuffer, colorBuffer);
    setLoop(relaxation_node);
    requestAnimationFrame(drawScene);
}
