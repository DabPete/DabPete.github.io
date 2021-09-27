let devui_cnvs = document.getElementById("glCanvas");
let devui_div = document.createElement('div');
let devui_el = String(`<ul class="dev-settings">
<li>
<div class="devui-width">
  <label for="devui-width">Window width:  </label>
  <input type="number" name="devui-width" id="devui-width" value="1280" required>
</div>
<div class="devui-height">
  <label for="devui-height">Window height: </label>
  <input type="number" name="devui-height" id="devui-height" value="720" required>
</div>
<div>
  <label for="camPosX">Cam. X:</label>
  <input type="range" id="camPosX" name="camPosX"
         min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="camPosY">Cam. Y:</label>
  <input type="range" id="camPosY" name="camPosY"
         min="-15" max="15" step="0.2" value="4" oninput="this.nextElementSibling.value = this.value">
         <output>4</output>
</div>
<div>
  <label for="camPosZ">Cam. Z:</label>
  <input type="range" id="camPosZ" name="camPosZ"
         min="-15" max="15" step="0.2" value="3" oninput="this.nextElementSibling.value = this.value">
         <output>3</output>
</div>
</li><li>
<div>
  <label for="maxRender">max dist:</label>
  <input type="range" id="maxRender" name="maxRender"
         min="1.732" max="34.64" step="1.732" value="17.32" oninput="this.nextElementSibling.value = this.value">
         <output>17.32</output>
</div>
  <label for="minRender">min dist:</label>
  <input type="range" id="minRender" name="minRender"
         min="1.732" max="17.32" step="1.732" value="1.732" oninput="this.nextElementSibling.value = this.value">
         <output>1.732</output>
</div>
<div>
  <label for="targetPosX">target X:</label>
  <input type="range" id="targetPosX" name="targetPosX"
         min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="targetPosY">target Y:</label>
  <input type="range" id="targetPosY" name="targetPosY"
         min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
<div>
  <label for="targetPosZ">target Z:</label>
  <input type="range" id="targetPosZ" name="targetPosZ"
         min="-15" max="15" step="0.2" oninput="this.nextElementSibling.value = this.value">
         <output>0</output>
</div>
</li><li>
<div class="radius">
  <label for="radius">Mesh radius:</label>
  <input type="range" id="radius" name="radius"
         min="1" max="25" step="1" value="8" oninput="this.nextElementSibling.value = this.value">
         <output>8</output>
</div>
<div class="radius">
  <label for="radius">Cam. Z:</label>
  <input type="range" id="radius" name="radius"
         min="1" max="25" step="1" value="8" oninput="this.nextElementSibling.value = this.value">
         <output>8</output>
</div>
</li></ul>
`);
devui_cnvs.after(devui_div);
devui_div.insertAdjacentHTML('beforeend', devui_el);

const canvas = document.querySelector('#glCanvas');

const devui_list = document.querySelector(".dev-settings");

const devui_radius = document.querySelector(".radius");

const maxRender = document.getElementById("maxRender");
const minRender = document.getElementById("minRender");

const canvas_w = document.getElementById("devui-width");
const canvas_h = document.getElementById("devui-height");

const camX = document.getElementById("camPosX");
const camY = document.getElementById("camPosY");
const camZ = document.getElementById("camPosZ");

const tarX = document.getElementById("targetPosX");
const tarY = document.getElementById("targetPosY");
const tarZ = document.getElementById("targetPosZ");

const hex_radius = document.getElementById("radius");

devui_list.addEventListener('click', updateMatrix);
devui_radius.addEventListener('click', updateRadius, false);

function updateMatrix(){
  var camera = m4.setCam([camX.value, camY.value, camZ.value], [tarX.value, tarY.value, tarZ.value]);
  console.log("Calculated setCam: ");
  console.log(camera);

  var aspect = canvas_w.value / canvas_h.value;
  canvas.width  = Number(canvas_w.value);
  canvas.height = Number(canvas_h.value);
  gl.viewport(0, 0, canvas.width, canvas.height);

  console.log("Aspect ratio:" + aspect);

  var matrix = m4.perspective(Math.PI*0.5, aspect, Number(maxRender.value), Number(minRender.value));
  // var matrix = m4.projection(16.0/9.0, 1.0, 1.0);
  matrix = m4.multiply(matrix, camera);
  console.log("Calculated matrix: ");
  console.log(matrix);

  gl.uniformMatrix4fv(matrixLoc, false, matrix);
}

function updateRadius(){
  var grid_radius = Number(hex_radius.value);
  var hex_count = ((3*grid_radius*grid_radius) + (3*grid_radius) + 1);
  verticies = hex_count*12;

}