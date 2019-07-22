const id = '';
const pass = ''
const count = 15; //授業数


const webdriver = require('selenium-webdriver');
const { Builder, By, until } = webdriver;


const capabilities = webdriver.Capabilities.chrome();
capabilities.set('chromeOptions', {
    args: [
        // '--headless',
        // '--no-sandbox',        
        // '--disable-gpu',
        // `--window-size=1000,600`
        // other chrome options
    ]
});

const width = 1200;
const height = 2000;
const driver = new Builder().withCapabilities(capabilities).build();
driver.manage().window().setRect({ width: width, height: height });
(async () => {
    try {
        //ログイン処理
        await driver.get('https://cit.manaba.jp/ct/login');
        await driver.findElement(By.xpath('//*[@id="mainuserid"]')).sendKeys(id);
        await driver.findElement(By.xpath('//*[@id="login-form-box"]/form/table/tbody/tr[2]/td/input')).sendKeys(pass);
        await driver.findElement(By.xpath('//*[@id="login"]')).click();
        await driver.sleep(500);

        //アンケート選択画面へ
        await driver.get('https://cit.manaba.jp/ct/home_myquery');
        await driver.sleep(500);

        //アンケートリスト
        let list = new Array(count);
        for (let i = 0; i < count; i++) {
            const j = i + 3;
            list[i] = j.toString();
        }
        console.log(list);

        for (let index = 0; index < list.length; index++) {
            const element = list[index];

            //アンケートの選択
            try {
                await driver.findElement(By.xpath('//*[@id="container"]/div[2]/div/table/tbody/tr[' + element + ']/td[1]/a')).getText().then(res => {
                    console.log(res);
                });
            } catch{
                console.log('全回答終了');
                break;
            }
            await driver.findElement(By.xpath('//*[@id="container"]/div[2]/div/table/tbody/tr[' + element + ']/td[1]/a')).click();
            await driver.sleep(500);


            try {
                await driver.findElement(By.name('action_BulkQueryStudent_querystart')).click();
            } catch{
                await driver.get('https://cit.manaba.jp/ct/home_myquery');
                console.log('回答済');
                continue;
            }
            await driver.sleep(500);


            const min = 2;
            const max = 4;
            //アンケートクリック
            for (let index = 1; index <= 18; index++) {
                const rnd = Math.floor(Math.random() * (max + 1 - min)) + min;
                await driver.findElement(By.xpath('//*[@id="qid' + index.toString() + '_' + rnd.toString() + '"]')).click();

            }

            //提出確認
            await driver.findElement(By.name('action_BulkQueryStudent_queryshow_confirm')).click();
            await driver.sleep(500);

            //提出
            await driver.findElement(By.name('action_BulkQueryStudent_querydone')).click();
            await driver.sleep(500);

            //アンケート画面に飛ぶ
            await driver.get('https://cit.manaba.jp/ct/home_myquery');
        }

    }
    catch (error) {
        console.error(error);
    }
    finally {
        if (driver) {
            // driver.quit();
        }
        console.log('quit');
    }
})();