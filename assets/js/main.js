/**
 * 万媒师官网 - JavaScript 交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initMobileMenu();
    initScrollHeader();
    initSmoothScroll();
    initScrollAnimations();
    initDownloadDetection();
    initActiveNavHighlight();
});

/**
 * 移动端菜单切换
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // 点击菜单链接后关闭菜单
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // 点击外部关闭菜单
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

/**
 * 滚动时导航栏效果
 */
function initScrollHeader() {
    const header = document.getElementById('header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // 初始化检查
}

/**
 * 平滑滚动
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = 72; // 导航栏高度
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 滚动动画 - 元素进入视口时显示
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.feature-card, .download-card, .pricing-card, .stat-card, .value-item');

    // 添加 fade-in 类
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟，形成级联效果
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

/**
 * 下载按钮系统检测
 */
function initDownloadDetection() {
    const downloadButtons = document.querySelectorAll('.btn-download');

    // 检测操作系统
    function getOS() {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;

        if (userAgent.indexOf('Win') !== -1 || platform.indexOf('Win') !== -1) {
            return 'windows';
        }
        if (userAgent.indexOf('Mac') !== -1 || platform.indexOf('Mac') !== -1) {
            return 'mac';
        }
        if (userAgent.indexOf('Linux') !== -1 || platform.indexOf('Linux') !== -1) {
            return 'linux';
        }
        return 'unknown';
    }

    const currentOS = getOS();

    // 为下载按钮添加系统标识
    downloadButtons.forEach(btn => {
        const btnOS = btn.getAttribute('data-os');

        // 如果是当前系统，添加高亮样式
        if (btnOS === currentOS) {
            btn.classList.add('current-system');
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = `推荐下载 (${currentOS === 'windows' ? 'Windows' : 'macOS'})`;
            }
        }
    });

    // 监听下载按钮点击
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const os = this.getAttribute('data-os');

            // 显示提示信息
            showDownloadTip(os);
        });
    });
}

/**
 * 显示下载提示
 */
function showDownloadTip(os) {
    // 移除已存在的提示
    const existingTip = document.querySelector('.download-tip');
    if (existingTip) {
        existingTip.remove();
    }

    const tip = document.createElement('div');
    tip.className = 'download-tip';
    tip.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: ${os === 'windows' ? '#00A4EF' : '#555'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideUp 0.3s ease-out;
    `;
    tip.innerHTML = `
        <span>正在准备下载 ${os === 'windows' ? 'Windows' : 'macOS'} 安装包...</span>
    `;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(tip);

    // 3秒后移除提示
    setTimeout(() => {
        tip.style.animation = 'slideUp 0.3s ease-out reverse';
        setTimeout(() => tip.remove(), 300);
    }, 3000);
}

/**
 * 导航栏高亮当前板块
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
}

/**
 * 返回顶部功能
 */
function backToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * 复制到剪贴板功能
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
        });
    } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('已复制到剪贴板');
        } catch (err) {
            console.error('复制失败:', err);
        }
        document.body.removeChild(textArea);
    }
}

/**
 * 显示通知
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        animation: fadeInOut 2s ease-in-out forwards;
    `;
    notification.textContent = message;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            15% { opacity: 1; transform: translateX(-50%) translateY(0); }
            85% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 导出全局函数
window.backToTop = backToTop;
window.copyToClipboard = copyToClipboard;
