const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const webEntry = {}
const weexEntry = {}
const config = require('./config')
const helper = require('./helper')
const vueLoaderConfig = require('./vue-loader.conf')
const vueWebTemp = helper.rootNode(config.templateDir)
const hasPluginInstalled = fs.existsSync(helper.rootNode(config.pluginFilePath))
const isWin = /^win/.test(process.platform)

// Wrapping the entry file for web.
const getEntryFileContent = (entryPath, vueFilePath) => {
	let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath)
	let relativeEntryPath = helper.rootNode(config.entryFilePath)
	let relativePluginPath = helper.rootNode(config.pluginFilePath)

	let contents = ''
	let entryContents = fs.readFileSync(relativeEntryPath).toString()
	if (isWin) {
		relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\')
		relativePluginPath = relativePluginPath.replace(/\\/g, '\\\\')
	}
	if (hasPluginInstalled) {
		contents += `\n// If detact plugins/plugin.js is exist, import and the plugin.js\n`
		contents += `import plugins from '${relativePluginPath}';\n`
		contents += `plugins.forEach(function (plugin) {\n\tweex.install(plugin)\n});\n\n`
		entryContents = entryContents.replace(/weex\.init/, match => `${contents}${match}`)
		contents = ''
	}
	contents += `\nconst App = require('${relativeVuePath}');\n`
	contents += `App.el = '#root';\n`
	contents += `new Vue(App);\n`
	// console.log(entryContents)
	return entryContents + contents
}

// Retrieve entry file mappings by function recursion
const getEntryFile = (dir) => {
	dir = dir || '.'
	const directory = helper.root(dir) // 拼接文件地址 root是开发页面的根路径
	console.log(`###directory: ${JSON.stringify(directory)}`)
	console.log(`###before: webEntry: ${JSON.stringify(webEntry)}`)
	console.log(`###before: weexEntry: ${JSON.stringify(weexEntry)}`)
	fs.readdirSync(directory).forEach((file) => { // 读取该路径下所有文件
		const fullpath = path.join(directory, file) // 拼接文件目录
		const stat = fs.statSync(fullpath) // 返回文件状态
		console.log(`###stat: ${JSON.stringify(stat)}`)
		const extname = path.extname(fullpath)
		console.log(`###extname: ${extname}`)
		if (stat.isFile() && extname === '.vue') {
			const name = path.join(dir, path.basename(file, extname)) // base 获取去除了后缀名的文件名
			console.log(`### path.basename(file, extname) :${ path.basename(file, extname)}`)
			if (extname === '.vue') { // 多余的判断
				console.log(`###vueWebTemp: ${vueWebTemp}`)
				const entryFile = path.join(vueWebTemp, dir, path.basename(file, extname) + '.js')
				console.log(`###entryFile: ${entryFile}`)
				fs.outputFileSync(path.join(entryFile), getEntryFileContent(entryFile, fullpath))
				console.log(`### getEntryFileContent(entryFile, fullpath): ${getEntryFileContent(entryFile, fullpath)}`)
				webEntry[name] = path.join(entryFile) + '?entry=true'  // 文件名映射到文件目录
			}
			weexEntry[name] = fullpath + '?entry=true' // 文件名映射到文件目录
		} else if (stat.isDirectory() && file !== 'build' && file !== 'include') {
			const subdir = path.join(dir, file)
			getEntryFile(subdir) // 递归遍历文件夹 查找vue文件
		}
	})
	console.log(`###after: webEntry: ${JSON.stringify(webEntry)}`)
	console.log(`###after: weexEntry: ${JSON.stringify(weexEntry)}`)
}

// Generate an entry file array before writing a webpack configuration
getEntryFile()
/**
 * Plugins for webpack configuration.
 */
const plugins = [
	/*
	 * Plugin: BannerPlugin
	 * Description: Adds a banner to the top of each generated chunk.
	 * See: https://webpack.js.org/plugins/banner-plugin/
	 */
	new webpack.BannerPlugin({
		banner: '// { "framework": "Vue"} \n',
		raw: true,
		exclude: 'Vue'
	})
]

// Config for compile jsbundle for web.
const webConfig = {
	entry: webEntry,
	output: {
		path: helper.rootNode('./dist'),
		filename: '[name].web.js'
	},
	/**
	 * Options affecting the resolving of modules.
	 * See http://webpack.github.io/docs/configuration.html#resolve
	 */
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': helper.resolve('src')
		}
	},
	/*
	 * Options affecting the resolving of modules.
	 *
	 * See: http://webpack.github.io/docs/configuration.html#module
	 */
	module: {
		// webpack 2.0
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader'
			}],
			exclude: /node_modules(?!(\/|\\).*(weex).*)/
		},
			{
				test: /\.vue(\?[^?]+)?$/,
				use: [{
					loader: 'vue-loader',
					options: Object.assign(vueLoaderConfig({ useVue: true, usePostCSS: false }), {
						/**
						 * important! should use postTransformNode to add $processStyle for
						 * inline style prefixing.
						 */
						optimizeSSR: false,
						compilerModules: [{
							postTransformNode: el => {
								el.staticStyle = `$processStyle(${el.staticStyle})`
								el.styleBinding = `$processStyle(${el.styleBinding})`
							}
						}]
					})
				}]
			},
			{
				test: /\.html$/,
				loader: 'raw-loader'
			}
		]
	},
	/*
	 * Add additional plugins to the compiler.
	 *
	 * See: http://webpack.github.io/docs/configuration.html#plugins
	 */
	plugins: plugins
}
// Config for compile jsbundle for native.
const weexConfig = {
	entry: weexEntry,
	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js'
	},
	/*
	 * Options affecting the resolving of modules.
	 *
	 * See: http://webpack.github.io/docs/configuration.html#module
	 */
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader'
			}]
		},
			{
				test: /\.vue(\?[^?]+)?$/,
				use: [{
					loader: 'weex-loader',
					options: vueLoaderConfig({ useVue: false })
				}]
			}]
	},
	/*
	 * Add additional plugins to the compiler.
	 *
	 * See: http://webpack.github.io/docs/configuration.html#plugins
	 */
	plugins: plugins,
	/*
	* Include polyfills or mocks for various node stuff
	* Description: Node configuration
	*
	* See: https://webpack.github.io/docs/configuration.html#node
	*/
	node: config.nodeConfiguration
}

module.exports = [webConfig, weexConfig]
