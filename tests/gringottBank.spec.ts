import test, { expect, Page } from "@playwright/test";

async function enterInvestmentData(page: Page, investmentData: InvestmentData) {
    await page.locator('select#selectedFund').selectOption(investmentData.fund)
    await page.locator('#oneTimeInvestment').fill(investmentData.investment.toString())
    await page.locator('#years').fill(investmentData.years.toString())
}

async function enterName(page: Page, name: string) {
    await page.locator('[data-test="customer-name"]').fill(name)
}

test.describe('Gringott bank', () => {

    test.beforeEach('Open the page', async ({ page }) => {
        await page.goto('/#/gringottsBank')
    })

    test('offer is created with correct data', async ({ page }) => {
        const investmentData: InvestmentData = {
            fund: 'Basilisk Bonds',
            investment: 1000,
            years: 10
        }
        // ARRANGE
        test.step('Enter investment data', async () => {
            enterInvestmentData(page, investmentData)
        })

        // ACT
        await page.locator('[data-test="create-offer"]').click()

        // ASSERT
        test.step('Check offer data', async () => {
            const offerDetail = page.locator('div.offer-detail')
            await expect(offerDetail).toBeVisible()

            await expect(offerDetail
                .locator('p.period')
                .locator('span'))
                .toHaveText(investmentData.years + ' years')

            await expect(offerDetail
                .locator('p.fund')
                .locator('span'))
                .toHaveText(investmentData.fund)
        })
    })

    test('investment is created with correct data', async ({ page }) => {
        const investmentData: InvestmentData = {
            fund: 'Basilisk Bonds',
            investment: 1500,
            years: 10
        }
        const name = 'Severus'

        enterInvestmentData(page, investmentData)
        await page.locator('[data-test="create-offer"]').click()
        enterName(page, name)
        await page.locator('[data-test="create-investment"]').click()
        const recentInvestment = page.locator('ul.investment-list').locator('li').first()
        await expect(recentInvestment).toBeVisible()
        await recentInvestment.getByRole('button', { name: 'View Details' }).click()

        const modal = page.locator('div.modal-content')
        await expect(modal).toBeVisible()
        await expect(modal.getByText(`Name: ${name}`)).toBeVisible()
        await expect(modal.locator('p').filter({ hasText: 'Fund:' })).toContainText(investmentData.fund)
        await expect(modal.locator('p').filter({ hasText: 'Years:' })).toContainText(investmentData.years.toString())
    })
})

const funds = ['Fund A', 'Fund B', 'Fund C', 'Fund D']

for (const fund of funds) {
    test.skip(`Testing with ${fund}`, async ({ page }) => {
        await page.goto('/#/gringottsBank')

        console.log(fund)
    })
}

interface InvestmentData {
    fund: string,
    investment: number,
    years: number
}