let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid Name");
  data[name] = { USD: 0, IQD: 0, tuitionGoal: 0, transactions: [] };
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
  data[name].tuitionGoal = Number(val) || 0;
  saveData();
  updateUI();
}

function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  const currentSelection = select.value;

  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    const opt = document.createElement("option");
    opt.value = name; opt.textContent = name;
    select.appendChild(opt);

    const goal = data[name].tuitionGoal || 0;
    const paid = data[name].USD; // Using USD for tuition
    const percent = goal > 0 ? Math.min((paid / goal) * 100, 100) : 0;
    const checkVal = goal > 0 ? (goal / 5).toLocaleString() : 0;
    const checksPaid = goal > 0 ? Math.floor(paid / (goal / 5)) : 0;

    let historyHTML = "";
    data[name].transactions.slice(-3).reverse().forEach(t => {
      const color = t.amount >= 0 ? "#2ecc71" : "#e74c3c";
      historyHTML += `<div style="font-size:0.75rem; color:${color}">${t.amount > 0 ? '+':''}${t.amount.toLocaleString()} ${t.currency}</div>`;
    });

    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size:1.1rem;">👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; color:#ccc; cursor:pointer; font-size:1.2rem;">✕</button>
      </div>
      <div style="font-size:1.2rem; font-weight:bold; margin:5px 0;">$${data[name].USD.toLocaleString()} <small style="font-size:0.7rem; color:#718096;">USD</small></div>
      <div style="font-size:1rem; color:#4a5568;">${data[name].IQD.toLocaleString()} <small style="font-size:0.7rem;">IQD</small></div>
      
      <div class="goal-container">
        <div class="check-info">
          <span>🎓 Tuition: $${goal.toLocaleString()}</span>
          <span>${percent.toFixed(0)}%</span>
        </div>
        <div class="progress-bg"><div class="progress-fill" style="width:${percent}%"></div></div>
        <div style="font-size:0.7rem; color:#4a5568; display:flex; justify-content:space-between;">
           <span>Check: $${checkVal}</span>
           <span>Installments: ${checksPaid}/5</span>
        </div>
        <div style="margin-top:8px; display:flex; gap:5px;">
           <input type="number" id="input-${name}" placeholder="Yearly Amount" style="padding:4px; font-size:0.7rem; flex:1;">
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

function downloadBackup() {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wallet_backup.json";
  a.click();
}

updateUI();
