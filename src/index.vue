<template>
  <div class="wrapper">
    <image :src="logo" class="logo"></image>
    <text class="greeting">The environment is ready!</text>
    <text class="message">Now, let's use Vue.js to build your Weex app.</text>
    <a @click="jump">
      <text>Jump to a.vue</text>
    </a>
  </div>
</template>

<script>
	var navigator = weex.requireModule('navigator')
	import getBaseURL from './utils/base-url'

	export default {

		data () {
			return {
				logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png'
			}
		},
		methods: {
			jump (event) {
				var url = this.$getConfig().bundleUrl
				url = url.split('/').slice(0, -1).join('/') + '/a.js'
				console.log(url)
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
