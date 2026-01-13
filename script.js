const levelMap = {
  ASM01:150000, ASM02:175000, ASM03:200000, ASM04:225000,
  ASM05:250000, ASM06:275000, ASM07:300000, ASM08:325000,
  ASM09:350000, ASM10:400000, ASM11:500000, ASM12:600000,

  SLP01:90000, SLP02:120000, SLP03:140000, SLP04:160000,
  SLP05:180000, SLP06:200000, SLP07:220000, SLP08:300000
};
function toggleForm() {
  let type = document.getElementById("type").value;
  let form = document.getElementById("form");

  if (type === "primary") {
    form.innerHTML = `
      <label>Sales Target</label>
      <input id="target" type="number">

      <label>Sales Achievement</label>
      <input id="achieved" type="number">

      <label>Level Code</label>
      <select id="level">
        ${Object.keys(levelMap).map(l => `<option>${l}</option>`).join("")}
      </select>

      <label>Total Resources</label>
      <input id="resources" type="number">

      <label>Resources Meeting Touchpoint</label>
      <input id="qualified" type="number">
    `;
  } else {
    form.innerHTML = `
      <label>Sales Target</label>
      <input id="target" type="number">

      <label>Sales Achievement</label>
      <input id="achieved" type="number">

      <label>Touchpoint Target</label>
      <input id="tpTarget" type="number">

      <label>Touchpoint Achievement</label>
      <input id="tpAchieved" type="number">
    `;
  }
}

toggleForm();

function calculate() {
  let target = Number(document.getElementById("target").value);
  let achieved = Number(document.getElementById("achieved").value);
  let percent = achieved / target;

  if (percent < 0.8) {
    showResult("❌ Not Eligible (Below 80%)");
    return;
  }

  let type = document.getElementById("type").value;
  let result = "";

  if (type === "primary") {
    let level = document.getElementById("level").value;
    let proposed = levelMap[level];
    let resources = Number(document.getElementById("resources").value);
    let qualified = Number(document.getElementById("qualified").value);

    let generated = percent * proposed;
    let sales = generated * 0.6;
    let touch = (generated * 0.4 / resources) * qualified;

    result = `
      <p>Sales Incentive: <b>&#8358;${sales.toFixed(0)}</b></p>
      <p>Touchpoint Earned: <b>&#8358;${touch.toFixed(0)}</b></p>
      <hr>
      <h3>Total Payout: &#8358;${(sales + touch).toFixed(0)}</h3>
    `;
  } else {
    let generated = percent * 40000;
    let sales = generated * 0.5;
    let tpTarget = Number(document.getElementById("tpTarget").value);
    let tpAchieved = Number(document.getElementById("tpAchieved").value);
    let touch = tpAchieved >= tpTarget ? generated * 0.5 : 0;

    result = `
      <p>Sales Incentive: <b>&#8358;${sales.toFixed(0)}</b></p>
      <p>Touchpoint Earned: <b>&#8358;${touch.toFixed(0)}</b></p>
      <hr>
      <h3>Total Payout: &#8358;${(sales + touch).toFixed(0)}</h3>
    `;
  }

  showResult(result);
}

function showResult(html) {
  document.getElementById("result").innerHTML = html;
  document.getElementById("page1").style.display = "none";
  document.getElementById("page2").style.display = "block";
}

function goBack() {
  document.getElementById("page2").style.display = "none";
  document.getElementById("page1").style.display = "block";
}

