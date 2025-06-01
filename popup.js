// // Grab references to our DOM nodes
// const btn     = document.getElementById('btn');
// const display = document.getElementById('count');

// // 1. Fetch & render the count
// async function renderCount() {
//   const { clickCount = 0 } = await chrome.storage.local.get('clickCount');
//   display.textContent = clickCount;
// }

// // 2. When the button is clicked, tell the background to increment,
// //    then re-render the updated count.
// btn.addEventListener('click', async () => {
//   await chrome.runtime.sendMessage('increment');
//   // either re-fetch here:
//   renderCount();
//   // —or rely on storage.onChanged below to fire.
// });

// // 3. Update the display if the stored value changes externally
// chrome.storage.onChanged.addListener((changes, area) => {
//   if (area === 'local' && changes.clickCount) {
//     display.textContent = changes.clickCount.newValue;
//   }
// });

// // 4. When the popup first loads, show the current count
// document.addEventListener('DOMContentLoaded', renderCount);

// popup.js
const list = document.getElementById("countsList");

async function renderModelCounts() {
  const { modelCounts = {} } = await chrome.storage.local.get("modelCounts");
  list.innerHTML = "";  // clear

  // For each param: create a list item
  for (let [model, count] of Object.entries(modelCounts)) {
    const li = document.createElement("li");
    li.textContent = `${model}: ${count}`;
    list.appendChild(li);
  }
}

// Initial render
document.addEventListener("DOMContentLoaded", renderModelCounts);

// Update when storage changes elsewhere
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.modelCounts) {
    renderModelCounts();
  }
});
