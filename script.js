// Load data or start fresh
let data = JSON.parse(localStorage.getItem("data")) || {};

function saveData() {
  localStorage.setItem("data", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  
  if (!name) return alert("Please enter a name");
  if (data[name]) return alert("This person already exists");

  data[name] = {
    USD: 0,
    IQD: 0,
    transactions: []
  };

  nameInput.value = "";
  saveData();
  updateUI();
}

function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value;

  if (!person) return alert("Select a person first");
  if (!amount || isNaN(amount)) return alert("Enter a valid amount");

  data[person][currency] += amount;
  data[person].transactions.push({
    amount,
    currency,
    note,
    date: new Date().toLocaleDateString()
  });

  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  saveData();
  updateUI();
}

function deletePerson(name) {
    if(confirm(`Are you sure you want to delete ${name}?`)) {
        delete data[name];
        saveData();
        updateUI();
    }
}

function clearAllData() {
    if(confirm("Erase EVERYTHING? This cannot be undone.")) {
        data = {};
        saveData();
        updateUI();
    }
}

function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  
  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    // Dropdown
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);

    // Account Card
    const div = document.createElement("div");
    div.className = "account-card";
    div.innerHTML = `
      <div class="account-header">
        <strong>${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; color:red; font-size:12px; border:none; cursor:pointer;">Delete</button>
      </div>
      <div class="balance-row">
        <span>USD:</span> 
        <span class="${data[name].USD >= 0 ? 'positive' : 'negative'}">$${data[name].USD.toLocaleString()}</span>
      </div>
      <div class="balance-row">
        <span>IQD:</span> 
        <span class="${data[name].IQD >= 0 ? 'positive' : 'negative'}">${data[name].IQD.toLocaleString()} IQD</span>
      </div>
      <ul class="history-list">
        ${data[name].transactions.slice(-3).reverse().map(t => 
          <li>${t.amount > 0 ? '+' : ''}${t.amount.toLocaleString()} ${t.currency} - ${t.note || 'No note'}</li>
        ).join("")}
      </ul>
    `;
    accounts.appendChild(div);
  }
}

// Start the UI
updateUI();
