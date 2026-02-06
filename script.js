let data = JSON.parse(localStorage.getItem("data")) || {};

function saveData() {
  localStorage.setItem("data", JSON.stringify(data));
}

function addPerson() {
  const name = document.getElementById("personName").value.trim();
  if (!name || data[name]) return;

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

  if (!person || isNaN(amount)) return;

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

  select.innerHTML = "";
  accounts.innerHTML = "";

  for (let name in data) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);

    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${name}</h3>
      <p>USD: ${data[name].USD}</p>
      <p>IQD: ${data[name].IQD}</p>
      <ul>
        ${data[name].transactions.map(t =>
          <li>${t.amount} ${t.currency} — ${t.note || ""} (${t.date})</li>
        ).join("")}
      </ul>
    `;
    accounts.appendChild(div);
  }
}

updateUI();