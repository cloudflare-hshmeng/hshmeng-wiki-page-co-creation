const originalTitle = document.title; // 保存原始标题
let titleTimer;

document.addEventListener('visibilitychange', () => {
    clearTimeout(titleTimer); // 清除旧的计时器，避免冲突

    if (document.hidden) {
        // 用户离开页面
        document.title = `你别走吖 Σ(っ °Д °;) - ${originalTitle}`;
    } else {
        // 用户回到页面
        document.title = `你可算回来了 (｡•ˇ‸ˇ•｡) - ${originalTitle}`;
        // 2秒后恢复原标题
        titleTimer = setTimeout(() => {
            document.title = originalTitle;
        }, 2000);
    }
});