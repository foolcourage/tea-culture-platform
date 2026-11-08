// 茶文化视频互动脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取视频容器元素
    const videoContainer = document.getElementById('tea-video-container');
    
    // 设置鼠标悬停样式，让用户知道可以点击
    videoContainer.style.cursor = 'pointer';
    
    // 视频点击跳转到新页面
    videoContainer.addEventListener('click', function() {
        // 跳转到茶文化视频画廊页面
        window.location.href = '/tea-video-gallery/';
    });
    
    // 鼠标悬停效果
    videoContainer.addEventListener('mousemove', function(e) {
        // 计算相对位置
        const rect = videoContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // 应用轻微的3D旋转效果
        videoContainer.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 10}deg) rotateX(${(0.5 - y) * 5}deg)`;
    });
    
    // 鼠标离开效果
    videoContainer.addEventListener('mouseleave', function() {
        videoContainer.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
}); 