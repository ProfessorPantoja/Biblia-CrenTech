const crc = require('crc');
console.log('Keys:', Object.keys(crc));
console.log('crc16ccitt type:', typeof crc.crc16ccitt);
try {
    console.log('crc16ccitt("123"):', crc.crc16ccitt("123").toString(16));
} catch (e) {
    console.log('Error calling crc16ccitt:', e.message);
}
