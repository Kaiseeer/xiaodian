// Helper functions
const path = require('path')
const ROOT = path.resolve(__dirname, '..')

const root = (args) => {
	console.log(`###ROOT: ${ROOT}`)
	console.log(`###args: ${JSON.stringify(args)}`)
	return path.join(ROOT, 'src', args)
}
const rootNode = (args) => {
	return path.join(ROOT, args)
}

const resolve = (dir) => {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	root,
	rootNode,
	resolve
}