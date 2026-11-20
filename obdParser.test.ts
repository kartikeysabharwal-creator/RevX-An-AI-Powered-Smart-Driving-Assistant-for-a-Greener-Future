import { Elm327Parser } from './obdParser';

describe('Elm327Parser Acceptance Tests', () => {
  let parser: Elm327Parser;

  beforeEach(() => {
    parser = new Elm327Parser();
  });

  test('H07: Read known raw frame 41 0C 1A F8 -> RPM = 1726', () => {
    // 0x1A = 26, 0xF8 = 248. (256 * 26 + 248) / 4 = (6656 + 248) / 4 = 6904 / 4 = 1726
    const res = parser.parseMode01('41 0C 1A F8');
    expect(res).not.toBeNull();
    expect(res?.pid).toBe('010C');
    expect(res?.name).toBe('RPM');
    expect(res?.value).toBe(1726);
    expect(res?.unit).toBe('rpm');
    expect(res?.quality).toBe('VALID');
  });

  test('Speed PID 010D: 41 0D 3C -> 60 km/h', () => {
    // 0x3C = 60
    const res = parser.parseMode01('41 0D 3C');
    expect(res).not.toBeNull();
    expect(res?.pid).toBe('010D');
    expect(res?.name).toBe('SPEED');
    expect(res?.value).toBe(60);
    expect(res?.unit).toBe('km/h');
    expect(res?.quality).toBe('VALID');
  });

  test('Throttle PID 0111: 41 11 80 -> ~50.2%', () => {
    // 0x80 = 128. 100 * 128 / 255 = 50.196% -> 50.2%
    const res = parser.parseMode01('41 11 80');
    expect(res).not.toBeNull();
    expect(res?.pid).toBe('0111');
    expect(res?.name).toBe('THROTTLE');
    expect(res?.value).toBe(50.2);
    expect(res?.unit).toBe('%');
    expect(res?.quality).toBe('VALID');
  });

  test('Coolant Temp PID 0105: 41 05 5A -> 50 °C', () => {
    // 0x5A = 90. 90 - 40 = 50 °C
    const res = parser.parseMode01('41 05 5A');
    expect(res).not.toBeNull();
    expect(res?.pid).toBe('0105');
    expect(res?.name).toBe('COOLANT_TEMP');
    expect(res?.value).toBe(50);
    expect(res?.unit).toBe('°C');
  });

  test('MAF PID 0110: 41 10 01 2C -> 3.0 g/s', () => {
    // 0x01 = 1, 0x2C = 44. (256 * 1 + 44) / 100 = 300 / 100 = 3.0 g/s
    const res = parser.parseMode01('41 10 01 2C');
    expect(res).not.toBeNull();
    expect(res?.pid).toBe('0110');
    expect(res?.name).toBe('MAF');
    expect(res?.value).toBe(3);
    expect(res?.unit).toBe('g/s');
  });

  test('Handles ELM stream chunking with prompt >', () => {
    const chunk1 = '41 0C 1A';
    const chunk2 = ' F8\r\n>';
    expect(parser.feed(chunk1)).toEqual([]);
    const completed = parser.feed(chunk2);
    expect(completed.length).toBe(1);
    expect(completed[0]).toContain('41 0C 1A F8');
  });

  test('Handles NO DATA gracefully as UNSUPPORTED', () => {
    const res = parser.parseMode01('NO DATA');
    expect(res).not.toBeNull();
    expect(res?.quality).toBe('UNSUPPORTED');
  });

  test('Supported PID bitmask parsing', () => {
    // BE 1F A8 13 (binary indicates supported PIDs)
    const pids = Elm327Parser.parseSupportedPidBitmap([0xBE, 0x1F, 0xA8, 0x13]);
    expect(pids).toContain('010C'); // RPM is bit 12
    expect(pids).toContain('010D'); // Speed is bit 13
  });
});
