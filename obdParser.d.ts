/**
 * RevX ELM327 OBD-II Command Queue & Response Parser
 * Handles byte framing, multi-line ASCII responses, standard Mode 01 PIDs,
 * error tokens (NO DATA, ?, SEARCHING, STOPPED, UNABLE TO CONNECT),
 * and conversion to physical engineering units.
 */
export interface ObdPidResult {
    pid: string;
    name: string;
    value: number;
    unit: string;
    rawHex: string;
    timestamp: number;
    quality: 'VALID' | 'UNSUPPORTED' | 'TIMEOUT' | 'ERROR';
}
export interface ObdState {
    transportOpen: boolean;
    initialized: boolean;
    protocol: string | null;
    supportedPids: Set<string>;
    lastSampleAt: number | null;
}
export declare class Elm327Parser {
    private buffer;
    /**
     * Feed incoming raw string chunks from Serial or BLE stream
     * Returns complete response lines when prompt '>' is received
     */
    feed(chunk: string): string[];
    resetBuffer(): void;
    /**
     * Parse ELM327 Mode 01 response line (e.g. "41 0C 1A F8" or multi-line hex)
     */
    parseMode01(rawResponse: string): ObdPidResult | null;
    /**
     * Helper to parse 32-bit supported PID bitmask into human-readable PID array
     */
    static parseSupportedPidBitmap(dataBytes: number[], offset?: number): string[];
}
//# sourceMappingURL=obdParser.d.ts.map