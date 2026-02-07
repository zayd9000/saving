let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid Name");
  data[name] = { USD: 0, IQD: 0, goals: [], transactions: [] };
  nameInput.value = "";
  saveData();
  updateUI();
}

function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value || "General";
  if (!person || !amount) return alert("Fill all fields");
  data[person][currency] += amount;
  data[person].transactions.push({ amount, currency, note });
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  saveData();
  updateUI();
}

function addGoal(name) {
  const title = document.getElementById(`gName-${name}`).value || "Goal";
  const target = Number(document.getElementById(`gPrice-${name}`).value) || 0;
  const curr = document.getElementById(`gCurr-${name}`).value;
  if (target <= 0) return alert("Enter a price");
  if (!data[name].goals) data[name].goals = [];
  data[name].goals.push({ title, target, currency: curr, paid: 0 });
  saveData();
  updateUI();
}

// NEW: This adds money to the existing paid amount
function manualAddGoalPayment(personName, goalIndex) {
  const input = document.getElementById(`addPay-${personName}-${goalIndex}`);
  const addAmount = Number(input.value);
  
  if (!addAmount || addAmount <= 0) return alert("Enter amount to add");

  data[personName].goals[goalIndex].paid = (data[personName].goals[goalIndex].paid || 0) + addAmount;
  input.value = ""; // Clear input
  saveData();
  updateUI();
}

function deleteGoal(personName, index) {
  data[personName].goals.splice(index, 1);
  saveData();
  updateUI();
}

function deletePerson(name) {
  if(confirm("Delete " + name + "?")) { delete data[name]; saveData(); updateUI(); }
}

function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  if (!select || !accounts) return;
  const currentSelection = select.value;
  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    const opt = document.createElement("option");
    opt.value = name; opt.textContent = name;
    select.appendChild(opt);

    let goalsHTML = "";
    (data[name].goals || []).forEach((goal, index) => {
      const paid = goal.paid || 0;
      const percent = Math.min((paid / goal.target) * 100, 100);
      const remaining = goal.target - paid;
      
      goalsHTML += `
        <div style="background:#fff; padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #e2e8f0;">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:bold;">
            <span>🎯 ${goal.title}</span>
            <button onclick="deleteGoal('${name}', ${index})" style="background:none; border:none; color:#f56565;">✕</button>
          </div>
          <div style="font-size:0.75rem; color:#718096; margin:4px 0;">Goal: ${goal.target.toLocaleString()} ${goal.currency}</div>
          <div style="background:#e2e8f0; height:10px; border-radius:5px; overflow:hidden; margin:8px 0;">
            <div style="background:#48bb78; height:100%; width:${percent}%; transition:0.5s;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:bold; margin-bottom:8px;">
            <span>Saved: ${paid.toLocaleString()} (${percent.toFixed(0)}%)</span>
            <span style="color:#e53e3e;">Left: ${remaining.toLocaleString()}</span>
          </div>
          
          <div style="display:flex; gap:5px; margin-top:5px;">
            <input type="number" id="addPay-${name}-${index}" placeholder="+ Add Payment" style="flex:2; font-size:0.7rem; padding:6px; border:1px solid #cbd5e0; border-radius:4px;">
            <button onclick="manualAddGoalPayment('${name}', ${index})" style="flex:1; background:#48bb78; color:white; font-size:0.8rem; border-radius:4px; border:none; cursor:pointer; font-weight:bold;">+</button>
          </div>
        </div>
      `;
    });

    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; border:none; color:#ccc;">✕</button>
      </div>
      <div style="font-size:1.2rem; font-weight:bold;">$${(data[name].USD || 0).toLocaleString()} <small>USD</small></div>
      <div style="font-size:1rem; color:#4a5568; margin-bottom:15px;">${(data[name].IQD || 0).toLocaleString()} <small>IQD</small></div>
      <div style="background:#edf2f7; padding:12px; border-radius:12px;">
        <h3 style="font-size:0.7rem; margin-bottom:10px; color:#4a5568;">ACTIVE GOALS</h3>
        ${goalsHTML || '<div style="font-size:0.7rem; color:#a0aec0; text-align:center;">No goals yet.</div>'}
        <div style="margin-top:10px; border-top:1px solid #cbd5e0; padding-top:10px; display:flex; flex-direction:column; gap:5px;">
           <input type="text" id="gName-${name}" placeholder="Goal Name" style="padding:6px; font-size:0.7rem;">
           <div style="display:flex; gap:5px;">
             <input type="number" id="gPrice-${name}" placeholder="Total Price" style="padding:6px; font-size:0.7rem; flex:2;">
             <select id="gCurr-${name}" style="padding:6px; font-size:0.7rem; flex:1;">
                <option value="USD">USD</option>
                <option value="IQD">IQD</option>
             </select>
           </div>
           <button onclick="addGoal('${name}')" style="background:#2d3748; color:white; font-size:0.7rem; padding:8px; border-radius:5px;">+ Create Goal</button>
        </div>
      </div>
    `;
    accounts.appendChild(div);
  }
  if (currentSelection && data[currentSelection]) select.value = currentSelection;
}
updateUI();
