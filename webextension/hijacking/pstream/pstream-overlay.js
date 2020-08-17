const onNewNode = addedNode => {
    if (addedNode.nodeType === 1 && addedNode.matches('script[data-cfasync="false"]')) {
        addedNode.textContent = '';
        return true;
    }

    if (addedNode.nodeType === 1 && addedNode.matches('script[type="text/javascript"]')) {
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

async function hijackPStream() {
    const {antipub} = await optionsStorage.getAll();

    if (antipub) {
        hijackDOM(document.documentElement, 2, onNewNode);

        const sendEvent = () => {
            jQuery(document).on('ready', () => {
                jQuery('.yet-another-overlay').remove();
                jQuery(document).trigger('manual-trigger');
            });
        };

        document.addEventListener('DOMContentLoaded', () => {
            runInPageContext(sendEvent, true);
        });
    }
}

hijackPStream();
