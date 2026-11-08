// 主脚本文件
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏响应式适配
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
}); 