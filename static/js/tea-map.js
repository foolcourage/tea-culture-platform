// 安徽茶叶地图交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有茶叶标记点
    const teaMarkers = document.querySelectorAll('.tea-marker');
    
    // 茶叶信息弹窗
    const teaInfoPopup = document.createElement('div');
    teaInfoPopup.className = 'tea-info-popup';
    teaInfoPopup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">&times;</span>
            <h3 class="popup-title"></h3>
            <div class="popup-desc"></div>
            <a href="#" class="view-detail-btn">查看详情</a>
        </div>
    `;
    document.querySelector('.anhui-map').appendChild(teaInfoPopup);
    
    // 关闭弹窗按钮功能
    const closePopup = teaInfoPopup.querySelector('.close-popup');
    closePopup.addEventListener('click', function() {
        teaInfoPopup.classList.remove('active');
    });
    
    // 茶叶基本信息数据
    const teaInfo = {
        'huangshan': {
            title: '黄山毛峰',
            desc: '中国传统名茶，因产于黄山而得名，外形似雀舌，白毫显露，香气高锐持久，滋味鲜爽，汤色清亮。',
            link: '/tea/huangshan/'
        },
        'qimen': {
            title: '祁门红茶',
            desc: '被誉为"红茶皇后"，具有"香高、味醇、形美、色艳"的特点，是世界三大高香红茶之一。',
            link: '/tea/qimen/'
        },
        'taiping': {
            title: '太平猴魁',
            desc: '产于黄山市太平县猴坑一带，外形扁平挺直如兰蕙，两叶抱一芽，中脉呈紫红色。',
            link: '/tea/taiping/'
        },
        'luian': {
            title: '六安瓜片',
            desc: '中国唯一一种没有芽头的名茶，形似瓜子，无梗，叶脉绿中隐红，滋味鲜爽甘醇。',
            link: '/tea/luian/'
        },
        'jingting': {
            title: '敬亭绿雪',
            desc: '产于宣城市敬亭山一带，芽头肥壮，白毫显露，色泽嫩绿，相传李白曾赞美此茶。',
            link: '/tea/jingting/'
        }
    };
    
    // 为每个标记点添加动画效果和点击事件
    teaMarkers.forEach(marker => {
        // 添加入场动画
        setTimeout(() => {
            marker.classList.add('animate-in');
        }, Math.random() * 1000); // 随机延迟时间，使动画错开
        
        // 点击标记显示信息
        marker.addEventListener('click', function() {
            const teaId = this.getAttribute('data-tea');
            const tea = teaInfo[teaId];
            
            if (tea) {
                // 更新弹窗内容
                teaInfoPopup.querySelector('.popup-title').textContent = tea.title;
                teaInfoPopup.querySelector('.popup-desc').textContent = tea.desc;
                teaInfoPopup.querySelector('.view-detail-btn').href = tea.link;
                
                // 显示弹窗并定位
                teaInfoPopup.style.top = (this.offsetTop - 100) + 'px';
                teaInfoPopup.style.left = (this.offsetLeft + 30) + 'px';
                teaInfoPopup.classList.add('active');
                
                // 高亮当前选中的标记点
                teaMarkers.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
            }
        });
        
        // 添加点击反馈动画
        marker.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        marker.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
        
        // 确保鼠标离开时恢复正常状态
        marker.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // 为了移动端兼容，添加触摸事件
    teaMarkers.forEach(marker => {
        marker.addEventListener('touchstart', function(e) {
            // 阻止默认滚动行为
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
        });
        
        marker.addEventListener('touchend', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
            
            // 获取茶叶标识
            const teaId = this.getAttribute('data-tea');
            
            // 跳转到对应的茶叶详情页
            window.location.href = `/tea/${teaId}/`;
        });
    });
    
    // 点击地图空白区域关闭弹窗
    document.querySelector('.anhui-map').addEventListener('click', function(e) {
        if (e.target === this) {
            teaInfoPopup.classList.remove('active');
            teaMarkers.forEach(m => m.classList.remove('active'));
        }
    });
}); 