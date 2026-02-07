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
  const note = document.getElementById("note").value || "General";

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
  const currentSelection = select.value;

  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    // Add to dropdown
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);

    // Create history list (last 3 items)
    let historyHTML = "";
    const recent = data[name].transactions.slice(-3).reverse();
    recent.forEach(t => {
      const color = t.amount >= 0 ? "#27ae60" : "#c0392b";
      historyHTML += `<div style="color:${color}; font-size:12px; margin-bottom:3px;">
        ${t.amount > 0 ? '+':''}${t.amount.toLocaleString()} ${t.currency} (${t.note})
      </div>`;
    });

    // Build the Wallet Card
    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="color:#bdc3c7; background:none; border:none; cursor:pointer;">✕</button>
      </div>
      <div style="margin: 10px 0;">
        <div style="color:#2c3e50; font-size:1.2rem;">$${data[name].USD.toLocaleString()} <span style="font-size:12px; color:#95a5a6;">USD</span></div>
        <div style="color:#2c3e50; font-size:1.2rem;">${data[name].IQD.toLocaleString()} <span style="font-size:12px; color:#95a5a6;">IQD</span></div>
      </div>
      <div style="border-top: 1px solid #f9f9f9; padding-top:10px;">
        <p style="margin:0 0 5px 0; font-size:10px; color:#bdc3c7; letter-spacing:1px;">RECENT ACTIVITY</p>
        ${historyHTML || '<div style="font-size:11px; color:#ccc;">No history yet</div>'}
      </div>
    `;
    accounts.appendChild(div);
  }

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

// 8. Download Backup File
function downloadBackup() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Wallet_Backup_" + new Date().
    toISOString().slice(0,10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Start the app
updateUI();
