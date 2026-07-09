const http = require('http');
const req = http.get('http://localhost:19006', res => {
  console.log('STATUS:', res.statusCode);
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log('BODY_LENGTH:', body.length));
});
req.on('error', e => console.log('ERROR:', e.message));
req.end();
