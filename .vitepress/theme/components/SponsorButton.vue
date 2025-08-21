<template>
  <div class="sponsor-button-container" v-if="isDesktop">
    <!-- 赞助按钮 -->
    <button 
      class="sponsor-button" 
      @click="showModal = true"
      title="赞助支持"
    >
      <svg class="sponsor-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span class="sponsor-text">赞助</span>
    </button>
  </div>

    <!-- 弹窗遮罩 -->
    <Transition name="modal" appear>
    <div 
        class="sponsor-modal-overlay" 
        v-if="showModal" 
        @click="showModal = false"
    >
        <div class="sponsor-modal" @click.stop>
        <div class="sponsor-modal-header">
        <h3>感谢您的支持</h3>
        <button class="close-button" @click="showModal = false">
            <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        </button>
        </div>
        <div class="sponsor-modal-content">
        <p class="sponsor-description">
            如果这个项目对您有帮助，请考虑赞助支持我们继续维护和改进。
        </p>
        <div class="qr-code-container">
            <img 
            :src="qr" 
            alt="赞助二维码" 
            class="qr-code"
            @error="handleImageError"
            />
            <p class="qr-code-text">扫码赞助</p>
        </div>
        </div>
        </div>
    </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import qr from '../../../pages/images/sponsor-qr.jpg'

const showModal = ref(false)
const isDesktop = ref(false)

// 检测是否为桌面端
const checkIsDesktop = () => {
  isDesktop.value = window.innerWidth >= 768
}

const handleResize = () => {
  checkIsDesktop()
}

const handleImageError = (e) => {
  // 如果图片加载失败，显示占位文本
  e.target.style.display = 'none'
  e.target.nextElementSibling.textContent = '二维码图片未找到，请添加 /pages/images/sponsor-qr.png'
}

// ESC键关闭弹窗
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    showModal.value = false
  }
}

// 防止背景滚动
const toggleBodyScroll = (disable) => {
  if (disable) {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = '0px'
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

// 监听弹窗状态变化
watch(showModal, (newValue) => {
  toggleBodyScroll(newValue)
})

onMounted(() => {
  checkIsDesktop()
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
  // 确保组件卸载时恢复滚动
  toggleBodyScroll(false)
})
</script>

<style scoped>
.sponsor-button-container {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.sponsor-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
  writing-mode: horizontal-tb;
}

.sponsor-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  background: linear-gradient(135deg, #ff5252, #d84315);
}

.sponsor-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.sponsor-text {
  white-space: nowrap;
}

.sponsor-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.sponsor-modal {
  background: var(--vp-c-bg);
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  margin: auto;
}

.sponsor-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 20px;
}

.sponsor-modal-header h3 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.sponsor-modal-content {
  padding: 0 24px 24px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.sponsor-description {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 24px;
  text-align: center;
}

.qr-code-container {
  text-align: center;
}

.qr-code {
  max-width: 200px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-code-text {
  margin-top: 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

/* Vue Transition 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-from .sponsor-modal,
.modal-leave-to .sponsor-modal {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  backdrop-filter: blur(4px);
}

.modal-enter-to .sponsor-modal,
.modal-leave-from .sponsor-modal {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.sponsor-modal {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 暗色主题适配 */
.dark .sponsor-modal {
  border: 1px solid var(--vp-c-divider);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* 确保弹窗始终在视口中心 */
.sponsor-modal-overlay {
  overflow: hidden;
}

/* 防止内容溢出 */
.sponsor-modal-header {
  flex-shrink: 0;
}

/* 优化二维码显示 */
.qr-code {
  display: block;
  margin: 0 auto;
}

/* 响应式调整 */
@media (max-width: 767px) {
  .sponsor-button-container {
    display: none;
  }
}

@media (max-width: 480px) {
  .sponsor-modal-overlay {
    padding: 16px;
  }
  
  .sponsor-modal {
    max-width: none;
    width: 100%;
    border-radius: 12px;
  }
  
  .sponsor-modal-header,
  .sponsor-modal-content {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .sponsor-modal-content {
    max-height: calc(100vh - 120px);
  }
}
</style>