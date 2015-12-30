var UserProvider = require('../data/tablesafeUserProvider');
var userProvider = new UserProvider();

//userProvider.authenticateUser('byuan@tablesafe.com', 'P@ssw0rd2015');

// LOCAL DEV Test
userProvider.authenticateUser('boadmin1', 'Password123!');