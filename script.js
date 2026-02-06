let data = JSON.parse(localStorage.getItem("data")) || {};

function saveData() {
  localStorage.setItem("data", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Invalid name or person exists");
  data[name] = { USD: 0, IQD: 0, transactions: [] };
  nameInput.value = "";
  saveData();
  updateUI();
}

function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value;
  if (!person || !amount) return alert("Missing info");
  data[person][currency] += amount;
  data[person].transactions.push({ amount, currency, note, date: new Date().toLocaleDateString() });
  saveData();
  updateUI();
}

function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";
  for (let name in data) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.margin = "10px 0";
    div.style.padding = "10px";
    div.innerHTML = "<strong>" + name + "</strong><br>USD: " + data[name].USD + "<br>IQD: " + data[name].IQD;
    accounts.appendChild(div);
  }
}

function clearAllData() {
  if(confirm("Delete all?")) { data = {}; saveData(); updateUI(); }
}

updateUI();
