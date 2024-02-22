const {exec} = require('child_process');

const gitPullAndRestart = () => {
	exec('git pull', (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing git pull: ${error}`);
			return;
		}

		if (stdout.includes('Already up to date.')) {
			console.log('Already up to date. No changes to pull.');
			return;
		}

		console.log('Git pull successful. Restarting...');
		exec(
			'pm2 delete all &&  pm2 start ecosystem.config.cjs',
			(error, stdout, stderr) => {
				if (error) {
					console.error(`Error restarting the application: ${error}`);
					return;
				}
				console.log('Application restarted successfully');
			}
		);
	});
};

gitPullAndRestart();
