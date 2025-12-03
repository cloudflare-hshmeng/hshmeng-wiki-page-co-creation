document.addEventListener("DOMContentLoaded", () => {
    // 创建 footer
    const footer = document.createElement("footer");
    footer.innerHTML = `
        © 2025 HSHMENG 
        <p>累计访问 <span id="visit-number">加载中...</span> 次</p>
    `;
    document.body.appendChild(footer);

    // 获取访问次数并更新
    fetch('https://stats-kv.hshmeng.dpdns.org/?key=VISIT_WIKI_HSHMENG&add=1')
        .then(res => res.json())
        .then(data => {
            document.getElementById('visit-number').textContent = data.value;
        })
        .catch(err => {
            console.error('获取失败', err);
            document.getElementById('visit-number').textContent = '获取失败';
        });
});
