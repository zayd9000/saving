function updateUI() {
  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  
  // 1. Remember who was selected before the update
  const currentSelection = select.value;

  select.innerHTML = '<option value="" disabled selected>Select Person</option>';
  accounts.innerHTML = "";

  for (let name in data) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);

    const div = document.createElement("div");
    div.style.background = "white";
    div.style.padding = "10px";
    div.style.marginTop = "10px";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    div.innerHTML = "<strong>" + name + "</strong><br>USD: $" + data[name].USD.toLocaleString() + "<br>IQD: " + data[name].IQD.toLocaleString() + " IQD";
    accounts.appendChild(div);
  }

  // 2. Put the selection back so you don't have to re-click!
  if (currentSelection && data[currentSelection]) {
    select.value = currentSelection;
  }
}
