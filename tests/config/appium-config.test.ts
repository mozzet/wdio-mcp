import { describe, expect, it } from 'vitest';
import { buildAndroidCapabilities, buildIOSCapabilities } from '../../src/config/appium.config';

describe('buildAndroidCapabilities', () => {
  // Simulate how app-session.tool.ts calls this — all params destructured, unset ones are undefined
  const defaultOptions = { deviceName: 'emulator-5554', autoAcceptAlerts: undefined, autoDismissAlerts: undefined, autoGrantPermissions: undefined };

  it('includes autoAcceptAlerts: false by default when param is undefined', () => {
    const caps = buildAndroidCapabilities('/app.apk', defaultOptions);
    expect(caps['appium:autoAcceptAlerts']).toBe(false);
  });

  it('includes autoGrantPermissions: false by default when param is undefined', () => {
    const caps = buildAndroidCapabilities('/app.apk', defaultOptions);
    expect(caps['appium:autoGrantPermissions']).toBe(false);
  });

  it('respects explicit autoAcceptAlerts: true', () => {
    const caps = buildAndroidCapabilities('/app.apk', { ...defaultOptions, autoAcceptAlerts: true });
    expect(caps['appium:autoAcceptAlerts']).toBe(true);
  });

  it('sets autoDismissAlerts and clears autoAcceptAlerts when autoDismissAlerts is set', () => {
    const caps = buildAndroidCapabilities('/app.apk', { ...defaultOptions, autoDismissAlerts: true });
    expect(caps['appium:autoDismissAlerts']).toBe(true);
    expect(caps['appium:autoAcceptAlerts']).toBeUndefined();
  });

  it('includes language and locale when provided', () => {
    const caps = buildAndroidCapabilities('/app.apk', { ...defaultOptions, language: 'ko', locale: 'KR' });
    expect(caps['appium:language']).toBe('ko');
    expect(caps['appium:locale']).toBe('KR');
  });
});

describe('buildIOSCapabilities', () => {
  const defaultOptions = { deviceName: 'iPhone 15', autoAcceptAlerts: undefined, autoDismissAlerts: undefined, autoGrantPermissions: undefined };

  it('includes autoAcceptAlerts: false by default when param is undefined', () => {
    const caps = buildIOSCapabilities('/app.app', defaultOptions);
    expect(caps['appium:autoAcceptAlerts']).toBe(false);
  });

  it('includes autoGrantPermissions: false by default when param is undefined', () => {
    const caps = buildIOSCapabilities('/app.app', defaultOptions);
    expect(caps['appium:autoGrantPermissions']).toBe(false);
  });

  it('includes language and locale when provided', () => {
    const caps = buildIOSCapabilities('/app.app', { ...defaultOptions, language: 'en', locale: 'US' });
    expect(caps['appium:language']).toBe('en');
    expect(caps['appium:locale']).toBe('US');
  });
});
