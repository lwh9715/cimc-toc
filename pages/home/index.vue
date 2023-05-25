<template>
	<view>
		<view>
			<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration"
				class='swiper'>
				<swiper-item v-for="(item,index) in imgUrls" :key="index">
					<image :src="item.img" class="slide-image" width="355" height="150" mode="aspectFit"
						@click="pictureView(index)" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 登录 -->
		<view class="header">
			<view>
				<image :src="avatar" class="img-item"></image>
			</view>
			<view>
				<text class="title"
					@click="userInfo.corpid == '' ? toLogin() : ''">{{ i18n == 'cn' ? userInfo.namec : userInfo.namee == null ? userInfo.namec : 'TOC' }}</text>
				<text class="description">凝心聚力，世无界，联必达</text>
			</view>
		</view>
		<view class="board">
			<!-- 			<navigator url="./publicize" open-type="navigate" v-if="isadmin">
				<view class='board-item'>
					<text>广告管理</text>
					<image src='../../static/right.png' mode='aspectFill' />
				</view>
			</navigator> -->
			<navigator url="/" open-type="navigate" @click="showI18n = true">
				<view class='board-item'>
					<text>{{i18n == 'cn' ? '切换语言' : 'Switch Language'}}</text>
					<image src='../../static/right.png' mode='aspectFill' />
				</view>
			</navigator>
			<navigator url="/" open-type="navigate" @click="exitLogin()" v-if="userInfo.corpid != ''">
				<view class='board-item'>
					<text>{{i18n == 'cn' ? '退出登录' :  'Log Out'}}</text>
					<image src='../../static/right.png' mode='aspectFill' />
				</view>
			</navigator>
		</view>

		<u-popup :show="showI18n" @close="showI18n = false" :round="20">
			<view style="text-align: center;">
				<uni-list v-for="(item,index) in i18nList" index="index">
					<uni-list-item :title="i18n == 'cn' ? item.name : item.namee" @click="changeI18n(item.value)"
						clickable />
				</uni-list>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		/**
		 * 页面的初始数据
		 */
		data() {
			return {
				i18n: 'cn',
				showI18n: false,
				i18nList: [{
					name: '简体中文',
					namee: 'Chinese',
					value: 'cn'
				}, {
					name: '英文',
					namee: 'English',
					value: 'en'
				}],
				imgUrls: [{
					name: "中集世联达",
					img: 'https://relax-dev.oss-cn-shanghai.aliyuncs.com/relax/202305/20230525205741400.jpg?' +
						'Expires=2000379461&OSSAccessKeyId=LTAI5t98Fq42xKzqRr2g2fD4'
				}, {
					name: "途C物流",
					img: 'http://prod-auops.oss-cn-shenzhen.aliyuncs.com/LOGO/330/logo.png?' +
						'Expires=4837055157&OSSAccessKeyId=LW6Q1beRi0R3m14r&Signature=QBY54M1xr2z73Sy1gdAuecUCbo8%3D'
				}],
				indicatorDots: false,
				autoplay: true,
				interval: 5000,
				duration: 500,
				avatar: "https://mmbiz.qlogo.cn/mmbiz_png/5xQkiaiatmBjhzt7TBWe8x5n20MZyzjdib8IpbjZsOyaOlyqEMt18LVQu5YQlbVseibiaP8OYqibho5ztWOmBvaDsmiaQ/0?wx_fmt=png",
				userInfo: {
					id: "",
					namec: "Login",
					corpid: ""
				}
			};

		},
		methods: {
			changeI18n(e) {
				this.i18n = e;
				uni.setStorageSync('i18n', e);
				this.showI18n = false;

				// 修改头部标题
				uni.setNavigationBarTitle({
					title: this.i18n === 'cn' ? '我的' : 'Home'
				});

				// 修改底部导航 0
				uni.setTabBarItem({
					index: 0,
					text: this.i18n === 'cn' ? '集运' : 'Gather'
				});
				// 修改底部导航 1
				uni.setTabBarItem({
					index: 1,
					text: this.i18n === 'cn' ? '查询轨迹' : 'Trace'
				});
				// 修改底部导航 2
				uni.setTabBarItem({
					index: 2,
					text: this.i18n === 'cn' ? '我的' : 'Home'
				});
			},
			pictureView(index) {
				//准备一个装图片路径的  数组imgs
				let imgs = this.imgUrls.map(item => {
					//只返回图片路径
					return item.img
				})
				//调用预览图片的方法
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
			exitLogin() {
				uni.showModal({
					title: this.i18n === 'cn' ? '提示' : 'remind',
					content: this.i18n === 'cn' ? `确认退出登录？` : `Confirm logout login？`,
					success: function(res) {
						if (res.confirm) {

							uni.navigateTo({
								url: '/pages/login/login',
								success: function(e) {
									uni.removeStorageSync("userInfo");
								},
								fail: (res) => {
									console.log(res) //打印错误信息
								}
							});
						}
					}
				})
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
					success: function(e) {
						uni.removeStorageSync("userInfo");
					},
					fail: (res) => {
						console.log(res) //打印错误信息
					}
				});
			}
		},
		onShow() {
			if (uni.getStorageSync("userInfo") != '') {
				this.userInfo = uni.getStorageSync("userInfo")
			}
			if (uni.getStorageSync('i18n') != '') {
				this.i18n = uni.getStorageSync('i18n');

				// 修改头部标题
				uni.setNavigationBarTitle({
					title: this.i18n === 'cn' ? '我的' : 'Home'
				});

				// 修改底部导航 0
				uni.setTabBarItem({
					index: 0,
					text: this.i18n === 'cn' ? '集运' : 'Gather'
				});
				// 修改底部导航 1
				uni.setTabBarItem({
					index: 1,
					text: this.i18n === 'cn' ? '查询轨迹' : 'Trace'
				});
				// 修改底部导航 2
				uni.setTabBarItem({
					index: 2,
					text: this.i18n === 'cn' ? '我的' : 'Home'
				});
			}

		}
	}
</script>

<style>
	.swiper {
		height: 420rpx;
	}

	.swiper image {
		height: 100%;
		width: 100%;
	}

	.header {
		display: flex;
		padding: 40rpx 30rpx 20rpx;
	}

	.title {
		display: block;
		font-size: 50rpx;
	}

	.description {
		display: block;
		margin-top: 30rpx;
		color: #888;
		font-size: 28rpx;
	}

	.img-item {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-top: 12rpx;
		margin-right: 30rpx;
	}

	.board {
		overflow: hidden;
	}

	.board-item {
		display: flex;
		cursor: pointer;
		margin-top: 10rpx;
		padding: 30rpx;
	}

	.board-item text {
		flex: 1;
		width: 40rpx;
		height: 40rpx;
	}

	.board-item image {
		width: 40rpx;
		height: 40rpx;
	}

	.u-popup__content {
		max-height: calc(100vh - 305px);
	}

	.uni-list--border-top {
		background-color: unset !important;
	}
</style>