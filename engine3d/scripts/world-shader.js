// fragment shader code
const fsGLSL = `
// fragment shader script
  precision highp float;

  varying vec4 v_color;
  
  void main() {
    gl_FragColor = v_color;
  }`;

// vertex shader code
const vsGLSL = `
    attribute vec4 a_position;

    attribute vec4 a_trans;
    attribute vec4 a_color;

    uniform mat4 u_camp;

    varying vec4 v_color;

    void main() {
        gl_Position = u_camp*(a_position+a_trans);
        v_color = a_color;
    }`;

// function to set geometry of hexagonal mesh
// declutter main()
function setGeometry(gl) {
    let cb_mesh = new Float32Array(cube_to_xyzwprism([0,0,0], 1.0, 1.0));
    console.log("xyzw hex mesh coords: ");
    console.log(cb_mesh);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(cb_mesh),
        gl.STATIC_DRAW);
}

function setColors(gl){
    let hex_colors = [];
    for(i = 0; i<12; i++){
        hex_colors.push(255);
        hex_colors.push(255);
        hex_colors.push(255);
        hex_colors.push(255);
    }//White

    for(i = 0; i<6; i++){
        hex_colors.push(255);
        hex_colors.push(0);
        hex_colors.push(0);
        hex_colors.push(255);
    } //R

    for(i = 0; i<6; i++){
        hex_colors.push(0);
        hex_colors.push(255);
        hex_colors.push(0);
        hex_colors.push(255);
    } //G

    for(i = 0; i<6; i++){
        hex_colors.push(0);
        hex_colors.push(0);
        hex_colors.push(255);
        hex_colors.push(255);
    } //B

    for(i = 0; i<6; i++){
        hex_colors.push(0);
        hex_colors.push(255);
        hex_colors.push(255);
        hex_colors.push(255);
    }//C

    for(i = 0; i<6; i++){
        hex_colors.push(255);
        hex_colors.push(0);
        hex_colors.push(255);
        hex_colors.push(255);
    }//M

    for(i = 0; i<6; i++){
        hex_colors.push(255);
        hex_colors.push(255);
        hex_colors.push(0);
        hex_colors.push(255);
    }//Y

    for(i = 0; i<12; i++){
        hex_colors.push(55);
        hex_colors.push(55);
        hex_colors.push(55);
        hex_colors.push(255);
    }//Gray

    gl.bufferData(gl.ARRAY_BUFFER, 
                new Uint8Array(hex_colors), 
                gl.STATIC_DRAW);

}

function setTrans(gl){
    // obtain xyz vectors of hexagonal prism spiral for translation purposes
    // for usage with instanced rendering objects
    let prismspiral = xyz_spiral_vect([5,-5,0], 150);
    console.log("XYZ transformation vecors: ")
    console.log(prismspiral)
    // buffering data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(prismspiral), gl.DYNAMIC_DRAW);


}