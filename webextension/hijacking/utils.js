// Changing DOM - Source: https://stackoverflow.com/a/59518023

/* eslint no-unused-vars: ["error", { varsIgnorePattern: "[hijackDOM|runInPageContext]" }] */

function hijackDOM(target, matches, nodeCallback) {
  let hijackCounter = 0;

  new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (nodeCallback(addedNode) === true) {
          hijackCounter++;
        }
      }

      if (hijackCounter === matches) {
        observer.disconnect();
        return;
      }
    }
  })
    .observe(target, {childList: true, subtree: true});
}

// Sandbox Breaking
// Source: Source: https://github.com/intoli/intoli-article-materials/blob/master/articles/sandbox-breakout/extension/sandbox-breakout.js

function runInPageContext(method, autoRemove, ...args) {
  const stringifiedMethod = method instanceof Function ? method.toString() : `() => { ${method} }`;

  const stringifiedArgs = JSON.stringify(args);

  const scriptContent = `
  (${stringifiedMethod})(...${stringifiedArgs});
  ` + (autoRemove ? 'document.currentScript.parentElement.removeChild(document.currentScript);' : '');

  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = scriptContent;
  document.documentElement.prepend(scriptElement);
}
