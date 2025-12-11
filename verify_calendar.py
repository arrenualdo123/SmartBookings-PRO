
from playwright.sync_api import Page, expect, sync_playwright

def verify_calendar_and_roles(page: Page):
    """
    Verifies that the calendar page loads correctly and that the admin
    user can see the settings link.
    """
    # 1. Navigate to the login page and set up the user role in localStorage.
    page.goto("http://localhost:3000/login")
    page.evaluate("() => { localStorage.setItem('userRole', 'admin'); localStorage.setItem('token', 'fake-token'); }")

    # 2. Navigate to the calendar page.
    page.goto("http://localhost:3000/dashboard/calendario")

    # 3. Add a small wait to ensure the page has time to render.
    page.wait_for_timeout(2000)

    # 4. DEBUG: Take a screenshot before the calendar check.
    page.screenshot(path="verification_debug.png")

    # 5. Wait for the FullCalendar component to be visible.
    calendar_element = page.locator(".fc")
    expect(calendar_element).to_be_visible(timeout=10000)

    # 6. Assert that the calendar title is present.
    heading = page.get_by_role("heading", name="Calendario")
    expect(heading).to_be_visible()

    # 7. Assert that the "Configuración" link is visible for the admin user.
    settings_link = page.get_by_role("link", name="Configuración")
    expect(settings_link).to_be_visible()

    # 8. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_calendar_and_roles(page)
        finally:
            browser.close()
