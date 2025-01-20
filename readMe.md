**Playwright Automation for Dropdown Tests**

**Project Overview**

This project is built using TypeScript and Playwright to automate tests on a dropdown functionality. The tests focus on verifying that the dropdown works correctly based on different input scenarios.

**Key Features:**

**Cookie Acceptance**: Automatically accepts cookies during test execution.

**Custom Commands**: Custom commands are implemented to enhance the automation framework and can be improved or extended later.

**Base URL Setup**: The base URL is configured in the '/playwright.config.ts' file for easier maintenance and better test readability.

**Parallel Execution**: Parallel test execution is disabled through the '/playwright.config.ts' file (fullyparallel: false).

**Cross-Browser Setup**: Cross-browser testing is supported. You can enable/disable browsers (Chromium, Firefox, WebKit) by commenting out the relevant lines in the '/playwright.config.ts' file.

**Test Data Management:** Test data is maintained separately in a file, making it easy to modify data in one place without changing test scripts.

**Test Cases**

**The following test cases are implemented:**

1. Verify the dropdown contains an option "Sweden" by typing into the input box

2. Verify that the dropdown does not display an option "Sweden" when a spelling error is made (e.g., "swiden")

3. Verify that a country not part of the dropdown shows empty options (e.g., "India")

**Improvements for Future Enhancements**

1. Better Assertions and Retryability

2. Enhance the Dropdown Custom Command

3. Separate Locators into a Dedicated File

**Run Automation:**

1. run <npx playwright test --headed> in the terminal for headed mode.

2. run <'npx playwright show-report'> to check report.
