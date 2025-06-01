const filter = {
    urls: ["https://chatgpt.com/backend-api/*"]
};

const extraInfoSpec = ["requestHeaders", "extraHeaders"];


async function incrementModelCount(modelName) {
    console.log("In increment model count");

  const { modelCounts = {} } = await chrome.storage.local.get("modelCounts");


  const current = modelCounts[modelName] || 0;
  modelCounts[modelName] = current + 1;


  await chrome.storage.local.set({ modelCounts });

  console.log(`Param "${modelName}" count is now ${modelCounts[modelName]}`);
}

chrome.webRequest.onBeforeRequest.addListener(
  async details => {
    if (details.method === "POST" && details.requestBody?.raw) {
      const chunk = details.requestBody.raw[0];
      const bodyText = new TextDecoder("utf-8").decode(chunk.bytes);
        console.log("in the listener");
 
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
