/**
 * 禁用数字人相关功能
 * 这个脚本会在DOM加载完成后执行，确保所有数字人相关元素被禁用
 */
document.addEventListener('DOMContentLoaded', function() {
    // 查找并移除所有可能的数字人元素
    const selectors = [
        '.virtual-human', 
        '#virtual-human', 
        '[class*="virtual-human"]', 
        '[id*="virtual-human"]',
        '.digital-human',
        '#digital-human',
        '[class*="digital-human"]',
        '[id*="digital-human"]',
        '[data-virtual-human]',
        '[data-digital-human]'
    ];
    
    // 遍历所有选择器
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // 隐藏元素
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.width = '0';
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.position = 'absolute';
            element.style.pointerEvents = 'none';
            
            // 或者直接从DOM中移除
            if(element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    });
    
    // 阻止任何尝试加载数字人相关脚本的操作
    const originalCreateElement = document.createElement;
    document.createElement = function(tag) {
        const element = originalCreateElement.call(document, tag);
        if (tag.toLowerCase() === 'script') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && (value.includes('virtual-human') || value.includes('digital-human'))) {
                    console.log('已阻止加载数字人脚本:', value);
                    return;
                }
                return originalSetAttribute.call(this, name, value);
            };
        }
        return element;
    };
    
    console.log('数字人功能已禁用');
}); 