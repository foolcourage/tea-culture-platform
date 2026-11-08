/**
 * 安徽茶文化 - 文字浮动和发光效果
 * 此脚本为网站添加茶文化相关的动态效果，包括关键词高亮、浮动茶叶和特殊效果
 */

// 当DOM加载完成后应用效果
document.addEventListener('DOMContentLoaded', function() {
    // 茶叶相关词汇及其对应的CSS类
    const teaKeywords = [
        { word: '祁门红茶', className: 'qimen-tea' },
        { word: '祁红', className: 'qimen-tea' },
        { word: '黄山毛峰', className: 'huangshan-tea' },
        { word: '毛峰', className: 'huangshan-tea' },
        { word: '六安瓜片', className: 'liuan-tea' },
        { word: '瓜片', className: 'liuan-tea' },
        { word: '太平猴魁', className: 'taiping-tea' },
        { word: '猴魁', className: 'taiping-tea' },
        { word: '徽茶', className: 'tea-keyword' },
        { word: '茶文化', className: 'tea-keyword' },
        { word: '茶叶', className: 'tea-keyword' },
        { word: '茶树', className: 'tea-keyword' },
        { word: '茶艺', className: 'tea-keyword' }
    ];
    
    // 应用文字效果
    applyTeaTextEffects();
    
    // 创建浮动茶叶
    createFloatingTeaLeaves(15); // 创建15个浮动茶叶
    
    // 增强"茶"字的显示
    enhanceTeaCharacters();
    
    // 增强含"茶"的标题
    enhanceTeaTitles();
    
    // 监听滚动事件，更新视差效果
    window.addEventListener('scroll', function() {
        updateParallaxEffect();
    });

    /**
     * 应用茶文本效果到页面文字
     */
    function applyTeaTextEffects() {
        // 避免处理脚本和样式节点
        const excludeElements = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT'];
        
        // 遍历所有文本节点
        const textNodes = [];
        const walker = document.createTreeWalker(
            document.body, 
            NodeFilter.SHOW_TEXT, 
            {
                acceptNode: function(node) {
                    if (node.nodeValue.trim() === '') return NodeFilter.FILTER_REJECT;
                    if (excludeElements.includes(node.parentNode.nodeName)) return NodeFilter.FILTER_REJECT;
                    
                    // 排除导航栏的文本
                    let parent = node.parentNode;
                    while (parent) {
                        // 检查是否在导航栏内
                        if (parent.classList && 
                            (parent.classList.contains('main-nav') || 
                             parent.classList.contains('nav-links') ||
                             parent.tagName === 'HEADER')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        parent = parent.parentNode;
                    }
                    
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }
        
        // 处理每个文本节点
        textNodes.forEach(textNode => {
            let text = textNode.nodeValue;
            let hasKeyword = false;
            
            // 检查和替换关键词
            teaKeywords.forEach(keyword => {
                if (text.includes(keyword.word)) {
                    hasKeyword = true;
                    const span = document.createElement('span');
                    const parts = text.split(keyword.word);
                    
                    span.innerHTML = parts.map((part, index) => {
                        if (index === parts.length - 1) {
                            return part;
                        }
                        return part + `<span class="${keyword.className}">${keyword.word}</span>`;
                    }).join('');
                    
                    if (textNode.parentNode) {
                        textNode.parentNode.replaceChild(span, textNode);
                    }
                    
                    // 更新text以防止多次替换同一节点
                    text = span.innerHTML;
                }
            });
            
            // 如果没有关键词，但有"茶"字，将"茶"字替换为特殊样式
            if (!hasKeyword && text.includes('茶')) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(/茶/g, '<span class="tea-char">茶</span>');
                
                if (textNode.parentNode) {
                    textNode.parentNode.replaceChild(span, textNode);
                }
            }
        });
    }

    /**
     * 创建浮动茶叶元素
     */
    function createFloatingTeaLeaves(count) {
        const teaLeafChars = ['茶', '☘', '🍃', '🍵'];
        const bodyWidth = document.body.clientWidth;
        const bodyHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        );
        
        for (let i = 0; i < count; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'floating-tea-leaf';
            
            // 随机选择一个茶叶字符
            leaf.textContent = teaLeafChars[Math.floor(Math.random() * teaLeafChars.length)];
            
            // 设置随机位置
            const x = Math.random() * bodyWidth;
            const y = Math.random() * bodyHeight;
            
            // 设置样式
            leaf.style.left = `${x}px`;
            leaf.style.top = `${y}px`;
            leaf.style.fontSize = `${Math.random() * 20 + 10}px`; // 10-30px
            leaf.style.opacity = `${Math.random() * 0.3 + 0.1}`; // 0.1-0.4
            
            // 设置随机动画
            leaf.style.animationDuration = `${Math.random() * 10 + 10}s`; // 10-20s
            leaf.style.animationDelay = `${Math.random() * 5}s`; // 0-5s
            leaf.style.animationName = Math.random() > 0.5 ? 'float' : 'float-rotate';
            
            // 添加到页面
            document.body.appendChild(leaf);
        }
    }

    /**
     * 增强单个"茶"字的显示
     */
    function enhanceTeaCharacters() {
        document.querySelectorAll('.tea-char').forEach(el => {
            el.classList.add('tea-text-glow');
        });
    }

    /**
     * 增强包含"茶"的标题
     */
    function enhanceTeaTitles() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach(heading => {
            if (heading.textContent.includes('茶')) {
                heading.classList.add('tea-title');
            }
        });
    }

    /**
     * 更新视差效果
     */
    function updateParallaxEffect() {
        const scrollY = window.scrollY;
        
        document.querySelectorAll('.floating-tea-leaf').forEach((leaf, index) => {
            // 创建视差效果，不同元素以不同速度移动
            const speed = 0.05 + (index % 5) * 0.01;
            const yPos = -scrollY * speed;
            
            leaf.style.transform = `translateY(${yPos}px)`;
        });
    }
}); 