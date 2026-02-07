let data = JSON.parse(localStorage.getItem("walletData")) || {};

function saveData() {
    localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
    const nameInput = document.getElementById("personName");
    const name = nameInput.value.trim();
    if (!name || data[name]) return alert("Name missing or exists");
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
    if (!person || !amount) return alert("Select person and amount");
    data[person][currency] += amount;
    data[person].transactions.push({ amount, currency, note, date: new Date().toLocaleDateString() });
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
        opt.value = name; opt.textContent = name;
        select.appendChild(opt);

        const usdVal = data[name].USD;
        const iqdVal = data[name].IQD;
        const totalInIqd = iqdVal + (usdVal * rate);
        const totalInUsd = usdVal + (iqdVal / rate);

        let historyHTML = "";
        data[name].transactions.slice(-3).reverse().forEach(t => {
            const color = t.amount >= 0 ? "#2ecc71" : "#e74c3c";
            historyHTML += <div style="color:${color}; font-size:11px;"${t.amount > 0 ? '+':''}${t.amount.toLocaleString()} ${t.currency} (${t.note})</div>;
        });

        const div = document.createElement("div");
        div.className = "account-card";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>👤 ${name}</strong>
                <button onclick="deletePerson('${name}')" style="background:none; border:none; color:#ddd; cursor:pointer;">✕</button>
            </div>
            <div style="margin:10px 0; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div class="currency-value">$${usdVal.toLocaleString()} <small>USD</small></div>
                <div class="currency-value">${iqdVal.toLocaleString()} <small>IQD</small></div>
            </div>
            <div class="total-pill" style="background:#e3f2fd; color:#1976d2; padding:5px; border-radius:8px; margin-bottom:5px; font-size:12px;">Total IQD: ${totalInIqd.toLocaleString()}</div>
            <div class="total-pill" style="background:#fff3e0; color:#e65100; padding:5px; border-radius:8px; font-size:12px;">Total USD: $${totalInUsd.toFixed(2)}</div>
            <div style="margin-top:10px;">
                ${historyHTML || '<div style="color:#ccc; font-size:11px;">No history</div>'}
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
    if(confirm("Erase all?")) { data = {}; saveData(); updateUI(); }
}

function downloadBackup() {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "backup.json";
    a.click();
}

updateUI();

