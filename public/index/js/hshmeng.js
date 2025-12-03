// 要匹配的关键字
const secret = "hshmeng";
let buffer = "";

document.addEventListener("keydown", function(event) {
    buffer += event.key.toLowerCase(); // 统一转小写

    // 只保留和 secret 一样长度的最后一段
    if (buffer.length > secret.length) {
        buffer = buffer.slice(-secret.length);
    }

    // 检查是否输入了完整关键字
    if (buffer === secret) {
        window.location.href = "../../index.html";
    }
});