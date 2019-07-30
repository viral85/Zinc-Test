const https = require('https');

const responseConfiguration = (req, callback) => 
{
    if (typeof callback !== "function") { return; }
    req.on('response', (res) => {
        let response = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            response += chunk;
        });

        res.on('end', () => {
            var err = null;
            try {
                response = JSON.parse(response);
                if (200 != res.statusCode) {
                    err = new Error(response.error.message);
                    err.name = response.error.type;
                    err.code = response.error.code;
                    err.param = response.error.param;
                    response = null;
                }
                callback(err, response);
            }
            catch (e) { callback(e, null); }
        });
    });
    req.on('error', (error) => { callback(error); });
}

module.exports = (api_key) =>
{
    const authToken = 'Basic ' + new Buffer(api_key + ":").toString('base64');

    const _request = (httpMethod, httpURL, data, callback) => 
    {
        data = JSON.stringify(data);
        const req = https.request({
            host: 'api.zinc.io',
            port: '443',
            path: httpURL,
            method: httpMethod,
            headers: {
                'Authorization': authToken,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
        });
        responseConfiguration(req, callback);
        req.write(data);
        req.end();
    }

    return {
        processRequest: (requestType, URL, data, cb) => _request(requestType, URL, data, cb)
    };
}