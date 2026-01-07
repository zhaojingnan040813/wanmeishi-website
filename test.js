/**
 * 万媒师官网 - Playwright 测试脚本
 */

const { chromium } = require('playwright');

(async () => {
    console.log('🚀 启动浏览器测试...\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 收集控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push({ type: msg.type(), text: msg.text() });
    });

    // 收集页面错误
    const pageErrors = [];
    page.on('pageerror', error => {
        pageErrors.push(error.message);
    });

    try {
        // 打开本地 HTML 文件
        const filePath = `file://${process.cwd()}/index.html`;
        console.log(`📄 加载页面: ${filePath}\n`);

        await page.goto(filePath, { waitUntil: 'networkidle' });

        // 等待页面完全加载
        await page.waitForTimeout(1000);

        // 检查页面标题
        const title = await page.title();
        console.log(`✅ 页面标题: ${title}`);

        // 检查关键元素是否存在
        console.log('\n🔍 检查关键元素...\n');

        const checks = [
            { selector: '.header', name: '导航栏' },
            { selector: '.hero', name: '首屏区域' },
            { selector: '.features', name: '核心特性区域' },
            { selector: '#download', name: '下载专区' },
            { selector: '#pricing', name: '定价方案' },
            { selector: '#about', name: '关于我们' },
            { selector: '.footer', name: '页脚' },
            { selector: '.btn-primary', name: '主按钮' },
            { selector: '.nav-menu', name: '导航菜单' },
        ];

        for (const check of checks) {
            const element = await page.$(check.selector);
            if (element) {
                console.log(`  ✓ ${check.name} 已找到`);
            } else {
                console.log(`  ✗ ${check.name} 未找到`);
            }
        }

        // 测试导航链接点击
        console.log('\n🧭 测试导航功能...\n');

        const navLinks = await page.$$('.nav-link');
        console.log(`  找到 ${navLinks.length} 个导航链接`);

        // 测试下载按钮
        console.log('\n📦 测试下载按钮...\n');

        const downloadBtns = await page.$$('.btn-download');
        console.log(`  找到 ${downloadBtns.length} 个下载按钮`);

        // 模拟点击下载按钮
        if (downloadBtns.length > 0) {
            await downloadBtns[0].click();
            await page.waitForTimeout(500);
            console.log('  ✓ 下载按钮可点击');
        }

        // 测试移动端菜单
        console.log('\n📱 测试移动端响应式...\n');

        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);

        const navToggle = await page.$('.nav-toggle');
        if (navToggle) {
            await navToggle.click();
            await page.waitForTimeout(500);
            console.log('  ✓ 移动端菜单切换正常');
        }

        // 恢复到桌面端
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);

        // 检查控制台错误
        console.log('\n📊 测试结果汇总\n');

        const errors = consoleMessages.filter(m => m.type === 'error');
        const warnings = consoleMessages.filter(m => m.type === 'warning');

        if (errors.length > 0) {
            console.log('⚠️ 控制台错误:');
            errors.forEach(e => console.log(`  - ${e.text}`));
        } else {
            console.log('✓ 无控制台错误');
        }

        if (warnings.length > 0) {
            console.log(`⚠️ 控制台警告: ${warnings.length} 个`);
        }

        if (pageErrors.length > 0) {
            console.log('\n⚠️ 页面错误:');
            pageErrors.forEach(e => console.log(`  - ${e}`));
        } else {
            console.log('✓ 无页面错误');
        }

        console.log('\n✨ 测试完成！\n');

    } catch (error) {
        console.error('❌ 测试过程中出现错误:');
        console.error(error.message);
    } finally {
        await browser.close();
    }
})();
