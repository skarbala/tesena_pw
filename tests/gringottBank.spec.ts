import test, { expect } from "@playwright/test";

async function enterInvestmentData(page, investmentData) {
    await page.locator('select#selectedFund').selectOption(investmentData.fund)
}

test.describe('Gringott bank', () => {
    test('offer is created with correct data', async ({ page }) => {
        const investmentData = {
            fund: 'Basilisk Bonds',
            investment: 1500,
            years: 10
        }
        // ARRANGE
        await page.goto('/#/gringottsBank')

        test.step('Enter investment data', async () => {
            enterInvestmentData(page, investmentData)
            await page.locator('#oneTimeInvestment').fill(investmentData.investment.toString())
            await page.locator('#years').fill(investmentData.years.toString())
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
        const investmentData = {
            fund: 'Basilisk Bonds',
            investment: 1500,
            years: 10
        }
        const name = 'Severus'
        await page.goto('/#/gringottsBank')

        await page.locator('select#selectedFund').selectOption(investmentData.fund)
        await page.locator('#oneTimeInvestment').fill(investmentData.investment.toString())
        await page.locator('#years').fill(investmentData.years.toString())

        await page.locator('[data-test="create-offer"]').click()

        await page.locator('[data-test="customer-name"]').fill(name)

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

