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

    attribute mat4 a_trans;
    attribute vec4 a_color;

    uniform mat4 u_camp;

    varying vec4 v_color;

    void main() {
        gl_Position = u_camp*a_trans*(a_position);
        v_color = a_color;
    }`;

// function to set geometry of hexagonal mesh
// declutter main()
function setGeometry(gl) {
    let tetra_mesh = new Float32Array(xyz_tetrahedron());
    console.log("xyzw tetrahedron mesh coords: ");
    console.log(tetra_mesh);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(tetra_mesh),
        gl.STATIC_DRAW);
}


let face_colors = [];
let border_colors = [];
function setColors(gl){
    
    for(let i=0; i<chainLength; i+=1){
            if(i%3){
                face_colors.push(45);
                face_colors.push(45);
                face_colors.push(45);
                face_colors.push(0);
                //White
            }else{
                face_colors.push(255);
                face_colors.push(0);
                face_colors.push(0);
                face_colors.push(0);
                //R
            }
            border_colors.push(0);
            border_colors.push(0);
            border_colors.push(0);
            border_colors.push(0);
            // Black
    
    }

    gl.bufferData(gl.ARRAY_BUFFER, 
                new Uint8Array(face_colors), 
                gl.STATIC_DRAW);
}



function setTrans(gl){
    // obtain xyz vectors of hexagonal prism spiral for translation purposes
    // for usage with instanced rendering objects
    console.log("Entering iniciatePolymerChain()")
    let polymerChain = iniciatePolymerChain();
    console.log("XYZ transformation vecors: ")
    console.log(polymerChain)
    // buffering data
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polymerChain), gl.DYNAMIC_DRAW);


}