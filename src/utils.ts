const isString = (data: any): data is string | String => {
    return typeof data === 'string' || data instanceof String;
};

export const binaryStringToArray = (str: string) => {
    if (!isString(str)) {
        throw new Error('binaryStringToArray: Data must be in the form of a string');
    }

    const result = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        result[i] = str.charCodeAt(i);
    }
    return result;
};

export const arrayToBinaryString = (bytes: Uint8Array) => {
    const result = [];
    const bs = 1 << 14;
    const j = bytes.length;

    for (let i = 0; i < j; i += bs) {
        // @ts-ignore Uint8Array treated as number[]
        result.push(String.fromCharCode.apply(String, bytes.subarray(i, i + bs < j ? i + bs : j)));
    }
    return result.join('');
};
