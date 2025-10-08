/**
 * 日期工具模块 - 提供新马华人日期格式转换功能
 */

// 月份缩写映射
const monthAbbr = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
];

/**
 * 日期解析函数
 * @param {string} dateStr - 日期字符串
 * @returns {object|null} 解析后的日期对象 {year, month, day} 或 null
 */
export function parseDate(dateStr) {
    // 移除前后空格
    dateStr = dateStr.trim();
    
    // 匹配多种日期格式的正则表达式
    const patterns = [
        /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/,  // 2025.10.3
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,  // 2025-10-03
        /^(\d{4})年(\d{1,2})月(\d{1,2})日$/  // 2025年10月3日
    ];
    
    for (const pattern of patterns) {
        const match = dateStr.match(pattern);
        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]);
            const day = parseInt(match[3]);
            
            // 验证日期有效性
            if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                return { year, month, day };
            }
        }
    }
    
    return null;
}

/**
 * 日期格式化函数 - 转换为新马华人常用格式 (如 "3 Oct 2025")
 * @param {object} dateObj - 日期对象 {year, month, day}
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(dateObj) {
    const { year, month, day } = dateObj;
    return `${day} ${monthAbbr[month - 1]} ${year}`;
}

/**
 * 转换单个日期
 * @param {string} dateStr - 日期字符串
 * @returns {string|null} 转换后的日期字符串或null
 */
export function convertDate(dateStr) {
    const dateObj = parseDate(dateStr);
    if (dateObj) {
        return formatDate(dateObj);
    }
    return null;
}

/**
 * 自动转换页面中带有data-date属性的元素
 * 页面加载完成后自动执行
 */
document.addEventListener('DOMContentLoaded', () => {
    // 查找所有包含data-date属性的元素并转换
    const elements = document.querySelectorAll('[data-date]');
    elements.forEach(el => {
        const originalDate = el.getAttribute('data-date');
        const converted = convertDate(originalDate);
        if (converted) {
            el.textContent = `✨ ${converted} | 更新记录 ✨`;
        }
    });
});