document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector("header h1");
    const secretCard = document.querySelector("#secretCard"); // HSHMENG的小屋
    let clickCount = 0;
    let timer;

    title.addEventListener("click", () => {
    clickCount++;
    clearTimeout(timer);
    // 2秒内点够3次才算
    timer = setTimeout(() => clickCount = 0, 2000);

    if (clickCount >= 3) {
    secretCard.style.display = "block";  // 显示
    clickCount = 0; // 重置
}
});
});