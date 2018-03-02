<template>
  <div class="wrapper">
    <image :src="logo" class="logo"></image>
    <text class="greeting">The environment is ready!</text>
    <text class="message">这是b.vue</text>
    <a @click="jump">
      <text>Jump to index.vue</text>
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
		created () {
			console.log(`### Created ###`)
		},
		methods: {
			jump (event) {
				var url = 'file://assets/dist/index.js'
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
</style>
