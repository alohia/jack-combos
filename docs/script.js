const comboSizeSelect = document.getElementById('comboSize');
const selectsContainer = document.getElementById('number-selects');
const goButton = document.getElementById('goButton');
const resultsPre = document.getElementById('results');
const MAX_NUMBER = 35;

// populate first dropdown
for (let i = 7; i <= MAX_NUMBER; i++) {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = i;
  comboSizeSelect.appendChild(opt);
}

comboSizeSelect.addEventListener('change', () => {
  const count = parseInt(comboSizeSelect.value, 10);
  selectsContainer.innerHTML = '';
  resultsPre.textContent = '';
  goButton.disabled = true;

  for (let i = 0; i < count; i++) {
    const label = document.createElement('label');
    label.textContent = `Number ${i + 1}`;
    const select = document.createElement('select');
    select.dataset.index = i;
    select.disabled = i !== 0;
    select.addEventListener('change', onNumberChange);
    label.appendChild(select);
    selectsContainer.appendChild(label);
  }
  populateSelect(0);
});

function onNumberChange(e) {
  const index = parseInt(e.target.dataset.index, 10);
  const next = selectsContainer.querySelector(`select[data-index="${index + 1}"]`);
  if (next) {
    next.disabled = false;
    populateSelect(index + 1);
  }
  // repopulate following selects to avoid duplicates
  const total = selectsContainer.querySelectorAll('select').length;
  for (let i = index + 1; i < total; i++) {
    populateSelect(i);
  }
  checkReady();
}

function populateSelect(index) {
  const select = selectsContainer.querySelector(`select[data-index="${index}"]`);
  if (!select) return;
  const used = Array.from(selectsContainer.querySelectorAll('select'))
    .slice(0, index)
    .map(s => parseInt(s.value, 10))
    .filter(v => !isNaN(v));
  select.innerHTML = '<option value="" disabled selected>Select...</option>';
  for (let i = 1; i <= MAX_NUMBER; i++) {
    if (!used.includes(i)) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      select.appendChild(opt);
    }
  }
}

function checkReady() {
  const allSelected = Array.from(selectsContainer.querySelectorAll('select'))
    .every(sel => sel.value);
  goButton.disabled = !allSelected;
}

function getCombinations(arr, k) {
  const results = [];
  const combo = [];
  function helper(start) {
    if (combo.length === k) {
      results.push(combo.slice());
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1);
      combo.pop();
    }
  }
  helper(0);
  return results;
}

goButton.addEventListener('click', () => {
  const numbers = Array.from(selectsContainer.querySelectorAll('select'))
    .map(s => parseInt(s.value, 10));
  const combos = getCombinations(numbers, 7);
  resultsPre.textContent = combos.map(c => c.join(', ')).join('\n');
});
