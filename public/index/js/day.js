function createFallingElement(symbol) {
    const el = document.createElement("div");
    el.classList.add("falling");
    el.textContent = symbol.char;

    // 随机横向位置，避免符号被遮挡
    const randomLeft = Math.random() * 100;
    const randomRight = 100 - randomLeft; // 保证右边符号不完全被截断
    const offset = 5; // 可以根据需要调整，让符号不完全贴边

    // 随机决定从左边或右边开始
    if (Math.random() > 0.5) {
        el.style.left = `calc(${randomLeft}vw - 10vw)`; // 从左边随机位置开始
    } else {
        el.style.right = `calc(${randomRight}vw - ${offset}vw)`; // 从右边随机位置开始
    }

    // 随机大小
    el.style.fontSize = (Math.random() * 20 + 10) + "px";

    // 自动配色
    el.style.color = symbol.color;

    // 随机动画时长
    const duration = Math.random() * 5 + 3;
    el.style.animationDuration = duration + "s";

    document.body.appendChild(el);

    // 动画结束后移除
    setTimeout(() => el.remove(), duration * 1000);
}

// 获取今天的月和日
const today = new Date();
console.log(today.toLocaleDateString());

// 日期对应符号和颜色的映射表
const dateSymbols = {
    "1-1": { char: "🎉", color: "red" },// 元旦
    // "1-26": { char: "🍲", color: "brown" },// 腊八
    "2-14": { char: "💘", color: "red" },// 情人节
    "2-16": { char: "🎇", color: "red" },// 除夕
    "2-17": { char: "🎆", color: "red" },// 春节
    "3-3": { char: "🏮", color: "orange" },// 元宵
    "3-8": { char: "🌸", color: "pink" },// 妇女节
    "4-1": { char: "🤡", color: "yellow" },// 愚人节
    "4-4": { char: "🏃", color: "yellow" },// 青年节
    "4-19": { char: "🌊", color: "cyan" },// 上巳节
    "5-1": { char: "💼", color: "blue" },// 劳动节
    "5-10": { char: "💐", color: "pink" },//母亲节
    "6-1": { char: "🎈", color: "orange" },// 儿童节
    "6-19": { char: "🐉", color: "green" },// 端午节
    "6-21": { char: "👔", color: "blue" },// 父亲节
    "7-1": { char: "🎉", color: "red" },// 建党节
    "8-1": { char: "🎖️", color: "gold" },// 建军节
    "9-10": { char: "🎓", color: "blue" },// 教师
    "9-18": { char: "勿忘“九·一八” 吾辈当自强！", color: "red" },// 918事变
    "10-1": { char: "🇨🇳", color: "red" },// 国庆
    "11-26": { char: "🦃", color: "brown" },// 感恩节
    "12-24": { char: "🎄", color: "green" },// 平安夜
    "12-25": { char: "🎅", color: "red" } // 圣诞节
};

const monthDayKey = `${today.getMonth() + 1}-${today.getDate()}`; // 月份从0开始，所以 +1

const symbol = dateSymbols[monthDayKey];

// 如果今天有对应符号，启用飘落效果
if (symbol) {
    setInterval(() => createFallingElement(symbol), 300);
}
