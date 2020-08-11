/*******************************************************************************
* PROJECT: Neko-Sama Better Filters
*
* AUTHORS: Yohann Martin
*
* DATE: 2020
*
* Copyright (c) 2019 Yohann MARTIN (@Astropilot). All rights reserved.
*
* Licensed under the MIT License. See LICENSE file in the project root for full
* license information.
*******************************************************************************/

// Source: https://stackoverflow.com/a/59518023

new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === 1 && addedNode.matches('script:not([src])')) {
                if (addedNode.textContent.includes('myLazyLoad')) {
                    const request = new XMLHttpRequest();
                    request.open('GET', chrome.runtime.getURL('better-filters.js'), false);
                    request.send();

                    addedNode.textContent = request.responseText;
                    observer.disconnect();
                    return;
                }
            }
        }
    }
})
.observe(document.documentElement, { childList: true, subtree: true });
