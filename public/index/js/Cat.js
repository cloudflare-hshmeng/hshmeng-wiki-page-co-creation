// 获取小猫和气泡元素
const cat = document.getElementById('cat');
const speech = document.getElementById('speech');

// 小猫说话的随机语句
const messages = [
    "你有试过快速点击首页的标题吗？",
    "Giao!!!",
    "试着在首页打出“hshmeng”试试？",
    "🐔你太美~~~哦~baby~~~",
    "在天愿作比翼鸟 在地愿为连理枝",
    "鼠标悬浮在首页的头像上会发生什么？"
];

let side = "left";   // 当前小猫出现的方向（默认左边）
let showTimer;       // 定时器，用来控制小猫自动消失

// 小猫出现
function showCat() {
    // 随机决定小猫在左边还是右边出现
    side = Math.random() > 0.5 ? "left" : "right";
    cat.className = "cat " + side + " half-head " + (side === "left" ? "rotate-left" : "rotate-right");

    // 随机一个高度（距离页面顶部），避免每次出现都在同一个位置
    const maxHeight = window.innerHeight - 100; // 保证不会超出底部
    const randomTop = Math.floor(Math.random() * maxHeight) + 20; // 距离顶部至少 20px
    cat.style.top = randomTop + "px";

    // 设置气泡跟随小猫位置
    speech.style.top = (randomTop + 10) + "px";

    // 延时 50ms 后让小猫探出（避免 className 设置时过快无动画）
    setTimeout(() => {
        cat.classList.add("show-" + side);
    }, 50);

    // 5 秒后如果没有点击，就自动缩回去
    showTimer = setTimeout(hideCat, 5000);
}

// 小猫缩回
function hideCat() {
    // 移除探出和全头状态
    cat.classList.remove("show-" + side, "full-head");
    // 隐藏气泡
    speech.style.display = "none";
    // 10 秒后再次出现
    setTimeout(showCat, 10000);
}

// 点击小猫触发
cat.addEventListener("click", () => {
    clearTimeout(showTimer); // 阻止自动消失
    cat.classList.add("full-head"); // 小猫整个头露出来

    // 随机选择一句话
    const msg = messages[Math.floor(Math.random() * messages.length)];
    speech.textContent = msg;
    speech.style.display = "block";

    // 根据左右方向调整气泡位置
    if (side === "left") {
        speech.style.left = "70px"; // 左边出现，气泡在小猫右侧
        speech.style.right = "";
    } else {
        speech.style.right = "70px"; // 右边出现，气泡在小猫左侧
        speech.style.left = "";
    }

    // 说话 2 秒后缩回
    setTimeout(hideCat, 2000);
});

// 页面加载 1 秒后第一次出现
setTimeout(showCat, 1000);