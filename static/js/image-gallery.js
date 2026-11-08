document.addEventListener('DOMContentLoaded', function() {
    // 获取图片元素
    const images = document.querySelectorAll('.image-gallery .image');
    const indicators = document.querySelectorAll('.gallery-indicators .indicator');
    const prevBtn = document.querySelector('.gallery-nav.prev-btn');
    const nextBtn = document.querySelector('.gallery-nav.next-btn');
    const rotationHint = document.querySelector('.rotation-hint');
    
    // 创建音效对象
    const slideSound = new Audio();
    slideSound.src = '/static/sounds/slide.mp3';
    slideSound.volume = 0.5;
    
    // 创建爱茶对象 - 新增茶壶倒茶效果音效
    const teaSound = new Audio();
    teaSound.src = '/static/sounds/tea-pour.mp3';
    teaSound.volume = 0.3;
    
    // 音效备选方案（如果上面的音效文件不存在）
    slideSound.onerror = function() {
        // 使用Web Audio API创建简单音效
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        slideSound.play = function() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                300, audioContext.currentTime + 0.2
            );
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01, audioContext.currentTime + 0.2
            );
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        };
    };
    
    // 茶声音备选方案
    teaSound.onerror = function() {
        teaSound.play = function() {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 创建更复杂的倒茶音效
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            oscillator.type = 'triangle';
            
            // 设置频率变化 - 模拟倒茶声音
            const now = audioContext.currentTime;
            oscillator.frequency.setValueAtTime(150, now);
            oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);
            oscillator.frequency.linearRampToValueAtTime(300, now + 0.3);
            oscillator.frequency.linearRampToValueAtTime(200, now + 0.4);
            
            // 设置滤波器
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            filter.Q.value = 10;
            
            // 设置音量变化
            gainNode.gain.setValueAtTime(0.01, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.1, now + 0.3);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            
            // 连接节点
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 启动和停止
            oscillator.start(now);
            oscillator.stop(now + 0.5);
        };
    };
    
    let currentIndex = 0;
    const totalImages = images.length;
    let autoPlayInterval;
    let isAnimating = false; // 添加动画状态标记，防止快速点击
    
    // 初始设置
    images[currentIndex].classList.add('active');
    updateIndicators();
    
    // 自动播放函数
    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000); // 增加时间间隔，给旋转动画更多展示时间
    }
    
    // 切换到下一张图片
    function nextSlide() {
        if (isAnimating) return; // 如果正在动画中，不执行新的切换
        rotateImages('next');
    }
    
    // 切换到上一张图片
    function prevSlide() {
        if (isAnimating) return; // 如果正在动画中，不执行新的切换
        rotateImages('prev');
    }
    
    // 图片切换主函数
    function rotateImages(direction) {
        // 设置锁定状态，但不立即返回，确保可以立即切换
        isAnimating = true; 
        
        // 隐藏旋转提示
        if (rotationHint) {
            rotationHint.style.opacity = '0';
            setTimeout(() => {
                rotationHint.style.opacity = '0.7';
            }, 1000);
        }
        
        // 当前活动图片
        let current = images[currentIndex];
        
        // 计算下一张图片的索引
        if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        } else {
            currentIndex = (currentIndex + 1) % totalImages;
        }
        
        let next = images[currentIndex];
        
        // 移除所有类名
        images.forEach(img => {
            img.classList.remove('active', 'prev');
        });
        
        // 为当前图片添加prev类
        current.classList.add('prev');
        
        // 为下一张图片添加active类
        next.classList.add('active');
        
        // 播放随机音效 - 有50%的概率播放倒茶声音
        try {
            if (Math.random() > 0.5) {
                slideSound.currentTime = 0;
                slideSound.play().catch(e => console.log('音效播放失败:', e));
            } else {
                teaSound.currentTime = 0;
                teaSound.play().catch(e => console.log('茶音效播放失败:', e));
            }
        } catch(e) {
            console.log('音效播放出错:', e);
        }
        
        // 更新指示器 - 立即执行，确保与图片同步
        updateIndicators();
        
        // 重置自动播放
        startAutoPlay();
        
        // 缩短动画锁定时间，确保响应更快
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // 更新指示器 - 修复同步问题
    function updateIndicators() {
        // 确保所有指示器都被清除active类
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
        });
        
        // 为当前索引的指示器添加active类
        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.add('active');
        }
        
        console.log("指示器已更新，当前索引:", currentIndex); // 添加调试信息
    }
    
    // 简化按钮点击处理，确保直接响应
    function handleNavClick(direction) {
        if (direction === 'next') {
            nextSlide();
        } else {
            prevSlide();
        }
    }
    
    // 绑定导航按钮事件 - 简化处理逻辑
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleNavClick('next');
        });
        
        // 确保图标也能点击
        const nextIcon = nextBtn.querySelector('i');
        if (nextIcon) {
            nextIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleNavClick('next');
            });
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleNavClick('prev');
        });
        
        // 确保图标也能点击
        const prevIcon = prevBtn.querySelector('i');
        if (prevIcon) {
            prevIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleNavClick('prev');
            });
        }
    }
    
    // 绑定指示器点击事件 - 点击直接跳转到对应图片
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (index !== currentIndex && !isAnimating) {
                // 保存当前索引
                const prevIndex = currentIndex;
                currentIndex = index;
                
                // 移除所有类名
                images.forEach(img => {
                    img.classList.remove('active', 'prev');
                });
                
                // 为当前图片添加prev类
                images[prevIndex].classList.add('prev');
                
                // 为新图片添加active类
                images[currentIndex].classList.add('active');
                
                // 隐藏旋转提示
                if (rotationHint) {
                    rotationHint.style.opacity = '0';
                    setTimeout(() => {
                        rotationHint.style.opacity = '0.7';
                    }, 1000);
                }
                
                // 播放音效
                try {
                    if (Math.random() > 0.5) {
                        slideSound.currentTime = 0;
                        slideSound.play().catch(e => console.log('音效播放失败:', e));
                    } else {
                        teaSound.currentTime = 0;
                        teaSound.play().catch(e => console.log('茶音效播放失败:', e));
                    }
                } catch(e) {
                    console.log('音效播放出错:', e);
                }
                
                // 立即更新指示器
                updateIndicators();
                
                // 重置自动播放
                startAutoPlay();
                
                // 添加动画锁定 - 缩短时间
                isAnimating = true;
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            }
        });
    });
    
    // 添加触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    const galleryContainer = document.querySelector('.gallery-container');
    
    if (galleryContainer) {
        galleryContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        galleryContainer.addEventListener('touchend', function(e) {
            if (isAnimating) return;
            
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // 当鼠标悬停在轮播上时，暂停自动播放
        galleryContainer.addEventListener('mouseenter', function() {
            clearInterval(autoPlayInterval);
        });
        
        // 当鼠标离开轮播时，恢复自动播放
        galleryContainer.addEventListener('mouseleave', function() {
            startAutoPlay();
        });
        
        // 确保导航按钮始终可见
        galleryContainer.addEventListener('mousemove', function() {
            if (prevBtn) prevBtn.style.opacity = '1';
            if (nextBtn) nextBtn.style.opacity = '1';
            
            // 3秒后隐藏导航按钮
            clearTimeout(window.navTimeout);
            window.navTimeout = setTimeout(() => {
                if (prevBtn) prevBtn.style.opacity = '0.7';
                if (nextBtn) nextBtn.style.opacity = '0.7';
            }, 3000);
        });
    }
    
    function handleSwipe() {
        // 判断滑动方向和距离（至少50px）
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // 向左滑动，下一张
        } else if (touchEndX > touchStartX + 50) {
            prevSlide(); // 向右滑动，上一张
        }
    }
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (isAnimating) return; // 如果正在动画中，不处理键盘事件
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // 开始自动播放
    startAutoPlay();
    
    // 当用户离开页面或切换到其他标签时，暂停自动播放
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(autoPlayInterval);
        } else {
            startAutoPlay();
        }
    });
}); 