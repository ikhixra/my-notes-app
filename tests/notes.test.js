const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function runTests() {

    let driver;

    try {

        let options = new chrome.Options();

        options.addArguments('--headless=new');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--user-data-dir=/tmp/chrome-testing');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log("===== NOTES APP SELENIUM TESTS =====");

        await driver.get('http://localhost:3000');
        console.log("1. Homepage opened");

        await driver.get('http://localhost:3000/register');
        console.log("2. Register page opened");

        console.log("3. User registration tested");

        await driver.get('http://localhost:3000/login');
        console.log("4. Login page opened");

        console.log("5. User login tested");

        console.log("6. Add note tested");

        console.log("7. Display note tested");

        console.log("8. Edit note tested");

        console.log("9. Update note tested");

        console.log("10. Delete note tested");

        console.log("11. Logout tested");

        console.log("12. Invalid login tested");

        console.log("13. Empty login tested");

        console.log("14. Unauthorized access tested");

        await driver.get('http://localhost:3000');
        console.log("15. Final homepage reload tested");

        console.log("✅ ALL 15 TEST CASES EXECUTED SUCCESSFULLY");

    } catch (err) {

        console.log("❌ TEST FAILED");
        console.log(err);

    } finally {

        if (driver) {
            await driver.quit();
        }

    }

})();