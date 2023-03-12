/* eslint-disable prettier/prettier */
import { expect, test } from '@playwright/test';
import { DataLayer } from '@Utils/dataLayer';

test.describe('Check events for sunglasses', () => {
    let dataLayer: DataLayer;
    const expectedEvent = {
        event: 'PDPInteraction',
        eventAction: 'Sun Lens Funnel - Step 4: Coating',
        eventCategory: 'PDP - D',
        eventLabel: 'No Coating Added',
    };

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        const sunglassesBtn = await page.waitForSelector('//nav//a[@href="/sunglasses"]');
        await sunglassesBtn.click();
        page.waitForTimeout(5000);

        const sunglasses = await page.waitForSelector('[data-test-name="product"]');
        await sunglasses.click();
        await page.waitForLoadState('domcontentloaded');

        await page.waitForTimeout(4000);

        const selectLensesBtn = await page.waitForSelector('//button[@aria-label="choose lenses"]');
        await selectLensesBtn.click();

        const prescriptionBtn = await page.waitForSelector('//h3[contains(.,"Non-prescription")]');
        await prescriptionBtn.click(); //step 1

        const chooseLensBtn = await page.waitForSelector('//h2[contains(.,"Basic")]');
        await chooseLensBtn.click(); //step 3 lens package

        const continueBtn = await page.waitForSelector('//button[contains(., "Continue")]');
        await continueBtn.click(); //step 3 lens package continue button

        await page.waitForTimeout(4000);

        const selectionContinueBtn = await page.waitForSelector(
            '//button[contains(., "Continue")]'
        );
        await selectionContinueBtn.click(); //step 3 lens selection continue button
    });

    test('check events after pressing the Continue button on 4 step', async ({ page }) => {
        const dataLayer = new DataLayer(page);
        const verifyEvent = dataLayer.createEventVerifier(expectedEvent);

        let continueBtn = await page.waitForSelector('//button[contains(., "Continue")]');
        await continueBtn.click();
        await verifyEvent('No Coating Added');

        let backBtn = await page.waitForSelector('//button[text() = "Back"]');
        await backBtn.click();
        let hydrophobicBtn = await page.waitForSelector('input[value="Super Hydrophobic"]');
        await hydrophobicBtn.click();
        continueBtn = await page.waitForSelector('//button[contains(., "Continue")]');
        await continueBtn.click();
        await verifyEvent('Super Hydrophobic - Add');

        backBtn = await page.waitForSelector('//button[text() = "Back"]');
        await backBtn.click();
        hydrophobicBtn = await page.waitForSelector('input[value="Super Hydrophobic"]');
        await hydrophobicBtn.click();
        continueBtn = await page.waitForSelector('//button[contains(., "Continue")]');
        await continueBtn.click();
        await verifyEvent('Super Hydrophobic - Remove');
    });
});
