import { describe, expect, it } from 'vitest';
import { startSessionTool } from '../../src/tools/session.tool';

describe('start_session validation', () => {
  it('fails if language is not 2-3 lowercase letters', async () => {
    const result = await (startSessionTool as any)({
      platform: 'Android',
      language: 'KO', // uppercase
      locale: 'KR'
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('language must be a 2 or 3-letter lowercase code');

    const result2 = await (startSessionTool as any)({
      platform: 'Android',
      language: 'korean', // too long
      locale: 'KR'
    });
    expect(result2.isError).toBe(true);
    expect(result2.content[0].text).toContain('language must be a 2 or 3-letter lowercase code');

    const result3 = await (startSessionTool as any)({
      platform: 'Android',
      language: 'k', // too short
      locale: 'KR'
    });
    expect(result3.isError).toBe(true);
    expect(result3.content[0].text).toContain('language must be a 2 or 3-letter lowercase code');
  });

  it('fails for Android if only language is provided', async () => {
    const result = await (startSessionTool as any)({
      platform: 'Android',
      language: 'ko'
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('both language and locale must be provided together');
  });

  it('fails for Android if only locale is provided', async () => {
    const result = await (startSessionTool as any)({
      platform: 'Android',
      locale: 'KR'
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('both language and locale must be provided together');
  });

  it('fails for Android if locale is not 2 uppercase letters', async () => {
    const result = await (startSessionTool as any)({
      platform: 'Android',
      language: 'ko',
      locale: 'kr' // lowercase
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('locale must be a 2-letter uppercase country code');

    const result2 = await (startSessionTool as any)({
      platform: 'Android',
      language: 'ko',
      locale: 'KOR' // 3 letters
    });
    expect(result2.isError).toBe(true);
    expect(result2.content[0].text).toContain('locale must be a 2-letter uppercase country code');
  });

  it('fails for iOS if locale format is invalid', async () => {
    const result = await (startSessionTool as any)({
      platform: 'iOS',
      language: 'ko',
      locale: 'KR' // Android style
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('locale must be in the format {lang}-{country}');

    const result2 = await (startSessionTool as any)({
      platform: 'iOS',
      language: 'ko',
      locale: 'ko_KR' // underscore style
    });
    expect(result2.isError).toBe(true);
    expect(result2.content[0].text).toContain('locale must be in the format {lang}-{country}');
  });

  it('passes language validation for iOS with valid parameters (checks next error)', async () => {
    // This will fail later because of missing appPath/app, but it confirms it passed language validation
    const result = await (startSessionTool as any)({
      platform: 'iOS',
      language: 'ko',
      locale: 'ko-KR'
    });
    expect(result.content[0].text).toContain('Either "appPath" must be provided');
  });

  it('allows iOS language without locale', async () => {
    const result = await (startSessionTool as any)({
      platform: 'iOS',
      language: 'ko'
    });
    expect(result.content[0].text).toContain('Either "appPath" must be provided');
  });

  it('passes language validation for Android with valid parameters', async () => {
    const result = await (startSessionTool as any)({
      platform: 'Android',
      language: 'ko',
      locale: 'KR'
    });
    expect(result.content[0].text).toContain('Either "appPath" must be provided');
  });

  it('supports 3-letter language codes (e.g. jpn, eng)', async () => {
    const result = await (startSessionTool as any)({
      platform: 'Android',
      language: 'jpn',
      locale: 'JP'
    });
    expect(result.content[0].text).toContain('Either "appPath" must be provided');
  });
});
