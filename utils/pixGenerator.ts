function generateCRC16(payload: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
            else crc = crc << 1;
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export const generatePix = (amount: number) => {
    const key = 'artpantoja@gmail.com';
    const name = 'Fabio Pantoja';
    const city = 'Sao Paulo';
    const txId = '***';

    const formatField = (id: string, value: string) => {
        const len = value.length.toString().padStart(2, '0');
        return id + len + value;
    };

    const amountStr = amount.toFixed(2);

    let payload = '000201';
    payload += formatField('26', `0014br.gov.bcb.pix01${key.length.toString().padStart(2, '0')}${key}`);
    payload += formatField('52', '0000');
    payload += formatField('53', '986');
    payload += formatField('54', amountStr.length.toString().padStart(2, '0') + amountStr);
    payload += formatField('58', 'BR');
    payload += formatField('59', name);
    payload += formatField('60', city);
    payload += formatField('62', formatField('05', txId));
    payload += '6304';

    const crc = generateCRC16(payload);
    return payload + crc;
};
