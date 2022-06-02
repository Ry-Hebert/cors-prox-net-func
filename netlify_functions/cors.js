const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
// const cors = require('cors')
const app = express()

let myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'PUT', 'PATCH',  'POST', 'DELETE'],
//     credentials: true,
// }))

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", 'X-Requested-With, Content-Type, Authorization, Origin, Accept');
    res.header("Access-Control-Allow-Origin", "http://localhost:3000/Home, https://dev-support-dashboard.netlify.app/, *");
    res.header('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        let targetURL = req.header('Target-URL'); // Target-URL ie. https://example.com or http://example.com
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        request({ url: targetURL + req.url + '/', method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
//                console.log(body);
            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3005);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});