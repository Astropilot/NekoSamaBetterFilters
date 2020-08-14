// Source: https://github.com/intoli/intoli-article-materials/blob/master/articles/sandbox-breakout/extension/sandbox-breakout.js

const runInPageContext = (method, ...args) => {
    const stringifiedMethod = method instanceof Function ? method.toString() : `() => { ${method} }`;

    const stringifiedArgs = JSON.stringify(args);

    const scriptContent = `
        (${stringifiedMethod})(...${stringifiedArgs});
        document.currentScript.parentElement.removeChild(document.currentScript);
    `;

    const scriptElement = document.createElement('script');
    scriptElement.innerHTML = scriptContent;
    document.documentElement.prepend(scriptElement);
};
