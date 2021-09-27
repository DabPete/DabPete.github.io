var gl;
var matrixLoc;
var uptime = 0.0; // time for which loop was on (in sec)

var grid_radius = 8.0;
var hex_count = ((3*grid_radius*grid_radius) + (3*grid_radius) + 1);
var verticies = hex_count*12;

function drawScene(now){
    now *= 0.001; // time since 1st call - in seconds

    // clearing screen
	gl.clear(gl.COLOR_BUFFER_BIT);

    // map is drawn via triangle strips
    // gl.drawElements(gl.TRIANGLES, 19, gl.UNSIGNED_BYTE, 0);
    gl.drawElements(gl.TRIANGLES, verticies, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(drawScene);
}

function renderLoop(){
    render();
    window.setTimeout(renderLoop, 10000.0/30.0);
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

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Creating shaders
    const vertexShader = createShader(gl.VERTEX_SHADER, vsGLSL);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsGLSL);
    // creating empty gl program
    const prg = gl.createProgram();
    // linking and compiling given shaders
    compileProgram(gl, prg, vertexShader, fragmentShader);
    

    const positionLoc = gl.getAttribLocation(prg, 'a_position');
    const colorLoc = gl.getAttribLocation(prg, 'a_color');
    matrixLoc = gl.getUniformLocation(prg, "u_matrix");

    // Buffer for vertex posiotions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    // Buffer for colors
    let colors = [];
    for(i=0;i<verticies*4;i++){
        colors.push(Math.floor(0.25* (i /verticies)*255));
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
        4,            // 2 values per vertex shader iteration
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

    
    var camera = m4.setCam([0, 1.732*3.0, 1.732*4.0], [-3, 0, -1*1.732]);
    var matrix = m4.perspective(Math.PI*0.5, 16.0/9.0,9.5*1.732, 1.5*1.732);
    // var matrix = m4.projection(16.0/9.0, 1.0, 1.0);
    matrix = m4.multiply(matrix, camera);
    // matrix = m4.xRotate(matrix, Math.PI*0.2);
    // matrix = m4.translate(matrix, 0, -1.732*3.0, -1.732*4.0);
    // matrix = m4.scale(matrix, 0.1, 0.1, 0.05, 1.0);
    // matrix = m4.translate(matrix, 4.0, 2.0, -1.5)
    console.log("Final transform matrix: ");
    console.log(matrix); 
    

    const indexArray2BYTE = new Uint16Array([...Array(verticies).keys()]);
    console.log("Element pointers: ");
    console.log(indexArray2BYTE);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray2BYTE, gl.STATIC_DRAW);

    gl.useProgram(prg);
    gl.enable(gl.DEPTH_TEST);
    // Set the matrix.
    gl.uniformMatrix4fv(matrixLoc, false, matrix);

    requestAnimationFrame(drawScene);
}