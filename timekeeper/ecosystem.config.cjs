module.exports = {
	apps: [
		{
			name: 'weather',
			script: 'weather.js',
			watch: true,
			cron_restart: '0 5,8,12 * * 1-5',
		},
		{
			name: 'timekeeper',
			script: 'timekeeper.js',
			watch: true,
			cron_restart: '0 4 * * 1-5',
		},
		{
			name: 'lunch',
			script: 'lunch.js',
			watch: true,
			cron_restart: '0 6 * * 1-5',
		},
		{
			name: 'onlinechecker',
			script: 'onlinechecker.js',
			watch: true,
			cron_restart: '0 */3 * * *',
		},
		{
			name: 'imagesaver',
			script: 'imagesaver.js',
			watch: true,
		},
	],
};
