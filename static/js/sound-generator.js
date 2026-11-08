/**
 * 音效生成器 - 用于创建并下载轮播滑动音效和茶壶倒茶音效
 */
document.addEventListener('DOMContentLoaded', function() {
    // 如果页面中已存在音效生成按钮，则不重复添加
    if (document.getElementById('generate-sound-btn')) {
        return;
    }
    
    // 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999;';
    document.body.appendChild(btnContainer);
    
    // 创建滑动音效生成按钮
    const slideBtn = document.createElement('button');
    slideBtn.id = 'generate-sound-btn';
    slideBtn.textContent = '生成滑动音效';
    slideBtn.style.cssText = 'padding: 10px; background: #005826; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap;';
    btnContainer.appendChild(slideBtn);
    
    // 创建倒茶音效生成按钮
    const teaBtn = document.createElement('button');
    teaBtn.id = 'generate-tea-sound-btn';
    teaBtn.textContent = '生成倒茶音效';
    teaBtn.style.cssText = 'padding: 10px; background: #8bc34a; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap;';
    btnContainer.appendChild(teaBtn);
    
    // 绑定事件
    slideBtn.addEventListener('click', function() {
        generateAndDownloadSound('slide');
    });
    
    teaBtn.addEventListener('click', function() {
        generateAndDownloadSound('tea');
    });
    
    function generateAndDownloadSound(type) {
        // 创建音频上下文
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = audioContext.sampleRate;
        const duration = type === 'tea' ? 0.5 : 0.3; // 茶音效更长一些
        
        // 创建离线音频上下文来生成音频文件
        const offlineContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);
        
        if (type === 'slide') {
            // 滑动音效
            const oscillator = offlineContext.createOscillator();
            const gainNode = offlineContext.createGain();
            
            // 设置音效参数
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(700, offlineContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                300, offlineContext.currentTime + 0.2
            );
            
            // 设置音量变化
            gainNode.gain.setValueAtTime(0.3, offlineContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01, offlineContext.currentTime + duration
            );
            
            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(offlineContext.destination);
            
            // 开始生成音频
            oscillator.start(0);
            oscillator.stop(duration);
        } else {
            // 茶壶倒茶音效
            const oscillator = offlineContext.createOscillator();
            const gainNode = offlineContext.createGain();
            const filter = offlineContext.createBiquadFilter();
            
            // 三角波更接近液体流动声
            oscillator.type = 'triangle';
            
            // 设置频率变化 - 模拟倒茶声音
            oscillator.frequency.setValueAtTime(150, offlineContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(100, offlineContext.currentTime + 0.2);
            oscillator.frequency.linearRampToValueAtTime(300, offlineContext.currentTime + 0.3);
            oscillator.frequency.linearRampToValueAtTime(200, offlineContext.currentTime + 0.4);
            
            // 设置滤波器
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            filter.Q.value = 10;
            
            // 设置音量变化 - 模拟倒茶的过程
            gainNode.gain.setValueAtTime(0.01, offlineContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, offlineContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.1, offlineContext.currentTime + 0.3);
            gainNode.gain.linearRampToValueAtTime(0, offlineContext.currentTime + 0.5);
            
            // 连接节点
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(offlineContext.destination);
            
            // 开始生成音频
            oscillator.start(0);
            oscillator.stop(duration);
        }
        
        // 渲染音频
        offlineContext.startRendering().then(function(renderedBuffer) {
            // 将音频缓冲区转换为WAV格式
            const wavBlob = bufferToWave(renderedBuffer, 0, renderedBuffer.length);
            
            // 创建下载链接
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = type === 'tea' ? 'tea-pour.mp3' : 'slide.mp3';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(function() {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        }).catch(function(err) {
            console.error('音频渲染失败:', err);
        });
    }
    
    // 将音频缓冲区转换为WAV文件Blob
    function bufferToWave(buffer, start, end) {
        const numOfChan = buffer.numberOfChannels;
        const length = (end - start) * numOfChan * 2 + 44;
        const out = new ArrayBuffer(length);
        const view = new DataView(out);
        const channels = [];
        let offset = 0;
        let pos = 0;
        
        // 写入WAV文件头
        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8); // 文件长度
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt "
        setUint32(16); // 块长度
        setUint16(1); // 编码格式 (PCM)
        setUint16(numOfChan); // 通道数
        setUint32(buffer.sampleRate); // 采样率
        setUint32(buffer.sampleRate * 2 * numOfChan); // 码率
        setUint16(numOfChan * 2); // 数据块对齐
        setUint16(16); // 位深度
        setUint32(0x61746164); // "data"
        setUint32(length - pos - 4); // 数据长度
        
        // 写入音频数据
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }
        
        while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
                if (offset >= buffer.length) break;
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }
        
        // 辅助函数
        function setUint16(data) {
            view.setUint16(pos, data, true);
            pos += 2;
        }
        
        function setUint32(data) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
        
        return new Blob([out], { type: 'audio/wav' });
    }
}); 