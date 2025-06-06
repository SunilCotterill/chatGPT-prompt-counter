const filter = {
    urls: ["https://chatgpt.com/backend-api/*"]
};

const extraInfoSpec = ["requestHeaders", "extraHeaders"];


async function incrementModelCount(modelName) {
    console.log("In increment model count");

  const { modelCounts = {} } = await chrome.storage.local.get("modelCounts");


  const current = modelCounts[modelName] || [];
  modelCounts[modelName].push(Date.now());


  await chrome.storage.local.set({ modelCounts });

  console.log(`Param "${modelName}" count is now ${modelCounts[modelName]}`);
}

chrome.webRequest.onBeforeRequest.addListener(
  async details => {
    if (details.method === "POST" && details.requestBody?.raw) {
      const chunk = details.requestBody.raw[0];
      const bodyText = new TextDecoder("utf-8").decode(chunk.bytes);
 
      try {
        const json = JSON.parse(bodyText);

        if (json.model) {
          await incrementModelCount(json.model);
        }
      } catch (e) {
        // TODO: ADD FALL BACK
        // Fallback: form-encoded parsing
        // const params = new URLSearchParams(bodyText);
        // for (let [k, v] of params.entries()) {
        //   if (k === "actionType") {
        //     await incrementModelCount(v);
        //   }
        // }
      }
    }
  },
  filter,
  ["requestBody"]
);


async function resetCounts(){
  const { modelCounts = {} } = await chrome.storage.local.get("modelCounts");
  Object.keys(modelCounts).forEach(key => {
    modelCounts[key] = [];
  });
  await chrome.storage.local.set({ modelCounts })
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  console.log("Reset listener")
  if (msg === 'reset') {
    resetCounts();
  }
});