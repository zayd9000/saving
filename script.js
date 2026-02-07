let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid Name");
  // Every person starts with an empty goals list and 0 balance
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
  const goalTitle = document.getElementById(`gName-${name}`).value || "Goal";
  const goalPrice = Number(document.getElementById(`gPrice-${name}`).value) || 0;
  const goalCurr = document.getElementById(`gCurr-${name}`).value;
  
  if (goalPrice <= 0) return alert("Enter a price");

  // If goals list doesn't exist yet, create it
  if (!data[name].goals) data[name].goals = [];

  data[name].goals.push({
    title: goalTitle,
    target: goalPrice,
    currency: goalCurr
  });

  saveData();
  updateUI();
}

function deleteGoal(personName, index) {
  data[personName].goals.splice(index, 1);
  saveData();
  updateUI();
}

function deletePerson(name) {
  if(confirm("Delete " + name + "?")) {
    delete data[name];
    saveData();
    updateUI();
  }
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

    // Build the Goals HTML inside each person's card
    let goalsHTML = "";
    if (data[name].goals) {
      data[name].goals.forEach((goal, index) => {
        const paid = data[name][goal.currency] || 0;
        const percent = Math.min((paid / goal.target) * 100, 100);
        const remaining = goal.target - paid > 0 ? goal.target - paid : 0;

        goalsHTML += `
          <div style="background:#fff; padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:bold; color:#2d3748;">
              <span>🎯 ${goal.title}</span>
              <button onclick="deleteGoal('${name}', ${index})" style="background:none; border:none; color:#f56565; cursor:pointer; font-size:1rem;">✕</button>
            </div>
            <div style="font-size:0.75rem; color:#718096; margin-bottom:5px;">Target: ${goal.target.toLocaleString()} ${goal.currency}</div>
            <div style="background:#e2e8f0; height:10px; border-radius:5px; overflow:hidden;">
              <div style="background:#48bb78; height:100%; width:${percent}%; transition:0.5s;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.7rem; margin-top:5px; font-weight:bold;">
              <span>${percent.toFixed(0)}% Paid</span>
              <span style="color:#e53e3e;">Left: ${remaining.toLocaleString()}</span>
            </div>
          </div>
        `;
      });
    }

    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <strong style="font-size:1.1rem; color:#1a202c;">👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; border:none; color:#cbd5e0; cursor:pointer; font-size:1.2rem;">✕</button>
      </div>
      <div style="font-size:1.3rem; font-weight:bold; color:#2d3748;">$${(data[name].USD || 0).toLocaleString()} <small style="font-size:0.7rem; color:#718096;">USD</small></div>
      <div style="font-size:1.1rem; color:#4a5568; margin-bottom:15px;">${(data[name].IQD || 0).toLocaleString()} <small style="font-size:0.7rem;">IQD</small></div>
      
      <div style="background:#edf2f7; padding:12px; border-radius:12px;">
        <h3 style="font-size:0.75rem; margin:0 0 10px 0; color:#4a5568; text-transform:uppercase; letter-spacing:1px;">My Savings Goals</h3>
        ${goalsHTML || '<div style="font-size:0.75rem; color:#a0aec0; text-align:center; padding:10px;">No goals added yet.</div>'}
        
        <div style="margin-top:10px; display:flex; flex-direction:column; gap:8px; border-top:1px solid #cbd5e0; padding-top:12px;">
           <input type="text" id="gName-${name}" placeholder="Goal (e.g. iPhone)" style="padding:8px; font-size:0.8rem; border-radius:6px; border:1px solid #cbd5e0;">
           <div style="display:flex; gap:5px;">
             <input type="number" id="gPrice-${name}" placeholder="Price" style="padding:8px; font-size:0.8rem; flex:2; border-radius:6px; border:1px solid #cbd5e0;">
             <select id="gCurr-${name}" style="padding:8px; font-size:0.8rem; flex:1; border-radius:6px; border:1px solid #cbd5e0; background:white;">
                <option value="USD">USD</option>
                <option value="IQD">IQD</option>
             </select>
           </div>
           <button onclick="addGoal('${name}')" style="background:#2d3748; color:white; font-size:0.8rem; padding:8px; border-radius:6px; font-weight:bold;">+ Add New Goal</button>
        </div>
      </div>
    `;
    accounts.appendChild(div);
  }
  if (currentSelection && data[currentSelection]) select.value = currentSelection;
}

updateUI();
