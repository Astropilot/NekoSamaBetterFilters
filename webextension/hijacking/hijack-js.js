const onNewNode = (addedNode) => {
    if (addedNode.nodeType === 1 && addedNode.matches('script:not([src]):not([id])')) {
        if (addedNode.textContent.includes('myLazyLoad')) {
            const request = new XMLHttpRequest();
            request.open('GET', browser.runtime.getURL('animes/better-filters.js'), false);
            request.send();

            addedNode.textContent = request.responseText.replace(
                '%NPROGRESS_URL%',
                browser.runtime.getURL('vendors/nprogress/nprogress.min.js')
            );
            return true;
        }
    } else if (addedNode.nodeType === 1 && addedNode.matches('script[id="template"]')) {
        const request = new XMLHttpRequest();
        request.open('GET', browser.runtime.getURL('animes/template.html'), false);
        request.send();

        addedNode.textContent = request.responseText;
        return true;
    }
    return false;
};

hijackDOM(document.documentElement, 2, onNewNode);
