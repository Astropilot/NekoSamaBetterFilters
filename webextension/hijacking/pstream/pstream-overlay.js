new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === 1 && addedNode.matches('script[data-cfasync="false"]')) {
                addedNode.textContent = '';
                observer.disconnect();
                return;
            }
        }
    }
})
.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll('.yet-another-overlay').forEach(el => el.remove());
});
