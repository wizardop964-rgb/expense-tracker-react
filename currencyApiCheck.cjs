const https = require('https');
const urls = [
  'https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP',
  'https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR,GBP',
];

urls.forEach((url) => {
  https.get(url, { method: 'HEAD' }, (res) => {
    console.log('URL:', url);
    console.log('STATUS', res.statusCode, res.statusMessage);
    console.log(res.headers);
    console.log('---');
  }).on('error', (err) => console.error('ERR', url, err.message));
});
