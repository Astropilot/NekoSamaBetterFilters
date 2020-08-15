const onNewNode = (addedNode) => {
    if (addedNode.nodeType === 1 && addedNode.matches('script[data-cfasync="false"]')) {
        addedNode.textContent = '';
        return true;
    } else if (addedNode.nodeType === 1 && addedNode.matches('script[type="text/javascript"]')) {
        if (addedNode.textContent.trim().startsWith('var vsuri')) {
            addedNode.textContent = addedNode.textContent.replace(
                'var safeloadPBAFS = false;',
                'var safeloadPBAFS = true;'
            ).replace(
                'document.head.appendChild(importFAB);',
                ''
            );
            return true;
        }
    }
    return false;
};

hijackDOM(document.documentElement, 2, onNewNode);

const sendEvent = () => {
    jQuery(document).on('ready', function () {
        jQuery('.yet-another-overlay').remove();
        jQuery(document).trigger('manual-trigger');
    });
};

document.addEventListener("DOMContentLoaded", function() {
    runInPageContext(sendEvent, true);
});
