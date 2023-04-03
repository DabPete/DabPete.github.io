const chainLength = 62;
const merData = new Float32Array(chainLength * 16);
const merRotation = new Float32Array(chainLength * 16);

const merBond = [1.0, 0.0, 0.0, 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 0.0, 0.0, 1.0, 0.0,
                 -0.577, 0.577, 0.577, 1.0];

// viewports for individual matricies
const precise_sqrt = 0.57735026919;
const precise_sqrt_vec3 = [-precise_sqrt, precise_sqrt, precise_sqrt]
let focused_mer;

let colorBuffer;
let transBuffer;

var merCoordVP = [];
var merRotatVP = [];

function registerBuffers(trans, color){
  colorBuffer = color;
  transBuffer = trans;
}

function iniciatePolymerChain(){
    merCoordVP.push(new Float32Array(
        merData.buffer, 0, 16));
    merRotatVP.push(new Float32Array(
        merRotation.buffer, 0, 16));
    
    merRotatVP[0] = m4.multiply(m4.rFastRotation(0.666667*Math.PI, precise_sqrt_vec3), m4.xRotation(0.5*Math.PI));
    merCoordVP[0] = m4.xRotate(m4.zRotate(m4.xRotate(m4.translation(0.0, 0.0, 0.0), 0.5*Math.PI), -0.75*Math.PI), -0.00*Math.PI); 

  for (let i = 1; i < chainLength; ++i) {
    const byteOffsetToMatrix = i * 16 * 4;
    const numFloatsForView = 16;
    merCoordVP.push(new Float32Array(
        merData.buffer,
        byteOffsetToMatrix,
        numFloatsForView));
    
    merRotatVP.push(new Float32Array(
        merRotation.buffer,
        byteOffsetToMatrix,
        numFloatsForView));
    
    merRotatVP[i] = merRotatVP[0];
    /*
    let start = 10;
    if(i < start + 15 && i > start ){
      if(i%3 == 0){
        merRotatVP[i] = m4.multiply(m4.rFastRotation(-2.09, [-0.577, 0.577, 0.577]), m4.xRotation(1.57080));
        // if(i%2){merRotatVP[i] = m4.multiply(m4.rFastRotation(0.0, [-0.577, 0.577, 0.577]), m4.xRotation(1.57080));}
      }
      if(i > start + 12){
        if(i%3){
          merRotatVP[i] = m4.multiply(m4.rFastRotation(0.0, [-0.577, 0.577, 0.577]), m4.xRotation(1.57080));
          // if(i%2){merRotatVP[i] = m4.multiply(m4.rFastRotation(-2.09, [-0.577, 0.577, 0.577]), m4.xRotation(1.57080));}
        }
      }
    }*/
    // merCoordVP[i] = m4.multiply(m4.multiply(m4.multiply(merCoordVP[i-1], merRotatVP[i-1]), merBond), merRotatVP[i]);
    merCoordVP[i] = m4.multiply(merCoordVP[i-1], m4.multiply(merBond, merRotatVP[i-1]));
  }

  focused_mer = m4.vec4_multiply([0.0, 0.0, 0.0, 1.0], merCoordVP[30]);
  console.log(focused_mer)

  console.log("Created translation mesh within iniciatePolymerChain(): ");
  console.log(merCoordVP);
  console.log(merRotatVP);
  console.log(merCoordVP.flat());

  

  return merCoordVP.flat();
}

function polymerChainChange(time){
  for (let i = 1; i < chainLength; ++i) {
    const byteOffsetToMatrix = i * 16 * 4;
    const numFloatsForView = 16;
    merCoordVP.push(new Float32Array(
        merData.buffer,
        byteOffsetToMatrix,
        numFloatsForView));
    
    merRotatVP.push(new Float32Array(
        merRotation.buffer,
        byteOffsetToMatrix,
        numFloatsForView));
    
    merRotatVP[i] = m4.multiply(m4.rFastRotation(Math.sin(1*time*i - 0.5)/(2*i - 1), [-precise_sqrt, precise_sqrt, precise_sqrt]), m4.xRotation(1.57080));
    // merCoordVP[i] = m4.multiply(m4.multiply(m4.multiply(merCoordVP[i-1], merRotatVP[i-1]), merBond), merRotatVP[i]);
    merCoordVP[i] = m4.multiply(merCoordVP[i-1], m4.multiply(merBond, merRotatVP[i-1]));
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(merCoordVP.flat()), gl.DYNAMIC_DRAW);
}

function polymerChainUpdate(){

  for (let i = 1; i < chainLength; ++i) {
    // merCoordVP[i] = m4.multiply(m4.multiply(m4.multiply(merCoordVP[i-1], merRotatVP[i-1]), merBond), merRotatVP[i]);
    merCoordVP[i] = m4.multiply(merCoordVP[i-1], m4.multiply(merBond, merRotatVP[i-1]));
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, transBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(merCoordVP.flat()), gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(face_colors), gl.DYNAMIC_DRAW);
}

function drawBorders(){
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(border_colors), gl.DYNAMIC_DRAW);
}

function doShit(aaa){
  merRotatVP[aaa] = m4.multiply(m4.rFastRotation(-0.333333*Math.PI, precise_sqrt_vec3), merRotatVP[aaa]);
}

function setLoop(n){
    for(i=0; i<3; i++){doShit(n); doShit(n+2); doShit(n+5); doShit(n+7);}
}

function relaxLoop(n, step){
  let d_rot = 1/step;
  merRotatVP[n + 0] = m4.multiply(m4.rFastRotation(-d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 0]);
  merRotatVP[n + 4] = m4.multiply(m4.rFastRotation( d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 4]);

  merRotatVP[n + 5] = m4.multiply(m4.rFastRotation(-d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 5]);
  merRotatVP[n + 9] = m4.multiply(m4.rFastRotation( d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 9]);
  
}

function relaxBigLoop(n, step){
  let d_rot = 1/step;
  merRotatVP[n + 0] = m4.multiply(m4.rFastRotation(-d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 0]);
  merRotatVP[n +10] = m4.multiply(m4.rFastRotation( d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n +10]);

  merRotatVP[n + 3] = m4.multiply(m4.rFastRotation( d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 3]);
  merRotatVP[n + 7] = m4.multiply(m4.rFastRotation(-d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 7]);

  merRotatVP[n + 2] = m4.multiply(m4.rFastRotation( d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 2]);
  merRotatVP[n + 8] = m4.multiply(m4.rFastRotation(-d_rot*Math.PI, precise_sqrt_vec3), merRotatVP[n + 8]);
  
  
}