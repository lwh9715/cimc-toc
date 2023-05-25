<template>
	<view class="Logincontent">
		<view class="header">
			<image :src="formData.avatar"></image>
		</view>
		<view class="input_group">
			<view class="list">
				<text style="width: 75px;font-weight: 700;">
					{{i18n == 'cn' ? '账号：' : 'Account：'}}
				</text>
				<view class="icon iconfontL icon-avatar" />
				<input type="text" v-model="formData.username" :placeholder="i18n == 'cn' ? '请输入账号' : 'Account'" />
			</view>
			<view class="divider" />
			<view class="list">
				<text style="width: 75px;font-weight: 700;">
					{{i18n == 'cn' ? '密码：' : 'Password：'}}
				</text>
				<view class="icon iconfontL icon-phone" />
				<input type="password" v-model="formData.password" :placeholder="i18n == 'cn' ? '请输入密码' : 'Password'" />
			</view>
			<view class="divider" />
		</view>

		<view class="btn">
			<button type="default" @click="onLogin()">{{i18n == 'cn' ? '立即登录' : 'Login'}}</button>
			<!-- <button type="default" style="background-color: #4CAF50;" @click="wechatLogin()">
				{{i18n == 'cn' ? '微信登录' : 'WeChat Login'}}
			</button> -->
		</view>

		<view class="time-class">
			<checkbox-group @change="checkboxChange">
				<checkbox value="1" color="#2e4ab1" style="transform:scale(0.7)" />
				{{i18n == 'cn' ? '阅读并同意' : 'Read and agree'}}
				<text style="color: #2e4ab1;" @click="viewNotice">
					{{i18n == 'cn' ? '《服务协议》' : '《Service Agreement》'}}
				</text>
			</checkbox-group>
			<!-- <view>{{ countdown }}</view> -->
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				i18n: 'cn',
				boxMode: "",
				countdown: "",
				formData: {
					isread: "on",
					username: "",
					nickname: "途C物流",
					password: "",
					avatar: "http://prod-auops.oss-cn-shenzhen.aliyuncs.com/LOGO/330/logo.png" +
						"?Expires=4837055157&OSSAccessKeyId=LW6Q1beRi0R3m14r&Signature=QBY54M1xr2z73Sy1gdAuecUCbo8%3D"
				}
			}
		},
		methods: {
			checkboxChange: function(e) {
				this.boxMode = e.detail.value;
			},
			viewNotice: function() {
				uni.showToast({
					icon: 'none',
					title: this.i18n === 'cn' ? '请勾选服务协议' : 'Please tick the service agreement'
				})
			},
			wechatLogin: async function() {
				var _this = this;
				uni.getUserProfile({
					desc: "获取你的昵称、头像、地区及性别",
					success: (res) => {
						console.log("用户信息", res.userInfo);
						_this.userInfo = res.userInfo
						_this.wxLogin()
					},
					fail: (res) => {
						console.log("授权失败", res)
						uni.showToast({
							title: "微信登录授权失败",
							icon: "none"
						});
					},
				})
			},
			/**
			 * 向微信服务器请求获取登录信息
			 */
			wxLogin() {
				var _this = this;
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: (res) => {
									_this.jscode = res.code;
									_this.getOpenId();
								},
								fail: (res) => {
									console.log("授权失败", res)
									uni.showToast({
										title: "微信登录授权失败",
										icon: "none"
									});
								},
							})
						} else {
							uni.showToast({
								title: '请先安装微信或升级版本',
								icon: "none"
							});
						}
					}
				});
			},
			/**
			 * 获取openid
			 */
			getOpenId: async function() {
				var _this = this;
				_this.userInfo.code = _this.jscode;
				let res = await _this.$Tools.Axios({
					url: this.$api.getOpenId,
					data: _this.userInfo,
					method: 'POST'
				});
				if (res.result) {

					uni.setStorageSync('accessToken', res.data.token);
					uni.setStorageSync('userInfo', res.data.userInfo);
					uni.switchTab({
						url: '/pages/home/index',
						success: function(e) {
							var page = getCurrentPages().pop();
							if (page == undefined || page == null) return;
							page.onShow();
						},
						fail: (res) => {
							console.log(res) //打印错误信息
						}
					});
				} else {
					uni.showToast({
						icon: 'error',
						title: res.data
					})
				}
			},
			onLogin: async function() {

				if (this.formData.username == "" || this.formData.password.trim().length <= 0) {
					uni.showToast({
						icon: 'none',
						title: this.i18n === 'cn' ? '账号错误/密码为空' : 'Account number error/password is empty'
					})
					return false;
				}

				this.formData.password = this.$md.hex_md5(this.formData.password);

				let res = await this.$Tools.Axios({
					url: this.$api.login,
					data: this.formData,
					method: 'POST'
				});
				if (res.success) {

					uni.setStorageSync('userInfo', res);
					uni.switchTab({
						url: '/pages/commerce/index',
						success: function(e) {
							var page = getCurrentPages().pop();
							if (page == undefined || page == null) return;
							page.onShow();
						},
						fail: (res) => {
							console.log(res) //打印错误信息
						}
					});

				} else {
					uni.showToast({
						icon: 'none',
						title: res.message
					})

					this.formData.password = '';
				}
			},
			onRegister: async function() {
				if (this.formData.username == "" || this.formData.password.trim().length <= 0) {
					uni.showToast({
						icon: 'none',
						title: this.i18n === 'cn' ? '账号/密码必填' : 'Account number/password is required'
					})
					return false
				}
				let res = await this.$Tools.Axios({
					url: this.$api.user_register,
					data: this.formData,
					method: 'POST'
				});
				if (res.result) {
					this.formData = {}
					uni.showToast({
						icon: 'succee',
						title: `注册账号成功`
					})
				} else {
					uni.showToast({
						icon: 'error',
						title: res.message
					})
				}
			},
			initCountdown() {
				const end = Date.parse(new Date('2024-01-01 00:00:00'))
				const now = Date.parse(new Date())
				const msec = end - now
				let day = parseInt(msec / 1000 / 60 / 60 / 24)
				let hr = parseInt((msec / 1000 / 60 / 60) % 24)
				let min = parseInt((msec / 1000 / 60) % 60)
				let sec = parseInt((msec / 1000) % 60)

				this.countdown =
					'2023年余' + day + '天' + hr + '时' + min + '分' + sec + '秒'

				setTimeout(() => {
					if (msec < 0) return
					this.initCountdown()
				}, 1000)
			}
		},
		onShow() {
			if (uni.getStorageSync('i18n') != '') {
				this.i18n = uni.getStorageSync('i18n');
				uni.setNavigationBarTitle({
					title: this.i18n === 'cn' ? '登录' : 'Login'
				});
			}
		},
		created() {
			// this.initCountdown()
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../static/style/login/login.scss'
</style>