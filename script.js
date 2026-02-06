let data = JSON.parse(localStorage.getItem("data")) || {};

function saveData() {
  localStorage.setItem("data", JSON.stringify(data));
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  if (!name) return alert("Enter a name!");
  if (data[name]) return alert("Person already exists!");

  data[name] = {
    USD: 0,
    IQD: 0,
    transactions: []
  };

  document.getElementById("personName").value = "";
  saveData();
  updateUI();
}

function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value;

  if (!person) return alert("Select a person!");
  if (isNaN(amount) || amount === 0) return alert("Enter a valid amount!");

  data[person][currency] += amount;
  data[person].transactions.push({
    amount,
    currency,
    note,
    date: new Date().toLocaleString()
  });

  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";

  saveData();
  updateUI();
}

function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");

  // Save current selection to restore it after refresh
  const currentSelection = select.value;

  select.innerHTML = '<option value="" disabled selected>Choose Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    // Add name to dropdown
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);

    // Add account card
    const div = document.createElement("div");
    div.className = "box"; // Uses your existing CSS box style
    div.innerHTML = `
      <h3>👤 ${name}</h3>
      <p><strong>USD:</strong> $${data[name].USD.toLocaleString()}</p>
      <p><strong>IQD:</strong> ${data[name].IQD.toLocaleString()} IQD</p>
      <hr>
      <small>History:</small>
      <ul style="font-size: 0.8em; color: #555;">
        ${data[name].transactions.slice(-5).reverse().map(t => 
          <li>${t.amount > 0 ? '+' : ''}${t.amount} ${t.currency} — ${t.note || "No note"}</li>
        ).join("")}
      </ul>
    `;
    accounts.appendChild(div);
  }
  select.value = currentSelection;
}

// Run this when the page first loads
updateUI();
