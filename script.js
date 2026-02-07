let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid name");
  data[name] = { USD: 0, IQD: 0, transactions: [] };
  nameInput.value = "";
  saveData();
  updateUI();
}

function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value.trim() || "General";

  if (!person || !amount) return alert("Please select a person and enter amount");

  data[person][currency] += amount;
  data[person].transactions.push({
    amount, currency, note, date: new Date().toLocaleDateString()
  });

  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  saveData();
  updateUI();
}

function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  const rate = Number(document.getElementById("exchangeRate").value) || 1500;
  const currentSelection = select.value;

  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);

    // --- THE MATH SECTION ---
    const usdInIqd = data[name].USD * rate;           // Dollar to Dinar
    const iqdInUsd = data[name].IQD / rate;           // Dinar to Dollar
    const totalValueInIqd = data[name].IQD + usdInIqd;
    const totalValueInUsd = data[name].USD + iqdInUsd;

    let historyHTML = "";
    data[name].transactions.slice(-3).reverse().forEach(t => {
      const historyClass = t.amount >= 0 ? "history-item-positive" : "history-item-negative";
      historyHTML += <div class="${historyClass}">${t.amount > 0 ? '+':''}${t.amount.toLocaleString()} ${t.currency} (${t.note})</div>;
    });

    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size: 1.1rem;">👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="border:none; background:none; color:#ddd; cursor:pointer; font-size:1.2rem;">✕</button>
      </div>
      <div style="margin: 15px 0; border-bottom: 1px solid #f0f0f0; padding-bottom:15px;">
        <div class="currency-value">$${data[name].USD.toLocaleString()} <small>USD</small></div>
        <div class="currency-value">${data[name].IQD.toLocaleString()} <small>IQD</small></div>
        
        <div style="margin-top:10px; display:flex; flex-direction:column; gap:5px;">
           <div class="total-value-iqd">Total as IQD: <strong>${totalValueInIqd.toLocaleString()} IQD</strong></div>
           <div class="total-value-iqd" style="background:#fff4e6; color:#e67e22;">Total as USD: <strong>$${totalValueInUsd.toFixed(2)}</strong></div>
        </div>
      </div>
      <div>
        <p class="recent-history-title">RECENT ACTIVITY</p>
        ${historyHTML || '<div class="no-history">No history yet</div>'}
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
  if(confirm("Reset all?")) { data = {}; saveData(); updateUI(); }
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Wallet_Backup_" + new Date().toISOString().slice(0,10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

updateUI();
