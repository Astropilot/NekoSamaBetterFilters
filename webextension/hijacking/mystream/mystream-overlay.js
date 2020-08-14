new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === 1 && addedNode.matches('script:not([src]):not([type])')) {
                if (addedNode.textContent.trim().startsWith('window.adblock')) {
                    addedNode.textContent = addedNode.textContent.replace(
                        'window.adblock = true;',
                        'window.adblock = false;'
                    );
                } else if (addedNode.textContent.trim().startsWith('window.') && !addedNode.textContent.trim().startsWith('window.HELP_IMPROVE_VIDEOJS')) {
                    addedNode.textContent = addedNode.textContent.replace(
                        'var firstfired=!1',
                        'var firstfired=!0'
                    ).replace(
                        /"actions":\[[0-9,]*\]/g,
                        '"actions":[]'
                    ).replace(
                        't("IFRAME")||t("VIDEO")||t("OBJECT")',
                        '!1'
                    );
                    observer.disconnect();
                    return;
                }
            }
        }
    }
})
.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.querySelector('body > div[style]:empty');
    if (overlay) overlay.remove();
});
