// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 创建主题切换按钮
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.setAttribute('title', '切换白天/黑夜模式');
    themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>'; // 初始图标为月亮图标
    document.body.appendChild(themeSwitcher);
    
    // 检查本地存储中的主题设置
    const currentTheme = localStorage.getItem('theme');
    
    // 如果本地存储有主题设置，应用它
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>'; // 黑夜模式使用太阳图标
        applyDarkModeToAllContainers();
    }
    
    // 点击按钮切换主题
    themeSwitcher.addEventListener('click', function() {
        // 切换暗黑模式类
        document.body.classList.toggle('dark-mode');
        
        // 切换图标
        if (document.body.classList.contains('dark-mode')) {
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>'; // 黑夜模式使用太阳图标
            localStorage.setItem('theme', 'dark');
            applyDarkModeToAllContainers();
        } else {
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>'; // 白天模式使用月亮图标
            localStorage.setItem('theme', 'light');
            removeDarkModeFromAllContainers();
        }
        
        // 显示提示信息
        showThemeChangeMessage();
    });
    
    // 显示主题切换提示信息
    function showThemeChangeMessage() {
        // 创建一个新的提示元素
        const message = document.createElement('div');
        message.className = 'theme-message';
        message.innerText = document.body.classList.contains('dark-mode') 
            ? '已切换到夜间模式' 
            : '已切换到白天模式';
        
        // 样式
        message.style.position = 'fixed';
        message.style.top = '80px';
        message.style.right = '20px';
        message.style.backgroundColor = 'var(--primary-color)';
        message.style.color = '#fff';
        message.style.padding = '10px 15px';
        message.style.borderRadius = '5px';
        message.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        message.style.zIndex = '1000';
        message.style.opacity = '0';
        message.style.transform = 'translateY(-20px)';
        message.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // 添加到页面
        document.body.appendChild(message);
        
        // 淡入效果
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 10);
        
        // 3秒后淡出
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-20px)';
            
            // 元素完全消失后移除
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
    
    // 自动检测系统主题偏好
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 如果本地存储没有主题设置，则应用系统偏好设置
    if (!currentTheme) {
        if (prefersDarkScheme.matches) {
            document.body.classList.add('dark-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
            applyDarkModeToAllContainers();
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
    
    // 监听系统主题变化
    prefersDarkScheme.addEventListener('change', (e) => {
        // 只有当用户没有手动设置主题时，才跟随系统变化
        const userTheme = localStorage.getItem('theme');
        if (!userTheme) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
                applyDarkModeToAllContainers();
            } else {
                document.body.classList.remove('dark-mode');
                themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>';
                removeDarkModeFromAllContainers();
            }
        }
    });
    
    // 应用深色模式到所有容器
    function applyDarkModeToAllContainers() {
        // 为所有div容器添加类
        const allDivs = document.querySelectorAll('div:not(.theme-switcher):not(.theme-message)');
        allDivs.forEach(div => {
            div.classList.add('dark-mode-container');
        });
        
        // 处理其他常见容器元素
        const otherContainers = document.querySelectorAll('section, article, aside, main, header, footer, nav');
        otherContainers.forEach(container => {
            container.classList.add('dark-mode-container');
        });
        
        // 动态监听DOM变化，处理AJAX加载的内容
        setupDarkModeObserver();
    }
    
    // 移除所有容器的深色模式
    function removeDarkModeFromAllContainers() {
        // 移除div容器类
        const allDivs = document.querySelectorAll('.dark-mode-container');
        allDivs.forEach(div => {
            div.classList.remove('dark-mode-container');
        });
        
        // 保持DOM观察器活动，以处理新加载的内容
    }
    
    // 设置DOM观察器，监听新加载的内容
    function setupDarkModeObserver() {
        // 如果浏览器支持MutationObserver
        if ('MutationObserver' in window) {
            // 创建一个观察器实例
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    // 检查新添加的节点
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            // 检查节点是否是元素节点
                            if (node.nodeType === 1) {
                                // 如果当前是深色模式，则给新元素添加类
                                if (document.body.classList.contains('dark-mode')) {
                                    if (node.tagName === 'DIV' && !node.classList.contains('theme-switcher') && !node.classList.contains('theme-message')) {
                                        node.classList.add('dark-mode-container');
                                    }
                                    
                                    // 查找新节点内的所有div
                                    const childDivs = node.querySelectorAll('div:not(.theme-switcher):not(.theme-message)');
                                    childDivs.forEach(div => {
                                        div.classList.add('dark-mode-container');
                                    });
                                    
                                    // 处理其他容器类型
                                    const childContainers = node.querySelectorAll('section, article, aside, main, header, footer, nav');
                                    childContainers.forEach(container => {
                                        container.classList.add('dark-mode-container');
                                    });
                                }
                            }
                        });
                    }
                });
            });
            
            // 配置观察选项
            const config = { 
                childList: true, // 观察子节点的添加或删除
                subtree: true,   // 观察所有后代节点
                attributes: false, // 不观察属性变化
                characterData: false // 不观察文本内容变化
            };
            
            // 开始观察文档
            observer.observe(document.body, config);
        }
    }
    
    // 如果当前是深色模式，初始应用到所有容器
    if (document.body.classList.contains('dark-mode')) {
        applyDarkModeToAllContainers();
    }
    
    // 在窗口加载完成后，确保所有动态加载的内容也得到处理
    window.addEventListener('load', function() {
        if (document.body.classList.contains('dark-mode')) {
            applyDarkModeToAllContainers();
        }
    });
}); 