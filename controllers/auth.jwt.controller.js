const expressJwt = require('express-jwt');
const config = require('../config.js');

module.exports = jwt;
function jwt() {
	let tokenjwt = config.tokenjwt
    const options = { 
    	secret:tokenjwt
    }
    let jwtData = expressJwt(options).unless({
        path: [
            // public routes that don't require authentication
            '/api/user/login',
            /^\/api\/fm\/download\/.*/,
            /^\/api\/product\/.*\/image/,
            /^\/api\/recipe\/.*\/image/
        ]
    });
    return jwtData 
}