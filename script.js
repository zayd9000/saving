let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid Name");
  data[name] = { USD: 0, IQD: 0, transactions: [] };
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

    let historyHTML = "";
    data[name].transactions.slice(-3).reverse().forEach(t => {
      const color = t.amount >= 0 ? "green" : "red";
      historyHTML += <div class="history-item" style="color:${color}">${t.amount > 0 ? '+':''}${t.amount} ${t.currency} (${t.note})</div>;
    });

    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
        <strong>${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; color:#ccc;">✕</button>
      </div>
      <div class="currency-row">$${data[name].USD.toLocaleString()} USD</div>
      <div class="currency-row">${data[name].IQD.toLocaleString()} IQD</div>
      <div style="margin-top:10px; border-top:1px solid #eee; padding-top:5px;">
        ${historyHTML || 'No history'}
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
