let devui_cnvs = document.getElementById("glCanvas");
let devui_div = document.createElement('div');
let devui_el = String(`
<div class="devui-width">
  <label for="devui-width">Window width: </label>
  <input type="number" name="devui-width" id="devui-width" value="1920" required>
</div>
<div class="devui-height">
  <label for="devui-height">Window height: </label>
  <input type="number" name="devui-height" id="devui-height" value="1080" required>
</div>
`);
devui_cnvs.after(devui_div);
devui_div.insertAdjacentHTML('beforeend', devui_el);