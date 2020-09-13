const senders: { [key: string]: any } = {};

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.nekoFrom && sender.tab && sender.tab.id) {
      senders[message.nekoFrom] = sender.tab!!.id;
  }
  if (message.nekoTo && message.nekoTo in senders) {
    chrome.tabs.sendMessage(senders[message.nekoTo], message.msg);
  }
});
