let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid Name");
  // Each person now has a 'goals' array
  data[name] = { USD: 0, IQD: 0, goals: [], transactions: [] };
  nameInput.value = "";
  saveData();
  updateUI();
}

function addGoal(name) {
  const goalTitle = document.getElementById(`gName-${name}`).value || "Goal";
  const goalPrice = Number(document.getElementById(`gPrice-${name}`).value) || 0;
  const goalCurr = document.getElementById(`gCurr-${name}`).value;
  
  if (goalPrice <= 0) return alert("Enter a price");

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

    // Build the Goals HTML
    let goalsHTML = "";
    (data[name].goals || []).forEach((goal, index) => {
      const paid = data[name][goal.currency] || 0;
      const percent = Math.min((paid / goal.target) * 100, 100);
      const remaining = goal.target - paid > 0 ? goal.target - paid : 0;

      goalsHTML += `
        <div style="background:#fff; padding:10px; border-radius:8px; margin-bottom:10px; border:1px solid #e2e8f0;">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold;">
            <span>🎯 ${goal.title}</span>
            <button onclick="deleteGoal('${name}', ${index})" style="background:none; border:none; color:#f56565; cursor:pointer;">✕</button>
          </div>
          <div style="font-size:0.7rem; color:#718096; margin-bottom:5px;">Target: ${goal.target.toLocaleString()} ${goal.currency}</div>
          <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:#48bb78; height:100%; width:${percent}%; transition:0.5s;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; margin-top:5px;">
            <span>${percent.toFixed(0)}% Paid</span>
            <span style="color:#e53e3e;">Left: ${remaining.toLocaleString()}</span>
          </div>
        </div>
      `;
    });

    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size:1.1rem;">👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; border:none; color:#ccc; cursor:pointer;">✕</button>
      </div>
      <div style="font-size:1.2rem; font-weight:bold; margin:5px 0;">$${(data[name].USD || 0).toLocaleString()} <small>USD</small></div>
      <div style="font-size:1rem; color:#4a5568; margin-bottom:10px;">${(data[name].IQD || 0).toLocaleString()} <small>IQD</small></div>
      
      <div class="goal-container" style="background:#f7fafc; padding:10px; border-radius:10px;">
        <h3 style="font-size:0.7rem; margin:0 0 10px 0; color:#4a5568;">MY GOALS</h3>
        ${goalsHTML || '<div style="font-size:0.7rem; color:#a0aec0;">No goals added yet.</div>'}
        
        <div style="margin-top:10px; display:flex; flex-direction:column; gap:5px; border-top:1px solid #edf2f7; padding-top:10px;">
           <input type="text" id="gName-${name}" placeholder="Goal Name (e.g. iPhone)" style="padding:5px; font-size:0.7rem;">
           <div style="display:flex; gap:5px;">
             <input type="number" id="gPrice-${name}" placeholder="Price" style="padding:5px; font-size:0.7rem; flex:2;">
             <select id="gCurr-${name}" style="padding:5px; font-size:0.7rem; flex:1;">
                <option value="USD">USD</option>
                <option value="IQD">IQD</option>
             </select>
           </div>
           <button onclick="addGoal('${name}')" style="background:#4a5568; color:white; font-size:0.7rem; padding:5px; border-radius:5px;">+ Add Goal</button>
        </div>
      </div>
    `;
    accounts.appendChild(div);
  }
  if (currentSelection && data[currentSelection]) select.value = currentSelection;
}

// Keep your existing addTransaction, deletePerson, and clearAllData functions...
