let devui_cnvs = document.getElementById("glCanvas");
let devui_div = document.createElement('div');
let devui_el = String(`<ul class="dev-settings">
<li>
<div class="devui-width">
  <label for="devui-width">Window width:  </label>
  <input type="number" name="devui-width" id="devui-width" value="1920" required>
</div>
<div class="devui-height">
  <label for="devui-height">Window height: </label>
  <input type="number" name="devui-height" id="devui-height" value="1080" required>
</div>
<div>
  <label for="camPosX">Cam. X:</label>
  <input type="range" id="camPosX" name="camPosX"
         min="-15" max="15" step="0.2" min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="camPosY">Cam. Y:</label>
  <input type="range" id="camPosY" name="camPosY"
         min="-15" max="15" step="0.2" min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="camPosZ">Cam. Z:</label>
  <input type="range" id="camPosZ" name="camPosZ"
         min="-15" max="15" step="0.2" min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
</li><li>
<div>
  <label for="maxRender">max dist:</label>
  <input type="range" id="maxRender" name="maxRender"
         min="-15" max="15" step="0.2" min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
  <label for="minRender">min dist:</label>
  <input type="range" id="minRender" name="minRender"
         min="-15" max="15" step="0.2" min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="targetPosX">target X:</label>
  <input type="range" id="targetPosX" name="targetPosX"
         min="-15" max="15" step="0.2" min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="targetPosY">target Y:</label>
  <input type="range" id="targetPosY" name="targetPosY"
         min="-15" max="15" step="0.2" min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="targetPosZ">target Z:</label>
  <input type="range" id="targetPosZ" name="targetPosZ"
         min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
</li></ul>
`);
devui_cnvs.after(devui_div);
devui_div.insertAdjacentHTML('beforeend', devui_el);

const devui_list = document.querySelector(".dev-settings");

const camX = document.getElementById("camPosX");
const camY = document.getElementById("camPosY");
const camZ = document.getElementById("camPosZ");

const tarX = document.getElementById("targetPosX");
const tarY = document.getElementById("targetPosY");
const tarZ = document.getElementById("targetPosZ");

devui_list.addEventListener('click', updateMatrix);

function updateMatrix(){
  var camera = m4.setCam([camX.value, camY.value, camZ.value], [tarX.value, tarY.value, tarZ.value]);
  console.log("Calculated setCam: ");
  console.log(camera);

  var matrix = m4.perspective(Math.PI*0.5, 16.0/9.0,9.5*1.732, 1.5*1.732);
  // var matrix = m4.projection(16.0/9.0, 1.0, 1.0);
  matrix = m4.multiply(matrix, camera);
  console.log("Calculated matrix: ");
  console.log(matrix);

  gl.uniformMatrix4fv(matrixLoc, false, matrix);
}