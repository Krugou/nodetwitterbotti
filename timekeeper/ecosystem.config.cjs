module.exports = {
	apps: [
		{
			name: 'weather',
			script: 'weather.js',
			watch: true,
			cron_restart: '0 7,11,15 * * 1-5',
			min_uptime: 10000,
			ignore_watch: ['node_modules', 'logs', 'package-lock.json'],
			watch_delay: 3000,
		},
		{
			name: 'timekeeper',
			script: 'timekeeper.js',
			watch: true,
			cron_restart: '0 7,8 * * 1-5',
			min_uptime: 10000,
			ignore_watch: ['node_modules', 'logs', 'package-lock.json'],
			watch_delay: 3000,
		},
		{
			name: 'lunch',
			script: 'lunch.js',
			watch: true,
			cron_restart: '0 10,12 * * 1-5',
			min_uptime: 10000,
			ignore_watch: ['node_modules', 'logs', 'package-lock.json'],
			watch_delay: 3000,
		},
		{
			name: 'onlinechecker',
			script: 'onlinechecker.js',
			watch: true,
			cron_restart: '0 */15 * * *',
			min_uptime: 10000,
			ignore_watch: ['node_modules', 'logs', 'package-lock.json'],
			watch_delay: 3000,
		},
		{
			name: 'imagesaver',
			script: 'imagesaver.js',
			watch: true,
			cron_restart: '0 0 * * *',
			min_uptime: 10000,
			ignore_watch: ['node_modules', 'logs', 'package-lock.json'],
			watch_delay: 3000,
		},
		{
			name: 'gitPuller'
			script: 'gitPuller.js',
			watch: true,
			cron_restart: '0 1 * * *',
			min_uptime: 10000,
			ignore_watch: [ 'node_modules', 'logs', 'package-lock.json' ],
			watch_delay: 3000,
		}
	],
};
