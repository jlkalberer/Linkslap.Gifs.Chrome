function sendShowModalMessage() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: "showModal" }, function(response) {
		});
	});
}

chrome.contextMenus.create({"title": "Linkslap Gif Search", "contexts":['all', 'page', 'selection','editable'], "onclick": sendShowModalMessage});

chrome.runtime.onMessage.addListener(function(message, sender) {
    chrome.tabs.sendMessage(sender.tab.id, message);
});