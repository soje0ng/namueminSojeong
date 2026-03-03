import { chromium } from '@playwright/test';

async function testBuilderWidgets() {
    const browser = await chromium.launch({ headless: false, slowMo: 300 });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
    });

    try {
        // 1. Go to login page
        console.log('1. Going to login page...');
        await page.goto('http://localhost:3028/console/login');
        await page.waitForLoadState('networkidle');

        // 2. Click login button (credentials are pre-filled)
        console.log('2. Clicking login button...');
        await page.click('button[type="submit"]');

        // Wait for navigation (could go to main or somewhere else)
        await page.waitForTimeout(3000);
        console.log('   Current URL:', page.url());

        // 3. Navigate to builder NEW page
        console.log('3. Navigating to builder new page...');
        await page.goto('http://localhost:3028/console/builder/new');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        console.log('   Builder page URL:', page.url());

        // Take screenshot
        await page.screenshot({ path: 'e2e/builder-screenshot.png', fullPage: true });
        console.log('   Screenshot saved');

        // Check for error on page
        const hasError = await page.locator('text="Application error"').isVisible({ timeout: 1000 }).catch(() => false);
        if (hasError) {
            console.log('\n❌ Application error on builder/new page!');
            await page.screenshot({ path: 'e2e/builder-error.png' });
            return;
        }

        // Find sidebar
        console.log('\n4. Looking for sidebar...');
        const sidebar = page.locator('.w-\\[280px\\]');
        const sidebarVisible = await sidebar.isVisible({ timeout: 3000 }).catch(() => false);
        console.log(`   Sidebar visible: ${sidebarVisible}`);

        if (!sidebarVisible) {
            console.log('   Sidebar not found. Taking screenshot...');
            await page.screenshot({ path: 'e2e/no-sidebar.png' });
            return;
        }

        // List all buttons in sidebar
        const sidebarButtons = await sidebar.locator('button').all();
        console.log(`   Found ${sidebarButtons.length} buttons in sidebar`);

        // Test specific widgets
        const widgetsToTest = [
            '이미지 캐러셀',
            '아이콘 카드',
            '카드 리스트',
            '탭 메뉴',
            '탭 캐러셀',
        ];

        console.log('\n5. Testing widgets...');
        for (const widgetLabel of widgetsToTest) {
            errors.length = 0;

            console.log(`\n   === Testing: ${widgetLabel} ===`);

            // Reload the page to start fresh
            await page.goto('http://localhost:3028/console/builder/new');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // Find and click the widget button
            const widgetButton = page.locator('button').filter({ hasText: widgetLabel }).first();

            if (await widgetButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log(`   Found button, clicking...`);

                // Clear errors before clicking
                errors.length = 0;

                await widgetButton.click();
                await page.waitForTimeout(3000);

                // Take screenshot
                await page.screenshot({ path: `e2e/widget-${widgetLabel}.png` });

                // Check for Application error after clicking
                const pageHasError = await page.locator('text="Application error"').isVisible({ timeout: 1000 }).catch(() => false);

                if (pageHasError) {
                    console.log(`   ❌ APPLICATION ERROR for ${widgetLabel}!`);
                    await page.screenshot({ path: `e2e/error-${widgetLabel}.png` });
                } else if (errors.length > 0) {
                    console.log(`   ❌ Console errors for ${widgetLabel}:`);
                    errors.forEach(e => console.log(`      - ${e.substring(0, 300)}`));
                } else {
                    console.log(`   ✅ ${widgetLabel} - OK`);
                }
            } else {
                console.log(`   ⚠️ Widget button not found: ${widgetLabel}`);
            }
        }

        console.log('\n\n=== Test Complete ===');
        console.log('Browser stays open for 1 minute for manual inspection.');
        await page.waitForTimeout(60000);

    } catch (error) {
        console.error('Test error:', error);
        await page.screenshot({ path: 'e2e/error-screenshot.png' });
    } finally {
        await browser.close();
    }
}

testBuilderWidgets();
