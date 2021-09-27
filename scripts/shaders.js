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

// function to set geometry of hexagonal mesh
// declutter main()
function setGeometry(gl) {
    let cb_mesh = new Float32Array(cube_xyzw_mesh(cube_spiral([0, 0, 0], grid_radius)));
    console.log("xyzw hex mesh coords: ");
    console.log(cb_mesh);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(cb_mesh),
        gl.STATIC_DRAW);
    cb_mesh = null;
}

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