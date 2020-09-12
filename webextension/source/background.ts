const msgSenders: { [key: string]: any } = {};

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.from) {
      msgSenders[msg.from] = sender.tab!!.id;
  }
  if (msg.to) {
    chrome.tabs.sendMessage(msgSenders[msg.to], msg.msg);
  }
});
