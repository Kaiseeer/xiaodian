<template>
  <div class="wrapper">
    <image :src="logo" class="logo"></image>
    <text class="greeting">The environment is ready!</text>
    <text class="message">Now, let's use Vue.js to build your Weex app.</text>
    <a class="btn" @click="jump('file://assets/a.js')">
      <text>file://assets/a.js</text>
    </a>
    <a class="btn" @click="jump('file://assets/b.js')">
      <text>file://assets/b.js</text>
    </a>
    <a class="btn" @click="jump('file://assets/dist/a.js')">
      <text>file://assets/dist/a.js</text>
    </a>
    <a class="btn" @click="jump('file://assets/dist/b.js')">
      <text>file://assets/dist/b.js</text>
    </a>
  </div>
</template>

<script>
	var navigator = weex.requireModule('navigator')
	var getBaseURL = require('./utils/base-url.js').getBaseURL

	export default {

		data () {
			return {
				logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png'
			}
		},
		methods: {
			jump (event) {
				var url = 'file://assets/dist/b.js'
				navigator.push({
					url: url,
					animated: 'true'
				}, event => {
					console.log(`##weex.config.bundleUrl: ${weex.config.bundleUrl}##`)
				})
			}
		}
	}
</script>

<style scoped>
  .wrapper {
    justify-content: center;
    align-items: center;
  }

  .logo {
    width: 424px;
    height: 200px;
  }

  .greeting {
    margin-top: 70px;
    font-size: 50px;
    color: #41B883;
  }

  .message {
    margin: 30px;
    font-size: 32px;
    color: #727272;
  }

  .btn {
    width: 750px;
    height: 200px;
    background: #c0c0c0;
    margin-bottom: 10px;
    text-align: center;
  }
</style>
