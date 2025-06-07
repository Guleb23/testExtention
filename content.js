const pre = document.querySelectorAll("pre");
[...pre].forEach(el => {
    const root = document.createElement("div");
    root.style.position = "relative";
    const shadowRoot = root.attachShadow({ mode: 'open' })
    console.log(el);
    const button = document.createElement('button');
    button.innerHTML = "copy";
    button.type = "button";
    button.style.position = "absolute";
    button.style.top = "5px";
    button.style.right = "5px";
    shadowRoot.prepend(button);
    el.prepend(root);
    button.addEventListener("click", () => {

        navigator.clipboard.writeText(el.innerText).then(() => {
            notify();
        });
    })
})

function notify() {
    const scriptEl = document.createElement("script");
    scriptEl.src = chrome.runtime.getURL("execute.js");
    document.body.appendChild(scriptEl);
    scriptEl.onLoad = () => {
        scriptEl.remove();
    }
}


chrome.runtime.onMessage.addListener((req, info, cb) => {
    if (req.action == "copy-all") {

        const allCode = getAllCode();
        navigator.clipboard.writeText(allCode).then(() => {
            notify();
            cb(allCode);
        });
        return true

    }
})


function getAllCode() {
    return [...pre].map((i) => {
        return i.innerText;
    }).join("");
}