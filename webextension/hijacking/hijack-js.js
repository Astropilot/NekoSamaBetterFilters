var hijackCounter = 0;

// Source: https://stackoverflow.com/a/59518023
new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === 1 && addedNode.matches('script:not([src]):not([id])')) {
                if (addedNode.textContent.includes('myLazyLoad')) {
                    const request = new XMLHttpRequest();
                    request.open('GET', chrome.runtime.getURL('animes/better-filters.js'), false);
                    request.send();

                    addedNode.textContent = request.responseText;
                    hijackCounter++;
                }
            } else if (addedNode.nodeType === 1 && addedNode.matches('script[id="template"]')) {
                const request = new XMLHttpRequest();
                request.open('GET', chrome.runtime.getURL('animes/template.html'), false);
                request.send();

                addedNode.textContent = request.responseText;
                hijackCounter++;
            }
        }
        if (hijackCounter === 2) {
            observer.disconnect();
            return;
        }
    }
})
.observe(document.documentElement, { childList: true, subtree: true });
