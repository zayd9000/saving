// Load saved data or start with empty
let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  
  if (!name) return alert("Please enter a name");
  if (data[name]) return alert("Person already exists");

  data[name] = { USD: 0, IQD: 0, transactions: [] };
  
  nameInput.value = "";
  saveData();
  updateUI();
}

function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value || "No note";

  if (!person) return alert("Please select a person first!");
  if (!amount) return alert("Please enter an amount!");

  // update the math
  data[person][currency] += amount;

  // save the history
  data[person].transactions.push({
    amount: amount,
    currency: currency,
    note: note,
    date: new Date().toLocaleDateString()
  });

  // clear inputs
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
    // Add name to dropdown
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);

    // Create history list
    let historyHTML = "";
    const recent = data[name].transactions.slice(-3).reverse();
    recent.forEach(t => {
      const color = t.amount >= 0 ? "#2ecc71" : "#e74c3c";
      historyHTML += `<div style="color:${color}; font-size:12px; margin-bottom:2px;">
        ${t.amount > 0 ? '+':''}${t.amount.toLocaleString()} ${t.currency} - ${t.note}
      </div>`;
    });

    // Create the account box
    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>👤 ${name}</strong>
        <span style="font-size:11px; color:#95a5a6;">ID: ${name.toLowerCase()}</span>
      </div>
      <div style="margin: 10px 0; border-bottom: 1px solid #eee; padding-bottom:10px;">
        <div style="font-size: 1.1rem; color: #2c3e50;"><strong>$${data[name].USD.toLocaleString()}</strong> <small>USD</small></div>
        <div style="font-size: 1.1rem; color: #3498db;"><strong>${data[name].IQD.toLocaleString()}</strong> <small>IQD</small></div>
      </div>
      <div>
        <p style="margin:0 0 5px 0; font-size:10px; color:#bdc3c7; font-weight:bold;">RECENT ACTIVITY</p>
        ${historyHTML || '<div style="font-size:11px; color:#ccc;">No transactions yet</div>'}
      </div>
    `;
    accounts.appendChild(div);
  }

  if (currentSelection && data[currentSelection]) {
    select.value = currentSelection;
  }
}

function clearAllData() {
  if(confirm("This will delete ALL people and ALL money. Are you sure?")) {
    data = {};
    saveData();
    updateUI();
  }
}

// Run UI on start
updateUI();
