var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
	prompting: function () {
		var done = this.async();
		this.prompt([{
			type: 'input',
			name: 'projectName',
			message: 'Your project name',
			default: this.appname
		}, {
			type: 'input',
			name: 'githubUsername',
			message: 'Your Github Username'
		}, {
			type: 'input',
			name: 'shortDescription',
			message: 'Please Enter A Short Description Of This Project',
			default: 'A project that can'
		}, {
			type: 'list',
			name: 'license',
			message: 'Which License do you want to use?'
			+ '\n DISCLAIMER: I DO NOT TAKE RESPONSIBILITY IF THIS TOOL DOES NOT GENERATE THE CORRECT LICENSE. CHECK YOUR LICENSE.md AND package.json MANUALLY TO VERIFY ITS CONTENT.',
			default: 'MIT',
			choices: ['Apache v2.0', 'BSD-2', 'BSD-3', 'AGPL v3', 'GPL v3', 'ISC', 'LGPL v3', 'MIT', 'No License' , 'Public Domain (Unlicense)']
		}, {
			type: 'input',
			name: 'copyrightName',
			message: 'Your Copyright Name',
			default: function (answers) {
				return answers.githubUsername;
			}
		}], function (answers) {
			this.projectName = answers.projectName;
			this.githubUsername = answers.githubUsername;
			this.shortDescription = answers.shortDescription;
			switch (answers.license) {
				case 'Apache v2.0':
					this.license = 'apache-2.md';
					this.spdx = 'Apache-2.0';
				break;
				case 'BSD-2':
					this.license = 'bsd-2.md';
					this.spdx = 'BSD-2-Clause';
				break;
				case 'BSD-3':
					this.license = 'bsd-3.md';
					this.spdx = 'BSD-3-Clause';
				break;
				case 'AGPL v3':
					this.license = 'agpl-3.md';
					this.spdx = 'AGPL-1.0';
				break;
				case 'GPL v3':
					this.license = 'gpl-3.md';
					this.spdx = 'GPL-3.0';
				break;
				case 'ISC':
					this.license = 'isc.md';
					this.spdx = 'ISC';
				break;
				case 'LGPL v3':
					this.license = 'lgpl-3.md';
					this.spdx = 'LGPL-3.0';
				break;
				case 'MIT':
					this.license = 'mit.md';
					this.spdx = 'MIT';
				break;
				case 'No License':
					this.license = 'no-license.md';
					this.spdx = 'LicenseRef-LICENSE.md';
				break;
				case 'Public Domain (Unlicense)':
					this.license = 'public-domain.md';
					this.spdx = 'Unlicense';
				break;
			}
			this.copyrightName = answers.copyrightName;
			done();
		}.bind(this));
	},
	writing: function () {
		var options = {
			projectName: this.projectName,
			githubUsername: this.githubUsername,
			shortDescription: this.shortDescription,
			copyrightName: this.copyrightName,
			year: new Date().getFullYear(),
			spdx: this.spdx
		};
		this.fs.copyTpl(
			this.templatePath('**/*'),
			this.destinationRoot(),
			options
		);
		this.fs.copyTpl(
			this.templatePath('.*'),
			this.destinationRoot(),
			options
		);
		this.fs.copyTpl(
			this.templatePath('../../../licenses/' + this.license),
			this.destinationPath('./LICENSE.md'),
			options
		);
		this.npmInstall(['coveralls', 'expect.js', 'istanbul', 'mocha'], {'saveDev': true});
	}
});
