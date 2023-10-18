'use strict'

// setting global values for camera, perspective
var camera;
var perspective;
var matrix;

var cameraPos;
var targetPos;

// universal function handler for shader creation
// declutter main()
function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    };
    gl.deleteShader(shader);
}

// function for shader program compiling - used to declutter main
function compileProgram(gl, prg, vertexShader, fragmentShader) {
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
}

// buffer setup, declutter of main()
function bufferSetup(){
        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Enabling depth buffer
        gl.enable(gl.DEPTH_TEST);
        // Enabling face culling
        gl.enable(gl.CULL_FACE);
        // Seting value of clear depth buffer
        gl.clearDepth(1.0);
        // Clear the specified buffers with specified clear values
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}