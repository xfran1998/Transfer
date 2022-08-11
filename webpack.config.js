const path = require('path');
const glob = require('glob');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	// entry: ['./src/async.js', './src/files.js', './src/notify.js', './src/main.js', './src/admin.js', './src/login.js'],
	entry: {
		main: ['./src/async.js', './src/files.js', './src/notify.js', './src/main.js'],
		admin_init: ['./src/admin_init.js'],
		users_init: ['./src/users_init.js'],
		login_init: ['./src/login_init.js'],
		folders_init: ['./src/folders_init.js'],
		user_panel_init: ['./src/user_panel_init.js'],
	},
	output: {
		path: path.resolve(__dirname, 'public', 'js'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.html$/,
				use: ['html-loader']
			}
		]
	}
};