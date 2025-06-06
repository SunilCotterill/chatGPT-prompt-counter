const btn  = document.getElementById('reset')
btn.addEventListener('click', async () => {
  console.log("Reset button clicked")
  await chrome.runtime.sendMessage('reset');
  renderModelCounts();
});



const list = document.getElementById("countsList");
async function renderModelCounts(timeFrame) {
  const { modelCounts = {} } = await chrome.storage.local.get("modelCounts");
  list.innerHTML = "";  // clear
  console.log(`${timeFrame}`)

  // Yes this is not optimal however this is an app for me
  if (timeFrame == "week"){
     for (let [model, count] of Object.entries(modelCounts)) {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const cutoff = now - oneDay;

      // Filter and count
      const countLast24h = count.filter(ts => ts >= cutoff).length;
      const li = document.createElement("li");
      li.textContent = `${model}: ${countLast24h}`;
      list.appendChild(li);
    }

  }else if (timeFrame == "day"){
     for (let [model, count] of Object.entries(modelCounts)) {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const cutoff = now - oneWeek;

      // Filter and count
      const countLastWeek = count.filter(ts => ts >= cutoff).length;
      const li = document.createElement("li");
      li.textContent = `${model}: ${countLastWeek}`;
      list.appendChild(li);
    }
  }
  
  else{
    for (let [model, count] of Object.entries(modelCounts)) {
      const li = document.createElement("li");
      li.textContent = `${model}: ${count.length}`;
      list.appendChild(li);
    }
  }
}

const select = document.getElementById('time period')
select.addEventListener('change', async (event) =>{
  console.log(`BEANS ${event.target.value}`)
  renderModelCounts(event.target.value)
})

// Initial render
document.addEventListener("DOMContentLoaded", renderModelCounts);

// Update when storage changes elsewhere
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.modelCounts) {
    renderModelCounts();
  }
});
