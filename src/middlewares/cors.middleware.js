'use strict';

exports.createCorsMiddleware = () => {

    return (req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

        if (req.method === 'OPTIONS') {
            return res.send(200);
        } else {
            return next();
        }
    };
}
