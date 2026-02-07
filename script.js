let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid Name");
  data[name] = { USD: 0, IQD: 0, tuitionGoal: 0, goalCurrency: "USD", transactions: [] };
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

function setGoal(name) {
  const val = document.getElementById(`input-${name}`).value;
  const curr = document.getElementById(`curr-${name}`).value;
  data[name].tuitionGoal = Number(val) || 0;
  data[name].goalCurrency = curr;
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

    const goal = data[name].tuitionGoal || 0;
    const goalCurr = data[name].goalCurrency || "USD";
    const paid = data[name][goalCurr] || 0;
    
    const percent = goal > 0 ? Math.min((paid / goal) * 100, 100) : 0;
    const checkVal = goal > 0 ? (goal / 5).toLocaleString() : 0;
    const checksPaid = goal > 0 ? Math.floor(paid / (goal / 5)) : 0;

    let historyHTML = "";
    if (data[name].transactions) {
      data[name].transactions.slice(-3).reverse().forEach(t => {
        const color = t.amount >= 0 ? "#2ecc71" : "#e74c3c";
        historyHTML += `<div style="font-size:0.75rem; color:${color}">${t.amount > 0 ? '+':''}${t.amount.toLocaleString()} ${t.currency}</div>`;
      });
    }

    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size:1.1rem;">👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; border:none; color:#ccc; cursor:pointer; font-size:1.2rem;">✕</button>
      </div>
      <div style="font-size:1.2rem; font-weight:bold; margin:5px 0;">$${(data[name].USD || 0).toLocaleString()} <small style="font-size:0.7rem; color:#718096;">USD</small></div>
      <div style="font-size:1rem; color:#4a5568;">${(data[name].IQD || 0).toLocaleString()} <small style="font-size:0.7rem;">IQD</small></div>
      
      <div class="goal-container">
        <div class="check-info" style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold;">
          <span>🎓 Goal: ${goal.toLocaleString()} ${goalCurr}</span>
          <span>${percent.toFixed(0)}%</span>
        </div>
        <div class="progress-bg" style="background:#e2e8f0; height:10px; border-radius:5px; margin:8px 0; overflow:hidden;">
          <div class="progress-fill" style="background:#48bb78; height:100%; width:${percent}%; transition:0.5s;"></div>
        </div>
        <div style="font-size:0.7rem; color:#4a5568; display:flex; justify-content:space-between;">
           <span>Check: ${checkVal}</span>
           <span>Paid: ${checksPaid}/5</span>
        </div>
        <div style="margin-top:8px; display:flex; gap:5px;">
           <input type="number" id="input-${name}" placeholder="Goal" style="padding:4px; font-size:0.7rem; flex:2; border:1px solid #ddd; border-radius:5px;">
           <select id="curr-${name}" style="padding:4px; font-size:0.7rem; flex:1; border:1px solid #ddd; border-radius:5px;">
              <option value="USD" ${goalCurr === 'USD' ? 'selected' : ''}>USD</option>
              <option value="IQD" ${goalCurr === 'IQD' ? 'selected' : ''}>IQD</option>
           </select>
           <button onclick="setGoal('${name}')" style="padding:4px 8px; font-size:0.7rem; background:#718096; color:white; border-radius:5px;">Set</button>
        </div>
      </div>
      <div style="margin-top:10px; border-top:1px solid #edf2f7; padding-top:5px;">
        ${historyHTML || '<div style="font-size:0.75rem; color:#ccc;">No history</div>'}
      </div>
    `;
    accounts.appendChild(div);
  }
  if (currentSelection && data[currentSelection]) select.value = currentSelection;
}

function deletePerson(name) {
  if(confirm("Delete " + name + "?")) { delete data[name]; saveData(); updateUI(); }
}

function clearAllData() {
  if(confirm("Erase all data?")) { data = {}; saveData(); updateUI(); }
}

updateUI();
