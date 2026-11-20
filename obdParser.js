"use strict";
/**
 * RevX ELM327 OBD-II Command Queue & Response Parser
 * Handles byte framing, multi-line ASCII responses, standard Mode 01 PIDs,
 * error tokens (NO DATA, ?, SEARCHING, STOPPED, UNABLE TO CONNECT),
 * and conversion to physical engineering units.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elm327Parser = void 0;
class Elm327Parser {
    buffer = '';
    /**
     * Feed incoming raw string chunks from Serial or BLE stream
     * Returns complete response lines when prompt '>' is received
     */
    feed(chunk) {
        this.buffer += chunk;
        const completedResponses = [];
        // ELM327 terminates blocks with prompt '>'
        if (this.buffer.includes('>')) {
            const parts = this.buffer.split('>');
            // All but the last part are completed command responses
            for (let i = 0; i < parts.length - 1; i++) {
                const responseBlock = parts[i].trim();
                if (responseBlock.length > 0) {
                    completedResponses.push(responseBlock);
                }
            }
            this.buffer = parts[parts.length - 1]; // remainder
        }
        return completedResponses;
    }
    resetBuffer() {
        this.buffer = '';
    }
    /**
     * Parse ELM327 Mode 01 response line (e.g. "41 0C 1A F8" or multi-line hex)
     */
    parseMode01(rawResponse) {
        const cleaned = rawResponse
            .replace(/\r/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (!cleaned)
            return null;
        // Detect ELM status strings
        if (cleaned.includes('NO DATA')) {
            return {
                pid: 'UNKNOWN',
                name: 'NO_DATA',
                value: 0,
                unit: '',
                rawHex: cleaned,
                timestamp: Date.now(),
                quality: 'UNSUPPORTED',
            };
        }
        if (cleaned.includes('?') || cleaned.includes('UNABLE TO CONNECT') || cleaned.includes('STOPPED')) {
            return {
                pid: 'UNKNOWN',
                name: 'COMMAND_ERROR',
                value: 0,
                unit: '',
                rawHex: cleaned,
                timestamp: Date.now(),
                quality: 'ERROR',
            };
        }
        // Standard Mode 01 response format is: "41 <PID> <DATA BYTES...>"
        // Extract hex pairs
        const hexTokens = cleaned.match(/[0-9A-Fa-f]{2}/g);
        if (!hexTokens || hexTokens.length < 2) {
            return null;
        }
        // Look for index of "41" (Mode 01 positive response)
        const modeIndex = hexTokens.findIndex((token) => token.toUpperCase() === '41');
        if (modeIndex === -1 || modeIndex + 1 >= hexTokens.length) {
            return null;
        }
        const pid = hexTokens[modeIndex + 1].toUpperCase();
        const dataBytes = hexTokens.slice(modeIndex + 2).map((h) => parseInt(h, 16));
        const now = Date.now();
        switch (pid) {
            case '0C': { // Engine RPM: (256 * A + B) / 4
                if (dataBytes.length < 2)
                    return null;
                const A = dataBytes[0];
                const B = dataBytes[1];
                const rpm = (256 * A + B) / 4;
                return {
                    pid: '010C',
                    name: 'RPM',
                    value: Math.round(rpm * 10) / 10,
                    unit: 'rpm',
                    rawHex: cleaned,
                    timestamp: now,
                    quality: 'VALID',
                };
            }
            case '0D': { // Vehicle Speed: A km/h
                if (dataBytes.length < 1)
                    return null;
                const speed = dataBytes[0];
                return {
                    pid: '010D',
                    name: 'SPEED',
                    value: speed,
                    unit: 'km/h',
                    rawHex: cleaned,
                    timestamp: now,
                    quality: 'VALID',
                };
            }
            case '11': { // Throttle Position: 100 * A / 255 %
                if (dataBytes.length < 1)
                    return null;
                const throttle = (100 * dataBytes[0]) / 255;
                return {
                    pid: '0111',
                    name: 'THROTTLE',
                    value: Math.round(throttle * 10) / 10,
                    unit: '%',
                    rawHex: cleaned,
                    timestamp: now,
                    quality: 'VALID',
                };
            }
            case '05': { // Engine Coolant Temp: A - 40 °C
                if (dataBytes.length < 1)
                    return null;
                const coolant = dataBytes[0] - 40;
                return {
                    pid: '0105',
                    name: 'COOLANT_TEMP',
                    value: coolant,
                    unit: '°C',
                    rawHex: cleaned,
                    timestamp: now,
                    quality: 'VALID',
                };
            }
            case '10': { // MAF Air Flow Rate: (256 * A + B) / 100 g/s
                if (dataBytes.length < 2)
                    return null;
                const maf = (256 * dataBytes[0] + dataBytes[1]) / 100;
                return {
                    pid: '0110',
                    name: 'MAF',
                    value: Math.round(maf * 100) / 100,
                    unit: 'g/s',
                    rawHex: cleaned,
                    timestamp: now,
                    quality: 'VALID',
                };
            }
            case '00': { // Supported PIDs [01-20] bitmap
                if (dataBytes.length < 4)
                    return null;
                return {
                    pid: '0100',
                    name: 'SUPPORTED_PIDS_1_20',
                    value: (dataBytes[0] << 24) | (dataBytes[1] << 16) | (dataBytes[2] << 8) | dataBytes[3],
                    unit: 'bitmap',
                    rawHex: cleaned,
                    timestamp: now,
                    quality: 'VALID',
                };
            }
            default:
                return {
                    pid: `01${pid}`,
                    name: `PID_${pid}`,
                    value: dataBytes[0] ?? 0,
                    unit: 'raw',
                    rawHex: cleaned,
                    timestamp: now,
                    quality: 'VALID',
                };
        }
    }
    /**
     * Helper to parse 32-bit supported PID bitmask into human-readable PID array
     */
    static parseSupportedPidBitmap(dataBytes, offset = 1) {
        const supported = [];
        if (dataBytes.length < 4)
            return supported;
        for (let byteIdx = 0; byteIdx < 4; byteIdx++) {
            const byteVal = dataBytes[byteIdx];
            for (let bit = 7; bit >= 0; bit--) {
                if ((byteVal & (1 << bit)) !== 0) {
                    const pidNum = offset + byteIdx * 8 + (7 - bit);
                    const hexPid = pidNum.toString(16).toUpperCase().padStart(2, '0');
                    supported.push(`01${hexPid}`);
                }
            }
        }
        return supported;
    }
}
exports.Elm327Parser = Elm327Parser;
