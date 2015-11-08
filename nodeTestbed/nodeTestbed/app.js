//console.log('Hello world');

var UserProvider = require('./data/tablesafeUserProvider');
var userProvider = new UserProvider();

userProvider.authenticateUser('byuan@tablesafe.com', 'P@ssw0rd2015');


/* Fiddler Test
 * 
 * POST http://mcm01s01.dev.tsafe.systems:10080/mcm/ws/portal/user/login
 * 
 * User-Agent: Fiddler
 * content-type: application/json
 * Host: mcm01s01.dev.tsafe.systems:10080
 * Content-Length: 70
 * 
 * Body
 * {
 * "userName" : "byuan@tablesafe.com",
 * "password" : "P@ssw0rd2015"
 * }
 * 
 * Results
 * 7a
 * {"tokenSeed":"3ada1a7b19da34cd","id":705,"userAuthority":["ROLE_ADMIN","ROLE_USER"],"pwdExpiration":"01/12/2016 22:15:36"}
 * 0
*/