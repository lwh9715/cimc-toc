import host_ from './request/config.js'
const Tools = {
	host: host_,
	Axios: function(options) {
		return new Promise((resolve, reject) => {
			console.log(`${host_.url}${options.url}`)
			uni.showLoading({
				title: '拼命请求中..'
			})
			uni.request({
				url: `${host_.url}${options.url}`,
				method: options.method || 'GET',
				data: options.data || {},
				//  'custom-header': 'hello' //自定义请求头信息 content-type:application/json
				header: {
					Authorization: uni.getStorageSync('accessToken') || {},
				},
				success: (res) => {
					resolve(res.data)
				},
				fail() {
					reject(false)
				},
				complete() {
					uni.hideLoading()
				}

			});
		})
	},
	isPhone: function(phones) {
		var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
		return myreg.test(phones)

	},
	getStorage: function(_key) {
		return new Promise((resolve, reject) => {
			uni.getStorage({
				key: _key,
				success: (res) => {
					resolve(res)
				},
				fail() {
					resolve('false')
				}
			});
		})
	}
}

export default Tools;
