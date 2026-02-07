let data = JSON.parse(localStorage.getItem("walletData")) || {};
let currentLang = localStorage.getItem("lang") || "en";

const translations = {
  en: {
    addPerson: "Add New Person",
    namePlaceholder: "Enter Name...",
    selectPerson: "Select Person",
    amount: "Amount",
    note: "Note",
    saveBtn: "Save Transaction",
    goalsTitle: "ACTIVE GOALS",
    goalName: "Goal Name",
    goalPrice: "Total Price",
    createGoal: "+ Create Goal",
    addPayment: "+ Add Payment",
    saved: "Saved",
    left: "Left",
    deleteConfirm: "Are you sure?",
    clearData: "Clear All Data",
    dir: "ltr"
  },
  ar: {
    addPerson: "إضافة شخص جديد",
    namePlaceholder: "أدخل الاسم...",
    selectPerson: "اختر الشخص",
    amount: "المبلغ",
    note: "ملاحظة",
    saveBtn: "حفظ العملية",
    goalsTitle: "الأهداف الحالية",
    goalName: "اسم الهدف",
    goalPrice: "السعر الكلي",
    createGoal: "+ إنشاء هدف",
    addPayment: "+ إضافة دفعة",
    saved: "تم توفيره",
    left: "المتبقي",
    deleteConfirm: "هل أنت متأكد؟",
    clearData: "مسح جميع البيانات",
    dir: "rtl"
  },
  iq: {
    addPerson: "ضيف شخص جديد",
    namePlaceholder: "اكتب الاسم...",
    selectPerson: "اختار الشخص",
    amount: "اشگد المبلغ؟",
    note: "ملاحظة",
    saveBtn: "حفظ المبلغ",
    goalsTitle: "الأهداف المفتوحة",
    goalName: "اسم الهدف",
    goalPrice: "السعر الكلي",
    createGoal: "+ سوي هدف جديد",
    addPayment: "حفظ المبلغ",
    saved: "المحفوظ",
    left: "اشگد باقي؟",
    deleteConfirm: "متأكد تريد تمسح؟",
    clearData: "مسح كل شي",
    dir: "rtl"
  },
  ku: {
    addPerson: "١ كەسى نوێ زياد بكە",
    namePlaceholder: "٢ ناوی کەسەکە",
    selectPerson: "٣ کەسەکە هەلبژێرە",
    amount: "٤ بری پارەکە",
    note: "٥ تێبينێ",
    goalsTitle: "٦ ئامانجى چاڵاک",
    goalName: "ناوی ئامانج",
    goalPrice: "٧ کۆی گشتی",
    createGoal: "+ دروستکردنی ئامانج",
    addPayment: "٩ سەيڤ کردن",
    saved: "سەیڤ کراوە",
    left: "١٠ چەند ماوەتەوە",
    deleteConfirm: "دڵنیای؟",
    clearData: "پاککردنەوەی هەموو داتاکان",
    dir: "rtl"
  }
};

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  updateUI();
}

function saveData() {
  localStorage.setItem("walletData", JSON.stringify(data));
}

function addPerson() {
  const nameInput = document.getElementById("personName");
  const name = nameInput.value.trim();
  if (!name || data[name]) return alert("Error");
  data[name] = { USD: 0, IQD: 0, goals: [], transactions: [] };
  nameInput.value = "";
  saveData();
  updateUI();
}

function addTransaction() {
  const person = document.getElementById("personSelect").value;
  const amount = Number(document.getElementById("amount").value);
  const currency = document.getElementById("currency").value;
  const note = document.getElementById("note").value || "";
  if (!person || !amount) return;
  data[person][currency] += amount;
  data[person].transactions.push({ amount, currency, note, date: new Date().toLocaleDateString() });
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  saveData();
  updateUI();
}

function addGoal(name) {
  const title = document.getElementById(`gName-${name}`).value || "Goal";
  const target = Number(document.getElementById(`gPrice-${name}`).value) || 0;
  const curr = document.getElementById(`gCurr-${name}`).value;
  if (target <= 0) return;
  if (!data[name].goals) data[name].goals = [];
  data[name].goals.push({ title, target, currency: curr, paid: 0 });
  saveData();
  updateUI();
}

function manualAddGoalPayment(personName, goalIndex) {
  const input = document.getElementById(`addPay-${personName}-${goalIndex}`);
  const addAmount = Number(input.value);
  if (!addAmount || addAmount <= 0) return;
  data[personName].goals[goalIndex].paid = (data[personName].goals[goalIndex].paid || 0) + addAmount;
  input.value = "";
  saveData();
  updateUI();
}

function deleteGoal(personName, index) {
  if(confirm(translations[currentLang].deleteConfirm)) {
    data[personName].goals.splice(index, 1);
    saveData();
    updateUI();
  }
}

function deletePerson(name) {
  if(confirm(translations[currentLang].deleteConfirm)) {
    delete data[name];
    saveData();
    updateUI();
  }
}

function clearAllData() {
    if(confirm(translations[currentLang].deleteConfirm)) {
        data = {};
        saveData();
        updateUI();
    }
}

function updateUI() {
  const t = translations[currentLang];
  document.body.dir = t.dir;
  
  // Update static UI text
  document.getElementById("titleAddPerson").textContent = t.addPerson;
  document.getElementById("personName").placeholder = t.namePlaceholder;
  document.getElementById("titleTransaction").textContent = t.saveBtn;
  document.getElementById("amount").placeholder = t.amount;
  document.getElementById("note").placeholder = t.note;
  document.getElementById("btnSave").textContent = t.saveBtn;
  document.getElementById("btnClear").textContent = t.clearData;

  const select = document.getElementById("personSelect");
  const accounts = document.getElementById("accounts");
  if (!select || !accounts) return;

  const currentSelection = select.value;
  select.innerHTML = `<option value="" disabled selected>${t.selectPerson}</option>`;
  accounts.innerHTML = "";

  for (let name in data) {
    const opt = document.createElement("option");
    opt.value = name; opt.textContent = name;
    select.appendChild(opt);

    let goalsHTML = "";
    (data[name].goals || []).forEach((goal, index) => {
      const paid = goal.paid || 0;
      const percent = Math.min((paid / goal.target) * 100, 100);
      const remaining = goal.target - paid;
      
      goalsHTML += `
        <div style="background:#fff; padding:12px; border-radius:10px; margin-bottom:12px; border:1px solid #e2e8f0; text-align:initial;">
          <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:bold;">
            <span>🎯 ${goal.title}</span>
            <button onclick="deleteGoal('${name}', ${index})" style="background:none; border:none; color:#f56565;">✕</button>
          </div>
          <div style="font-size:0.75rem; color:#718096; margin:4px 0;">${goal.target.toLocaleString()} ${goal.currency}</div>
          <div style="background:#e2e8f0; height:10px; border-radius:5px; overflow:hidden; margin:10px 0;">
            <div style="background:#48bb78; height:100%; width:${percent}%; transition:0.5s;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:bold;">
            <span>${t.saved}: ${paid.toLocaleString()}</span>
            <span style="color:#e53e3e;">${t.left}: ${remaining.toLocaleString()}</span>
          </div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <input type="number" id="addPay-${name}-${index}" placeholder="${t.addPayment}" style="flex:2; font-size:0.75rem; padding:8px; border:1px solid #cbd5e0; border-radius:6px;">
            <button onclick="manualAddGoalPayment('${name}', ${index})" style="flex:1; background:#48bb78; color:white; font-size:1.2rem; border-radius:6px; border:none; font-weight:bold;">+</button>
          </div>
        </div>
      `;
    });

    const div = document.createElement("div");
    div.className = "account-card";
    div.style.textAlign = "initial";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="font-size:1.2rem;">👤 ${name}</strong>
        <button onclick="deletePerson('${name}')" style="background:none; border:none; color:#ccc;">✕</button>
      </div>
      <div style="font-size:1.4rem; font-weight:bold; margin:8px 0;">$${(data[name].USD || 0).toLocaleString()} <small>USD</small></div>
      <div style="font-size:1.1rem; color:#4a5568; margin-bottom:15px;">${(data[name].IQD || 0).toLocaleString()} <small>IQD</small></div>
      
      <div style="background:#edf2f7; padding:12px; border-radius:12px;">
        <h3 style="font-size:0.75rem; margin-bottom:10px; color:#4a5568;">${t.goalsTitle}</h3>
        ${goalsHTML || '<div style="font-size:0.7rem; color:#a0aec0; text-align:center; padding:10px;">---</div>'}
        <div style="margin-top:10px; border-top:1px solid #cbd5e0; padding-top:10px; display:flex; flex-direction:column; gap:8px;">
           <input type="text" id="gName-${name}" placeholder="${t.goalName}" style="padding:8px; border-radius:6px; border:1px solid #cbd5e0;">
           <div style="display:flex; gap:5px;">
             <input type="number" id="gPrice-${name}" placeholder="${t.goalPrice}" style="flex:2; padding:8px; border-radius:6px; border:1px solid #cbd5e0;">
             <select id="gCurr-${name}" style="flex:1; border-radius:6px; border:1px solid #cbd5e0; background:white;">
                <option value="USD">USD</option>
                <option value="IQD">IQD</option>
             </select>
           </div>
           <button onclick="addGoal('${name}')" style="background:#2d3748; color:white; font-size:0.8rem; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">${t.createGoal}</button>
        </div>
      </div>
    `;
    accounts.appendChild(div);
  }
  if (currentSelection && data[currentSelection]) select.value = currentSelection;
}

updateUI();
