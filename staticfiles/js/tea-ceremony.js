// 皖韵茶道交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const stepItems = document.querySelectorAll('.step-item');
    const teaLeafItems = document.querySelectorAll('.tea-leaf-item');
    const instructionText = document.getElementById('current-instruction');
    const nextStepBtn = document.getElementById('next-step-btn');
    const teapot = document.getElementById('teapot');
    const teaCup = document.getElementById('tea-cup');
    const fairnessCup = document.getElementById('fairness-cup');
    const teaBoat = document.getElementById('tea-boat');
    const teaNeedle = document.getElementById('tea-needle');
    
    // 茶艺体验的步骤数据
    const ceremonySteps = [
        {
            name: '备器',
            instruction: '第一步：备器。请准备好茶壶、茶杯、公道杯等茶具，确保茶具干净整洁。点击茶壶开始准备。',
            action: '点击茶壶',
            target: teapot,
            hint: '请点击中间的茶壶',
            nextInstruction: '茶具已准备好，请点击"下一步"进入洗茶环节。'
        },
        {
            name: '洗茶',
            instruction: '第二步：洗茶。洗茶是为了清洁茶叶，唤醒茶性。请从右侧选择一种茶叶。',
            action: '选择茶叶',
            target: '.tea-leaf-item',
            hint: '请从右侧选择一种茶叶',
            nextInstruction: '茶叶已选择好，请点击"下一步"进入温杯环节。'
        },
        {
            name: '温杯',
            instruction: '第三步：温杯。温杯可以提升茶香，改善口感。请点击茶杯进行温杯。',
            action: '点击茶杯',
            target: teaCup,
            hint: '请点击下方的茶杯',
            nextInstruction: '温杯完成，杯温已适宜，请点击"下一步"进入投茶环节。'
        },
        {
            name: '投茶',
            instruction: '第四步：投茶。将选好的茶叶放入茶壶中。请再次点击茶壶。',
            action: '点击茶壶',
            target: teapot,
            hint: '请点击中间的茶壶',
            nextInstruction: '茶叶已放入茶壶，请点击"下一步"进入注水环节。'
        },
        {
            name: '注水',
            instruction: '第五步：注水。将85℃左右的热水注入茶壶中，水量适中，不要太满。请点击茶船。',
            action: '点击茶船',
            target: teaBoat,
            hint: '请点击下方的茶船',
            nextInstruction: '热水已注入茶壶，请点击"下一步"进入冲泡环节。'
        },
        {
            name: '冲泡',
            instruction: '第六步：冲泡。根据不同茶叶特性控制冲泡时间，一般为15-30秒。请等待茶叶冲泡...',
            action: '等待冲泡',
            target: null,
            hint: '请等待5秒钟',
            nextInstruction: '茶叶已冲泡完成，请点击"下一步"进入分茶环节。',
            timer: 5000
        },
        {
            name: '分茶',
            instruction: '第七步：分茶。将泡好的茶水均匀地倒入公道杯，再分入茶杯中。请点击公道杯。',
            action: '点击公道杯',
            target: fairnessCup,
            hint: '请点击下方的公道杯',
            nextInstruction: '茶水已均匀分配到各个茶杯中，请点击"下一步"进入品茶环节。'
        },
        {
            name: '品茶',
            instruction: '第八步：品茶。品茶时先观色，闻香，再尝味。请点击茶杯品尝。',
            action: '点击茶杯',
            target: teaCup,
            hint: '请点击下方的茶杯',
            nextInstruction: '恭喜您完成了完整的皖韵茶道体验！您可以点击"重新开始"再次体验。'
        }
    ];
    
    // 当前步骤索引
    let currentStepIndex = -1;
    // 选中的茶叶
    let selectedTea = null;
    // 步骤定时器
    let stepTimer = null;
    
    // 初始化函数
    function init() {
        // 绑定步骤点击事件
        stepItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (index <= currentStepIndex + 1) {
                    // 只允许点击当前步骤或下一步
                    goToStep(index);
                }
            });
        });
        
        // 绑定茶叶点击事件
        teaLeafItems.forEach(item => {
            item.addEventListener('click', () => {
                selectTeaLeaf(item);
            });
        });
        
        // 绑定下一步按钮点击事件
        nextStepBtn.addEventListener('click', () => {
            if (currentStepIndex < 0) {
                // 开始体验
                startExperience();
            } else if (currentStepIndex === ceremonySteps.length - 1) {
                // 完成所有步骤，重新开始
                resetExperience();
            } else {
                // 进入下一步
                goToStep(currentStepIndex + 1);
            }
        });
        
        // 绑定茶具点击事件
        bindTeawareEvents();
    }
    
    // 开始茶艺体验
    function startExperience() {
        goToStep(0);
    }
    
    // 重置体验
    function resetExperience() {
        // 清除所有激活状态
        stepItems.forEach(item => item.classList.remove('active'));
        teaLeafItems.forEach(item => item.classList.remove('selected'));
        
        // 重置状态
        currentStepIndex = -1;
        selectedTea = null;
        
        // 重置指引
        instructionText.textContent = '请开始茶艺体验，点击"备器"步骤。';
        nextStepBtn.textContent = '开始体验';
        
        // 清除可能存在的定时器
        if (stepTimer) {
            clearTimeout(stepTimer);
            stepTimer = null;
        }
    }
    
    // 前往指定步骤
    function goToStep(stepIndex) {
        // 更新当前步骤索引
        currentStepIndex = stepIndex;
        
        // 更新步骤显示状态
        stepItems.forEach((item, index) => {
            if (index === stepIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // 更新指导文本
        const currentStep = ceremonySteps[stepIndex];
        instructionText.textContent = currentStep.instruction;
        
        // 高亮目标元素（如果有）
        highlightTarget(currentStep);
        
        // 更新按钮文本
        if (stepIndex === ceremonySteps.length - 1) {
            nextStepBtn.textContent = '完成';
        } else {
            nextStepBtn.textContent = '下一步';
        }
        
        // 如果是等待步骤，设置定时器
        if (currentStep.timer) {
            nextStepBtn.disabled = true;
            stepTimer = setTimeout(() => {
                instructionText.textContent = currentStep.nextInstruction;
                nextStepBtn.disabled = false;
            }, currentStep.timer);
        }
    }
    
    // 高亮目标元素
    function highlightTarget(step) {
        // 清除所有高亮
        clearAllHighlights();
        
        // 如果有目标元素，添加高亮
        if (step.target) {
            if (typeof step.target === 'string') {
                // 如果是选择器
                document.querySelectorAll(step.target).forEach(el => {
                    el.classList.add('highlight');
                });
            } else {
                // 如果是DOM元素
                step.target.classList.add('highlight');
            }
        }
    }
    
    // 清除所有高亮
    function clearAllHighlights() {
        teapot.classList.remove('highlight', 'pouring');
        teaCup.classList.remove('highlight');
        fairnessCup.classList.remove('highlight');
        teaBoat.classList.remove('highlight');
        teaNeedle.classList.remove('highlight');
        
        document.querySelectorAll('.tea-leaf-item').forEach(item => {
            item.classList.remove('highlight');
        });
    }
    
    // 选择茶叶
    function selectTeaLeaf(teaLeafElement) {
        // 只有在"洗茶"步骤才能选择茶叶
        if (currentStepIndex === 1) {
            // 清除之前的选择
            teaLeafItems.forEach(item => {
                item.classList.remove('selected');
            });
            
            // 设置新选择
            teaLeafElement.classList.add('selected');
            selectedTea = teaLeafElement.getAttribute('data-tea');
            
            // 更新指导文本
            instructionText.textContent = ceremonySteps[currentStepIndex].nextInstruction;
            
            // 清除高亮
            clearAllHighlights();
        }
    }
    
    // 绑定茶具点击事件
    function bindTeawareEvents() {
        // 茶壶点击事件
        teapot.addEventListener('click', () => {
            handleTeawareClick(teapot, [0, 3]); // 备器和投茶步骤
        });
        
        // 茶杯点击事件
        teaCup.addEventListener('click', () => {
            handleTeawareClick(teaCup, [2, 7]); // 温杯和品茶步骤
        });
        
        // 公道杯点击事件
        fairnessCup.addEventListener('click', () => {
            handleTeawareClick(fairnessCup, [6]); // 分茶步骤
        });
        
        // 茶船点击事件
        teaBoat.addEventListener('click', () => {
            handleTeawareClick(teaBoat, [4]); // 注水步骤
            
            // 注水步骤添加倾倒动画
            if (currentStepIndex === 4) {
                teapot.classList.add('pouring');
                setTimeout(() => {
                    teapot.classList.remove('pouring');
                }, 2000);
            }
        });
        
        // 茶针点击事件
        teaNeedle.addEventListener('click', () => {
            // 茶针没有特定步骤，但可以作为辅助工具
        });
    }
    
    // 处理茶具点击事件
    function handleTeawareClick(element, validStepIndices) {
        // 检查当前步骤是否允许点击该茶具
        if (validStepIndices.includes(currentStepIndex)) {
            // 更新指导文本
            instructionText.textContent = ceremonySteps[currentStepIndex].nextInstruction;
            
            // 添加点击效果
            element.classList.add('active');
            setTimeout(() => {
                element.classList.remove('active');
            }, 300);
            
            // 清除高亮
            clearAllHighlights();
        } else {
            // 如果点击了错误的茶具，提示正确的操作
            instructionText.textContent = ceremonySteps[currentStepIndex].hint;
        }
    }
    
    // 初始化
    init();
}); 