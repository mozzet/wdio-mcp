import { describe, expect, it } from 'vitest';
import { getMobileVisibleElements } from '../../src/scripts/get-visible-mobile-elements';

const mockBrowser = {
  getWindowSize: async () => ({ width: 1080, height: 1920 }),
  getPageSource: async () => '',
} as unknown as WebdriverIO.Browser;

describe('getMobileVisibleElements - checked state', () => {
  it('extracts checked state from Android XML', async () => {
    const androidXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <hierarchy rotation="0">
        <android.widget.FrameLayout index="0" bounds="[0,0][1080,1920]">
          <android.widget.CheckBox index="0" resource-id="com.app:id/checkbox" checked="true" bounds="[100,100][200,200]" text="Accept Terms" />
          <android.widget.CheckBox index="1" resource-id="com.app:id/checkbox2" checked="false" bounds="[100,250][200,350]" text="Newsletter" />
        </android.widget.FrameLayout>
      </hierarchy>
    `;

    const browser = {
      ...mockBrowser,
      isAndroid: true,
      isIOS: false,
      getPageSource: async () => androidXML,
    } as unknown as WebdriverIO.Browser;

    const elements = await getMobileVisibleElements(browser, 'android');
    const checkedBox = elements.find(e => e.resourceId === 'com.app:id/checkbox');
    const uncheckedBox = elements.find(e => e.resourceId === 'com.app:id/checkbox2');

    expect(checkedBox?.isChecked).toBe(true);
    expect(uncheckedBox?.isChecked).toBe(false);
  });

  it('extracts selected state as checked from iOS XML', async () => {
    const iosXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <AppiumAUT>
        <XCUIElementTypeWindow bounds="[0,0][375,667]">
          <XCUIElementTypeSwitch name="Notifications" selected="true" bounds="[20,100][100,140]" />
          <XCUIElementTypeSwitch name="Location" selected="false" bounds="[20,150][100,190]" />
        </XCUIElementTypeWindow>
      </AppiumAUT>
    `;

    const browser = {
      ...mockBrowser,
      isAndroid: false,
      isIOS: true,
      getWindowSize: async () => ({ width: 375, height: 667 }),
      getPageSource: async () => iosXML,
    } as unknown as WebdriverIO.Browser;

    const elements = await getMobileVisibleElements(browser, 'ios');
    const checkedSwitch = elements.find(e => e.accessibilityId === 'Notifications');
    const uncheckedSwitch = elements.find(e => e.accessibilityId === 'Location');

    expect(checkedSwitch?.isChecked).toBe(true);
    expect(uncheckedSwitch?.isChecked).toBe(false);
  });

  it('filters by visibility on Android when visibleOnly is true (default)', async () => {
    const androidXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <hierarchy rotation="0">
        <android.widget.FrameLayout index="0" bounds="[0,0][1080,1920]">
          <android.widget.TextView index="0" resource-id="visible_text" displayed="true" bounds="[100,100][200,200]" text="Visible" />
          <android.widget.TextView index="1" resource-id="hidden_text" displayed="false" bounds="[100,250][200,350]" text="Hidden" />
        </android.widget.FrameLayout>
      </hierarchy>
    `;

    const browser = {
      ...mockBrowser,
      isAndroid: true,
      isIOS: false,
      getPageSource: async () => androidXML,
    } as unknown as WebdriverIO.Browser;

    const elements = await getMobileVisibleElements(browser, 'android');
    expect(elements.find(e => e.resourceId === 'visible_text')).toBeDefined();
    expect(elements.find(e => e.resourceId === 'hidden_text')).toBeUndefined();
  });

  it('includes hidden elements on Android when visibleOnly is false', async () => {
    const androidXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <hierarchy rotation="0">
        <android.widget.FrameLayout index="0" bounds="[0,0][1080,1920]">
          <android.widget.TextView index="0" resource-id="visible_text" displayed="true" bounds="[100,100][200,200]" text="Visible" />
          <android.widget.TextView index="1" resource-id="hidden_text" displayed="false" bounds="[100,250][200,350]" text="Hidden" />
        </android.widget.FrameLayout>
      </hierarchy>
    `;

    const browser = {
      ...mockBrowser,
      isAndroid: true,
      isIOS: false,
      getPageSource: async () => androidXML,
    } as unknown as WebdriverIO.Browser;

    const elements = await getMobileVisibleElements(browser, 'android', { visibleOnly: false });
    expect(elements.find(e => e.resourceId === 'visible_text')).toBeDefined();
    expect(elements.find(e => e.resourceId === 'hidden_text')).toBeDefined();
  });

  it('filters by visibility on iOS when visibleOnly is true (default)', async () => {
    const iosXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <AppiumAUT>
        <XCUIElementTypeWindow bounds="[0,0][375,667]">
          <XCUIElementTypeButton name="visible_btn" visible="true" bounds="[20,100][100,140]" />
          <XCUIElementTypeButton name="hidden_btn" visible="false" bounds="[20,150][100,190]" />
        </XCUIElementTypeWindow>
      </AppiumAUT>
    `;

    const browser = {
      ...mockBrowser,
      isAndroid: false,
      isIOS: true,
      getWindowSize: async () => ({ width: 375, height: 667 }),
      getPageSource: async () => iosXML,
    } as unknown as WebdriverIO.Browser;

    const elements = await getMobileVisibleElements(browser, 'ios');
    expect(elements.find(e => e.accessibilityId === 'visible_btn')).toBeDefined();
    expect(elements.find(e => e.accessibilityId === 'hidden_btn')).toBeUndefined();
  });

  it('includes hidden elements on iOS when visibleOnly is false', async () => {
    const iosXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <AppiumAUT>
        <XCUIElementTypeWindow bounds="[0,0][375,667]">
          <XCUIElementTypeButton name="visible_btn" visible="true" bounds="[20,100][100,140]" />
          <XCUIElementTypeButton name="hidden_btn" visible="false" bounds="[20,150][100,190]" />
        </XCUIElementTypeWindow>
      </AppiumAUT>
    `;

    const browser = {
      ...mockBrowser,
      isAndroid: false,
      isIOS: true,
      getWindowSize: async () => ({ width: 375, height: 667 }),
      getPageSource: async () => iosXML,
    } as unknown as WebdriverIO.Browser;

    const elements = await getMobileVisibleElements(browser, 'ios', { visibleOnly: false });
    expect(elements.find(e => e.accessibilityId === 'visible_btn')).toBeDefined();
    expect(elements.find(e => e.accessibilityId === 'hidden_btn')).toBeDefined();
  });
});
