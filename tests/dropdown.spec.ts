import { test, expect, type Page } from '@playwright/test';
import * as testData from './dropDownTestData.json';

//Locators(one can change here and can be implemented in the tests).
const acceptCookiesLocator = "[id='usercentrics-root'] [data-testid='uc-accept-all-button']";
const startFreeTrial = "[href*='sign_up']";
const email = "[name='email']";
const password = "[name='password']";
const acceptTerms = "[name='acceptTos']";
const tryForFree = "[name='signup'] [type='submit']";
const firstName = "[name='firstname']";
const lastName = "[name='lastname']";
const nextStep = "[name='signup'] [type='submit']";
const companyName = "[name='organizationName']";
const countryInputBox = "[name='country']";
const countryOptions = "[data-testid='autocomplete-menu-portal'] ul";

// Kept in mind: All the test cases are independent and make sure one does not effect others.
test.describe('Test the dropdown for new option', () => {
  test.beforeEach(async ({ page }) => {
    //Run before every test case.
    const userDetails = testData.userData;
    await page.goto('/');
    const title = await page.title();
    expect(title).toBe('Signin - Circula');
    await acceptCookies(page, acceptCookiesLocator);
    await click(page, startFreeTrial);
    await acceptCookies(page, acceptCookiesLocator);
    await fillInInputBox(page, email, userDetails.email);
    await fillInInputBox(page, password, userDetails.password);
    await page.locator(acceptTerms).evaluate((element) => {
      const sibling = element.nextElementSibling;
      if (sibling) {
        (sibling as HTMLElement).click();
      }
    });
    await click(page, tryForFree);
    await fillInInputBox(page, firstName, userDetails.firstName);
    await fillInInputBox(page, lastName, userDetails.lastName);
    await click(page, nextStep);
    await fillInInputBox(page, companyName, userDetails.companyName);
  });

  //Run after every test case and close the browser
  test.afterEach(async({page})=>{
    await page.close();
  })

    //Fetching test data.
    //Click on the country name input box.
    //clear the country name from the dropdown input box
    //Enter the country name on the dropdown input box.
    //select an option from the dropdown option.
  test('should select a valid option from the dropdown', async ({ page }) => {
    const selectCountry = testData.countries[0].country;
    await click(page, countryInputBox);
    await page.locator(countryInputBox).clear();
    await fillInInputBox(page, countryInputBox, selectCountry);
    const dropDownSelected = await selectOptionFromDropdown(page, countryOptions, selectCountry);
    if (dropDownSelected == false) {
      throw new Error(`Test failed: ${selectCountry} should exist in the dropdown, but was found.`);
    }
    const selectedValue = await page.locator(countryInputBox).inputValue();
    expect(selectedValue).toBe(selectCountry);
    //Purposely added so you can see option being selected.
    await page.waitForTimeout(5000);
  });

  test('should not select an error prone option from the dropdown', async ({ page }) => {
    const selectCountry = testData.countries[1].country;
    await click(page, countryInputBox);
    await page.locator(countryInputBox).clear();
    await fillInInputBox(page, countryInputBox, selectCountry);
    const dropDownSelected = await selectOptionFromDropdown(page, countryOptions, selectCountry, false);
    if (dropDownSelected === false) {
      throw new Error(`Test failed: ${selectCountry} should not exist in the dropdown, but was found.`);
    }
    const selectedValue = await page.locator(countryInputBox).inputValue();
    expect(selectedValue).toBe(selectCountry);
    //Purposely added so you can see option not being selected.
    await page.waitForTimeout(5000);
  });

  test('should not select an invalid option from the dropdown', async ({ page }) => {
    const selectCountry = testData.countries[2].country;
    await click(page, countryInputBox);
    await page.locator(countryInputBox).clear();
    await fillInInputBox(page, countryInputBox, selectCountry);
    const dropDownSelected = await selectOptionFromDropdown(page, countryOptions, selectCountry, false);
    if (dropDownSelected === false) {
      throw new Error(`Test failed: ${selectCountry} should not exist in the dropdown, but was found.`);
    }
    const selectedValue = await page.locator(countryInputBox).inputValue();
    expect(selectedValue).toBe(selectCountry);
    //Purposely added so you can see option not being selected.
    await page.waitForTimeout(5000);
  });
});

//custom commands created to avoid the duplication of code and can be modified or improved.
//code modulation

//Improvements can be made: 
//1.This should also iterate through take 2-3 options to check the partial input text and select the correct one.
async function selectOptionFromDropdown(page: Page, locator: string, option: string, expectOptionToExist: boolean = true): Promise<boolean> {
  // Look for option in the dynamic dropdown and select them. If not available, then fail the automation gracefully.
  let selectedDropdown = true;
  const dropdownOption = page.locator(locator).getByRole('option', { name: option });
  // Check if the option exists in the dropdown
  const optionExists = await dropdownOption.count() > 0;

  if (expectOptionToExist) {
   //Option should exist and be selectable
    if (optionExists) {
      await dropdownOption.waitFor({ state: 'attached', timeout: 30000 });
      await dropdownOption.hover();
      await dropdownOption.click({ force: true });
    } else {
      selectedDropdown = false;
    }
  } else {
    //Option should NOT exist
    if (optionExists) {
      selectedDropdown = false;
    }
  }
  return selectedDropdown;
}

async function acceptCookies(page: Page, cssQuery: string) {
  // wait for cookies accpt button to be visible for 5s and click on it if displayed.
    await page.waitForSelector(cssQuery, { timeout: 5000, state: "visible" })?.then(async () => {
      const targetElement = (await page.$(cssQuery))?.asElement();
       if (targetElement) {
          await targetElement.click();    
      }
  });
}

async function click(page: Page, locator: string) {
  //purposely added hardcoded wait so you can see each and every steps being automaited.
  await page.waitForTimeout(1000);
  //wait for the locator to be visible for 30s and click if displayed.
  const elementVisible = await page.waitForSelector(locator, { timeout: 30000, state: 'visible' });
   if(elementVisible) {
   await page.locator(locator).click();
   };
  };

  async function fillInInputBox(page: Page, locator: string, input: string) {
    //wait for the locator to be attached and editable for 30s and then fill into the input box.
    await page.waitForSelector(locator,{ timeout: 30000, state: 'attached' });
      const inputBox = await page.$(locator);
      if(inputBox){
      await inputBox.waitForElementState('editable',{timeout:30000});
          await inputBox.fill(input);    
        }
    };