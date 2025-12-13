(function(){
    const fab = document.getElementById('qrFab');
    const popup = document.getElementById('qrPopup');
    const overlay = document.getElementById('qrOverlay');

    function openPopup(){
        popup.classList.add('visible');
        overlay.classList.add('visible');
        popup.setAttribute('aria-hidden','false');
    }
    function closePopup(){
        popup.classList.remove('visible');
        overlay.classList.remove('visible');
        popup.setAttribute('aria-hidden','true');
    }
    function togglePopup(){
        if(popup.classList.contains('visible')) closePopup(); else openPopup();
    }

    // 点击按钮切换
    fab.addEventListener('click', function(e){
        e.stopPropagation();
        togglePopup();
    });

    // 点击遮罩或页面其他地方关闭
    overlay.addEventListener('click', function(){ closePopup(); });

    // 点击弹窗内部不要关闭
    popup.addEventListener('click', function(e){ e.stopPropagation(); });

    // 在页面任意空白点击也会关闭
    document.addEventListener('click', function(e){
        const target = e.target;
        if (popup.classList.contains('visible')){
            if (!popup.contains(target) && !fab.contains(target)) {
                closePopup();
            }
        }
    });

    // Esc 键关闭
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closePopup(); });

    window.closeQr = closePopup;

})();