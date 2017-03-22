document.addEventListener("DOMContentLoaded", () => {

    function getMessage() {
        return document.getElementById("message");
    }

    function getTextArea() {
        return document.getElementById("timedtext");
    }

    chrome.devtools.network.onNavigated.addListener(() => {
        const textarea = getTextArea();
        textarea.innerHTML = null;
    });

    chrome.devtools.network.onRequestFinished.addListener(request => {
        if (/timedtext/g.test(request.request.url)) {
            request.getContent(content => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, "text/xml").documentElement;
                const textarea = getTextArea();
                textarea.value = null;
                setTimeout(() => {
                    // 更新されてる感を出すための遅延
                    textarea.value = doc.textContent.trim().split("\n").filter(line => !!line.trim()).join("\n");
                }, 300);
            });
        }
    });

    document.getElementById("buttonCopy").addEventListener("click", (e) => {
        const textarea = getTextArea();
        textarea.select();
        document.execCommand("copy");
        const message = getMessage();
        message.innerHTML = "Copied!";
        message.hidden = null;
        setTimeout(() => {
            message.innerHTML = null;
            message.hidden = true;
        }, 5000);
    });
});
