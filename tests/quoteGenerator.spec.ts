import test, { expect } from '@playwright/test'

test.describe('Quote generator', () => {

    test.beforeEach('Open page', async ({ page }) => {
        await page.goto('/#/quotes')
    })

    test('generate quote on click', async ({ page }) => {
        await page.locator('[data-test="get-quote"]').click()
        await expect(page.locator('ul.quote-list').locator('li')).toBeVisible()
        await expect(page.locator('p[data-test="wisdom-points"]')).toHaveText('wisdom points +1')
    })

    test('check that remove quote is disabled on page open', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Remove Quote' })).toBeDisabled()
    })

    test('message is displayed when no quotes are generated', async ({ page }) => {
        await expect(page.getByText('Click the button to get some wisdom'))
            .toBeVisible()

        const messageLocator = page.locator('div.empty-list-message')
        await expect(messageLocator).toHaveText('Click the button to get some wisdom')
        await expect(messageLocator).toBeVisible()
    })
})

test('locator showtime', async ({ page }) => {
    await page.goto('/#/quotes')
    await page.getByText('Get Quote').click()

    await page.getByRole('button', { name: 'Get Quote' }).click()

    await page
        .locator('ul.quote-list')
        .locator('li')
        .locator('p.author').click()
})


test('for cycle showcase', async ({ page }) => {
    await page.goto('/#/quotes')

    for (let index = 0; index < 100; index++) {
        await page.getByText('Get Quote').click()
        await expect(page.locator('p[data-test="wisdom-points"]')).toHaveText(`wisdom points +${index + 1}`)

        const elements = await page.locator('ul.quote-list').locator('li').all()

        expect(elements.length).toEqual(index + 1)
        await expect(page.locator('ul.quote-list').locator('li')).toHaveCount(index + 1)
    }

})