new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === 1 && addedNode.matches('script[data-cfasync="false"]')) {
                addedNode.textContent = '';
                observer.disconnect();
                return;
            } else if (addedNode.nodeType === 1 && addedNode.matches('script[type="text/javascript"]')) {
                if (addedNode.textContent.trim().startsWith('var vsuri')) {
                    addedNode.textContent = addedNode.textContent.replace(
                        'var safeloadPBAFS = false;',
                        'var safeloadPBAFS = true;'
                    ).replace(
                        'document.head.appendChild(importFAB);',
                        ''
                    );
                }
            }
        }
    }
})
.observe(document.documentElement, { childList: true, subtree: true });

const sendEvent = () => {
    jQuery(document).on('ready', function () {
        jQuery('.yet-another-overlay').remove();
        jQuery(document).trigger('manual-trigger');
    });
};

document.addEventListener("DOMContentLoaded", function() {
    runInPageContext(sendEvent);
});
