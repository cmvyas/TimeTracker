chrome.action.onClicked.addListener(function (tab) {
  const currentTotal = localStorage.getItem("currentTotal") || 0;
  chrome.storage.local.set({ currentTotal: currentTotal }, function () {
    chrome.tabs.create({ url: "http://127.0.0.1:5500/weekly.html" });
  });
});
