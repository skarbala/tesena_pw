import test, { expect } from "@playwright/test";

test('offer is created with correct data', async ({ page }) => {
    const investmentData = {
        fund: 'Basilisk Bonds',
        investment: 1500,
        years: 10
    }
    // ARRANGE
    await page.goto('/#/gringottsBank')
    await page.locator('select#selectedFund').selectOption(investmentData.fund)
    await page.locator('#oneTimeInvestment').fill(investmentData.investment.toString())
    await page.locator('#years').fill(investmentData.years.toString())

    // ACT
    await page.locator('[data-test="create-offer"]').click()

    // ASSERT
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


const funds = ['Fund A', 'Fund B', 'Fund C', 'Fund D']

for (const fund of funds) {
    test(`Testing with ${fund}`, async ({ page }) => {
        await page.goto('/#/gringottsBank')

        console.log(fund)
    })
}