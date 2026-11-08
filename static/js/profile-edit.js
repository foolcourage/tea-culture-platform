document.addEventListener('DOMContentLoaded', function() {
  // 元素选择
  const avatarInput = document.getElementById('avatar');
  const avatarPreview = document.querySelector('.avatar-preview img');
  const defaultAvatar = '/static/img/default-avatar.png';
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  const profileForm = document.getElementById('profile-form');
  const nicknameInput = document.getElementById('nickname');
  const bioInput = document.getElementById('bio');
  
  // 头像预览功能
  if (avatarInput && avatarPreview) {
    // 设置默认头像
    if (!avatarPreview.src || avatarPreview.src === '') {
      avatarPreview.src = defaultAvatar;
    }
    
    avatarInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (file.type.match('image.*')) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            avatarPreview.src = e.target.result;
            
            // 添加动画效果
            avatarPreview.style.transform = 'scale(1.05)';
            setTimeout(() => {
              avatarPreview.style.transform = 'scale(1)';
            }, 300);
          }
          
          reader.readAsDataURL(file);
        } else {
          alert('请选择图片文件');
          avatarInput.value = '';
        }
      }
    });
    
    // 点击头像时触发文件选择
    avatarPreview.parentElement.addEventListener('click', function() {
      avatarInput.click();
    });
  }
  
  // 表单输入框焦点效果
  formInputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    
    input.addEventListener('focus', function() {
      formGroup.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      formGroup.classList.remove('focused');
      
      // 简单验证
      if (input.hasAttribute('required') && input.value.trim() === '') {
        formGroup.classList.add('has-error');
        
        // 检查是否已存在错误消息
        let errorMessage = formGroup.querySelector('.form-error');
        if (!errorMessage) {
          errorMessage = document.createElement('div');
          errorMessage.className = 'form-error';
          errorMessage.textContent = '此字段不能为空';
          formGroup.appendChild(errorMessage);
        }
      } else {
        formGroup.classList.remove('has-error');
        const errorMessage = formGroup.querySelector('.form-error');
        if (errorMessage) {
          formGroup.removeChild(errorMessage);
        }
      }
    });
  });
  
  // 字数统计
  if (bioInput) {
    const maxLength = bioInput.getAttribute('maxlength') || 500;
    const counterEl = document.createElement('div');
    counterEl.className = 'char-counter';
    counterEl.textContent = `0/${maxLength}`;
    bioInput.parentNode.appendChild(counterEl);
    
    bioInput.addEventListener('input', function() {
      const currentLength = this.value.length;
      counterEl.textContent = `${currentLength}/${maxLength}`;
      
      if (currentLength > maxLength * 0.9) {
        counterEl.classList.add('warning');
      } else {
        counterEl.classList.remove('warning');
      }
    });
    
    // 初始化字数
    if (bioInput.value) {
      const event = new Event('input');
      bioInput.dispatchEvent(event);
    }
  }
  
  // 表单提交前验证
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      let hasError = false;
      
      // 验证必填字段
      const requiredInputs = this.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (input.value.trim() === '') {
          const formGroup = input.closest('.form-group');
          formGroup.classList.add('has-error');
          
          // 添加错误消息
          let errorMessage = formGroup.querySelector('.form-error');
          if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'form-error';
            errorMessage.textContent = '此字段不能为空';
            formGroup.appendChild(errorMessage);
          }
          
          hasError = true;
        }
      });
      
      // 验证昵称长度
      if (nicknameInput && nicknameInput.value.trim().length < 2) {
        const formGroup = nicknameInput.closest('.form-group');
        formGroup.classList.add('has-error');
        
        let errorMessage = formGroup.querySelector('.form-error');
        if (!errorMessage) {
          errorMessage = document.createElement('div');
          errorMessage.className = 'form-error';
          formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = '昵称至少需要2个字符';
        
        hasError = true;
      }
      
      // 如果有错误，阻止表单提交
      if (hasError) {
        e.preventDefault();
        
        // 滚动到第一个错误
        const firstError = document.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // 添加提交动画
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = '保存中... <span class="spinner"></span>';
          submitBtn.disabled = true;
        }
      }
    });
  }
  
  // 表单重置
  const resetBtn = document.querySelector('.btn-secondary');
  if (resetBtn && profileForm) {
    resetBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (confirm('确定要重置所有更改吗？')) {
        // 重置表单
        profileForm.reset();
        
        // 重置头像
        if (avatarPreview && avatarPreview.dataset.original) {
          avatarPreview.src = avatarPreview.dataset.original;
        }
        
        // 移除所有错误信息
        document.querySelectorAll('.has-error').forEach(el => {
          el.classList.remove('has-error');
        });
        
        document.querySelectorAll('.form-error').forEach(el => {
          el.remove();
        });
        
        // 重置字数统计
        if (bioInput) {
          const event = new Event('input');
          bioInput.dispatchEvent(event);
        }
      }
    });
  }
  
  // 增加平滑滚动效果
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // 添加CSS类
  document.body.classList.add('profile-edit-page');
  
  // 页面加载动画
  const formSections = document.querySelectorAll('.form-section');
  formSections.forEach((section, index) => {
    setTimeout(() => {
      section.classList.add('visible');
    }, 100 * index);
  });
}); 