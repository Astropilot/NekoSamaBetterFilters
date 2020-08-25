// Changing DOM - Source: https://stackoverflow.com/a/59518023

export function nodeMatchSelector(node: any, selector: string) {
  return node.nodeType === 1 && node.matches(selector);
}

export function nodeContentStartsWith(node: any, token: string) {
  return node.textContent.trim().startsWith(token);
}

export function hijackDOM(target: any, matches: number, nodeCallback: (node: any) => boolean) {
  let hijackCounter = 0;

  new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (nodeCallback(addedNode)) {
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

export function runInPageContext(method: () => void | string, autoRemove: boolean, ...args: any[]) {
  const stringifiedMethod: string = method instanceof Function ? method.toString() : `() => { ${method as string} }`;

  const stringifiedArgs = JSON.stringify(args);

  const scriptContent = `
  (${stringifiedMethod})(...${stringifiedArgs});
  ` + (autoRemove ? 'document.currentScript.parentElement.removeChild(document.currentScript);' : '');

  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = scriptContent;
  document.documentElement.prepend(scriptElement);
}
