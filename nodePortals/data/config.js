var config = {};

// --- DEV MCM Setting
//config.base_url = 'mcm01s01.dev.tsafe.systems';
//config.port = '10080';
//config.service_path = '/mcm/ws/portal';

// --- LOCAL DEV MCM Setting
config.base_url = '192.168.0.83';
config.port = '8081';
config.service_path = '/viableware-mcm/ws/portal';

module.exports = config;