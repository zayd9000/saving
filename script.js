// 1. Initialize data from memory
let data = JSON.parse(localStorage.getItem("walletData")) || {};

// 2. Save function
function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

// 3. Add Person function
function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  
  if (!name) return alert("Please enter a name");
  if (data[name]) return alert("This person already exists");

  data[name] = { USD: 0, IQD: 0, transactions: [] };
  
  nameInput.value = "";
  saveData();
  updateUI();
}

// 4. Add/Deduct Transaction function
function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amountInput = document.getElementById("amount");
  const amount = Number(amountInput.value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value.trim() || "General"; // Trim note

  if (!person) return alert("Select a person first");
  if (!amount) return alert("Enter an amount");

  // Math: This handles both plus and minus
  data[person][currency] += amount;

  // Add to history
  data[person].transactions.push({
    amount: amount,
    currency: currency,
    note: note,
    date: new Date().toLocaleDateString()
  });

  amountInput.value = "";
  document.getElementById("note").value = "";
  
  saveData();
  updateUI();
}

// 5. Update the Screen
function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  const rate = Number(document.getElementById("exchangeRate").value) || 1500;
  const currentSelection = select.value;

  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    // Add name to dropdown
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);

    // Calculate conversion
    const usdInIqd = data[name].USD * rate;
    const totalValueInIqd = data[name].IQD + usdInIqd;

    // Create history list (last 3 items)
    let historyHTML = "";
    const recent = data[name].transactions.slice(-3).reverse();
    recent.forEach(t => {
      const historyClass = t.amount >= 0 ? "history-item-positive" : "history-item-negative";
      historyHTML += `<div class="${historyClass}">
        ${t.amount > 0 ? '+':''}${t.amount.toLocaleString()} ${t.currency} (${t.note})
      </div>`;
    });

    // Build the Wallet Card
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
        <div class="total-value-iqd">
           Total Value: <strong>${totalValueInIqd.toLocaleString()} IQD</strong>
        </div>
      </div>
      <div>
        <p class="recent-history-title">RECENT ACTIVITY</p>
        ${historyHTML || '<div class="no-history">No history yet</div>'}
      </div>
    `;
    accounts.appendChild(div);
  }

  // Restore previous selection
  if (currentSelection && data[currentSelection]) {
    select.value = currentSelection;
  }
}

// 6. Delete One Person
function deletePerson(name) {
  if(confirm("Delete " + name + " and all their data?")) {
    delete data[name];
    saveData();
    updateUI();
  }
}

// 7. Reset Everything
function clearAllData() {
  if(confirm("WARNING: This will erase EVERYTHING! Are you sure?")) {
    data = {};
    saveData();
    updateUI();
  }
}

// 8.Download Backup File
function downloadBackup() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Wallet_Backup_" + new Date().toISOString().slice(0,10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Start the app
updateUI();
