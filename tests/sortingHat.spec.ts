import test, { expect } from '@playwright/test'
import fakeResponse from '../data/fakeResponseSortingHat.json'
//Potterapi documentation https://documenter.getpostman.com/view/6199862/SzYewFs9#7a70fb58-1060-45ff-aa0a-5d6fd7106be3
test.describe('Sorting hat', () => {
    test.describe('UI', () => {

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
            const fakeMessage: SortingHatResponse = fakeResponse
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

    test.describe('API', () => {
        test('endpoint returns correct status', async ({ request }) => {
            const response = await request.get('http://localhost:3000/sortingHat')
            expect(response.status()).toEqual(200)
            expect(response.ok()).toBeTruthy()
        })

        test('house contains only specified value', async ({ request }) => {
            const response = await request.get('http://localhost:3000/sortingHat')
            const responseBody = await response.json()
            const expectedHouses = ["Ravenclaw", "Slytherin", "Hufflepuff", "Gryffindor"]
            expect(expectedHouses).toContain(responseBody.house)
        })

        test('response contains sorting hat message', async ({ request }) => {
            const response = await request.get('http://localhost:3000/sortingHat')
            const responseBody = await response.json()
            expect(responseBody.sortingHatSays).toBeTruthy()
        })
    })

})

interface SortingHatResponse {
    sortingHatSays: string,
    house: string
}