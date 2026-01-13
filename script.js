/* ---------------- SUPABASE SETUP ---------------- */

const SUPABASE_URL = "https://vrbsraxcjoteibpihtjm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyYnNyYXhjam90ZWlicGlodGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMjkyNjksImV4cCI6MjA4MzgwNTI2OX0.a3k-Lx24DgmnYrG72c3vZwXikBLKdJujS_R7xrgrrUY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ---------------- LEVEL CODE MAP ---------------- */

const levelMap = {
  ASM01:150000, ASM02:175000, ASM03:200000, ASM04:225000,
  ASM05:250000, ASM06:275000, ASM07:300000, ASM08:325000,
  ASM09:350000, ASM10:400000, ASM11:500000, ASM12:600000,

  SLP01:90000, SLP02:120000, SLP03:140000, SLP04:160000,
  SLP05:180000, SLP06:200000, SLP07:220000, SLP08:300000
};

/* ---------------- FETCH EMPLOYEE ---------------- */
async function findEmployee() {
  const code = document.getElementById("empCode").value;

  if (!code) return;

  const { data, error } = await supabaseClient
    .from("employees")   // ✅ FIXED
    .select("employee_name, level_code, designation")
    .eq("employee_code", code)
    .single();

  if (error || !data) {
    alert("Employee not found");
    return;
  }

  document.getElementById("empName").value = data.employee_name;
  document.getElementById("designation").value = data.designation;
  document.getElementById("level").value = data.level_code;
}

/* ---------------- FORM TOGGLE ---------------- */

function toggleForm() {
  let type = document.getElementById("type").value;
  let form = document.getElementById("form");
  let employeeSection = document.getElementById("employeeSection");

  if (type === "primary") {
    employeeSection.style.display = "block";

    form.innerHTML = `
      <label>Sales Target</label>
      <input id="target" type="number">

      <label>Sales Achievement</label>
      <input id="achieved" type="number">

      <label>Total Resources</label>
      <input id="resources" type="number">

      <label>Resources Met TP TGT</label>
      <input id="qualified" type="number">
    `;
  } else {
    employeeSection.style.display = "none";

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
/* ---------------- CALCULATION ---------------- */
function calculate() {
  const type = document.getElementById("type").value;

  const target = Number(document.getElementById("target").value);
  const achieved = Number(document.getElementById("achieved").value);

  if (!target || !achieved) {
    alert("Please enter sales target and achievement");
    return;
  }

  let salesPercent = achieved / target;
  let resultHTML = "";

  /* ================= PRIMARY SALESMAN ================= */

  if (type === "primary") {

    if (salesPercent < 0.8) {
      showResult("❌ Not eligible (Sales below 80%)");
      return;
    }

    const levelInput = document.getElementById("level");
    if (!levelInput || !levelInput.value) {
      alert("Level code not found for this employee");
      return;
    }

    const proposed = levelMap[levelInput.value];

    const resources = Number(document.getElementById("resources").value);
    const qualified = Number(document.getElementById("qualified").value);

    if (!resources || resources <= 0) {
      alert("Total resources must be greater than zero");
      return;
    }

    const generated = salesPercent * proposed;
    const salesIncentive = generated * 0.6;
    const touchpointEarned = (generated * 0.4 / resources) * qualified;

    resultHTML = `
      <p>Sales Incentive: <b>₦${salesIncentive.toFixed(0)}</b></p>
      <p>Touchpoint Earned: <b>₦${touchpointEarned.toFixed(0)}</b></p>
      <hr>
      <h3>Total Payout: ₦${(salesIncentive + touchpointEarned).toFixed(0)}</h3>
    `;
  }

  /* ================= SECONDARY SALESMAN ================= */

  else {

    /* ---- SALES INCENTIVE ---- */
    let salesIncentive = 0;
    const salesPool = 20000; // 50% of ₦40,000

    if (salesPercent >= 0.8) {
      if (salesPercent > 2) salesPercent = 2; // cap at 200%
      salesIncentive = salesPercent * salesPool;
    }

    /* ---- TOUCHPOINT INCENTIVE ---- */
    const tpTarget = Number(document.getElementById("tpTarget").value);
    const tpAchieved = Number(document.getElementById("tpAchieved").value);

    if (!tpTarget || !tpAchieved) {
      alert("Please enter touchpoint target and achievement");
      return;
    }

    let touchpointEarned = tpAchieved >= tpTarget ? 20000 : 0;

    resultHTML = `
      <p>Sales Incentive: <b>₦${salesIncentive.toFixed(0)}</b></p>
      <p>Touchpoint Earned: <b>₦${touchpointEarned.toFixed(0)}</b></p>
      <hr>
      <h3>Total Payout: ₦${(salesIncentive + touchpointEarned).toFixed(0)}</h3>
    `;
  }

  showResult(resultHTML);
}
/* ---------------- PAGE SWITCH ---------------- */

function showResult(html) {
  document.getElementById("result").innerHTML = html;
  document.getElementById("page1").style.display = "none";
  document.getElementById("page2").style.display = "block";
}

function goBack() {
  document.getElementById("page2").style.display = "none";
  document.getElementById("page1").style.display = "block";
}








