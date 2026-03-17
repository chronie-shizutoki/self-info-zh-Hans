/**
 * 区域切换开关功能
 * 实现马来西亚(M)和新加坡(S)版本之间的国际化文本切换
 */
class RegionToggle {
    constructor() {
        this.currentRegion = this.getSavedRegion() || 'SG'; // 默认新加坡版本
        this.translations = null;
        this.init();
    }

    /**
     * 初始化区域切换功能
     */
    async init() {
        this.createToggleElement();
        this.setupEventListeners();
        this.updateToggleState();
        
        // 加载翻译文件并应用到页面
        await this.loadTranslations();
        this.applyTranslations();
    }

    /**
     * 从localStorage获取保存的区域设置
     */
    getSavedRegion() {
        try {
            return localStorage.getItem('region') || null;
        } catch (e) {
            console.error('Failed to get saved region:', e);
            return null;
        }
    }

    /**
     * 保存区域设置到localStorage
     */
    saveRegion(region) {
        try {
            localStorage.setItem('region', region);
        } catch (e) {
            console.error('Failed to save region:', e);
        }
    }

    /**
     * 加载翻译文件
     */
    async loadTranslations() {
        try {
            const fileName = this.currentRegion === 'SG' ? 'i18n-zh-sg.json' : 'i18n-zh-my.json';
            const response = await fetch(`components/${fileName}`);
            this.translations = await response.json();
        } catch (e) {
            console.error('Failed to load translations:', e);
            // 使用默认翻译作为回退
            this.translations = this.getFallbackTranslations();
        }
    }

    /**
     * 应用翻译到页面
     */
    applyTranslations() {
        if (!this.translations) {
            return;
        }

        // 遍历所有带有data-i18n属性的元素并应用翻译
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                element.textContent = this.translations[key];
            }
        });

        // 更新页面标题
        document.title = this.currentRegion === 'SG' ? '自介 (华文，新加坡)' : '自介 (华文，马来西亚)';
    }

    /**
     * 创建区域切换开关元素
     */
    createToggleElement() {
        // 检查是否已存在切换开关
        if (document.getElementById('region-toggle')) {
            return;
        }

        // 创建切换容器
        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'region-toggle';
        toggleContainer.className = 'region-toggle';

        // 创建切换按钮
        const toggleButton = document.createElement('div');
        toggleButton.className = `toggle-container ${this.currentRegion === 'SG' ? 'active' : ''}`;
        
        // 创建滑块
        const toggleSlider = document.createElement('div');
        toggleSlider.className = 'toggle-slider';
        toggleSlider.textContent = this.currentRegion;

        // 创建地区标签
        const regionLabels = document.createElement('div');
        regionLabels.className = 'region-labels';
        
        const malaysiaLabel = document.createElement('span');
        malaysiaLabel.className = 'region-label malaysia';
        malaysiaLabel.textContent = '';
        
        const singaporeLabel = document.createElement('span');
        singaporeLabel.className = 'region-label singapore';
        singaporeLabel.textContent = '';

        // 组装元素
        regionLabels.appendChild(malaysiaLabel);
        regionLabels.appendChild(singaporeLabel);
        toggleButton.appendChild(toggleSlider);
        toggleButton.appendChild(regionLabels);
        toggleContainer.appendChild(toggleButton);

        // 添加到页面
        document.body.appendChild(toggleContainer);

        this.toggleButton = toggleButton;
        this.toggleSlider = toggleSlider;
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        this.toggleButton.addEventListener('click', () => {
            this.toggleRegion();
        });

        // 支持键盘操作
        this.toggleButton.setAttribute('tabindex', '0');
        this.toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleRegion();
            }
        });

        // 添加辅助功能属性
        this.toggleButton.setAttribute('role', 'switch');
        this.toggleButton.setAttribute('aria-label', '区域切换：马来西亚/新加坡');
        this.toggleButton.setAttribute('aria-checked', this.currentRegion === 'SG');
    }

    /**
     * 切换区域
     */
    async toggleRegion() {
        this.currentRegion = this.currentRegion === 'MY' ? 'SG' : 'MY';
        this.saveRegion(this.currentRegion);
        this.updateToggleState();
        await this.loadTranslations();
        this.applyTranslations();
    }

    /**
     * 更新切换开关状态
     */
    updateToggleState() {
        if (this.currentRegion === 'SG') {
            this.toggleButton.classList.add('active');
            this.toggleSlider.textContent = 'SG';
        } else {
            this.toggleButton.classList.remove('active');
            this.toggleSlider.textContent = 'MY';
        }
        this.toggleButton.setAttribute('aria-checked', this.currentRegion === 'SG');
    }
}

// 页面加载完成后初始化区域切换功能
document.addEventListener('DOMContentLoaded', () => {
    // 等待一段时间确保其他元素已加载
    setTimeout(() => {
        new RegionToggle();
    }, 100);
});