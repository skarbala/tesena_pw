import test, { expect } from '@playwright/test'

test.describe('Sorting hat', () => {

    test('user is sorted after clicking on sort me button', async ({ page }) => {
        await page.goto('/#/sortingHat')
        await page.locator('[data-test="sort-button"]').click()

        const response = await page.waitForResponse('**/sortingHat', { timeout: 5000 })
        const json = await response.json() as SortingHatResponse

        await expect(page.locator('[data-test="result-message"]')).toBeVisible()
        await expect(page.locator('[data-test="result-message"]')).toHaveText(json.sortingHatSays)

        await expect(page.locator('[data-test="house-result"]')).toBeVisible()
        await expect(page.locator('[data-test="house-result"]')).toHaveText(json.house)
    })

    test('display fake message', async ({ page }) => {
        const fakeMessage: SortingHatResponse = {
            sortingHatSays: 'This is a fake message you fools!',
            house: 'Mordor'
        }
        await page.route('**/sortingHat', async route => {
            await route.fulfill({
                body: JSON.stringify(fakeMessage)
            })
        })
        await page.goto('/#/sortingHat')
        await page.locator('[data-test="sort-button"]').click()

        await expect(page.locator('[data-test="result-message"]')).toBeVisible()
        await expect(page.locator('[data-test="result-message"]')).toHaveText(fakeMessage.sortingHatSays)

        await expect(page.locator('[data-test="house-result"]')).toBeVisible()
        await expect(page.locator('[data-test="house-result"]')).toHaveText(fakeMessage.house)
    })

    test('display message when server returns 500', async ({ page }) => {
        await page.route('**/sortingHat', async route => {
            await route.fulfill({
                status: 500
            })
        })
        await page.goto('/#/sortingHat')
        await page.locator('[data-test="sort-button"]').click()
    })
})

interface SortingHatResponse {
    sortingHatSays: string,
    house: string
}