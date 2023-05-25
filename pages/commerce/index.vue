<template>
	<view>
		<view class="box-bg">
			<u-swiper :list="imgUrls" height="230" keyName="image" showTitle bgColor="#ffffff" circular
				:interval="5000"></u-swiper>
		</view>

		<view class="switch" style="top: 15px;position: absolute;right: 10px;">
			<view :class="i18n == 'cn' ? 'switchNums currentNum':'switchNum'" @click="switchChange('cn')" data-index="cn">
				{{selectOpen[0]}}
			</view>
			<view :class="i18n == 'en' ? 'switchNums currentNum':'switchNum'" @click="switchChange('en')" data-index="en">
				{{selectOpen[1]}}
			</view>
		</view>


		<view class="box-bg" style="padding: 10px;">
			<u-grid :border="true" col="2" @click="click" align="center">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex"
					:customStyle="{width:280+'rpx',height:220+'rpx'
					,margin: 20+'rpx',background: '#FFFFF','border-radius': 30+'rpx','box-shadow':'2px 2px 5px 3px rgba(0, 0, 0, 0.1)','z-index':1}">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" :size="30"></u-icon>
					<text class="grid-text" style="margin: 20rpx;">
						{{ i18n == 'cn' ? listItem.title : listItem.titleEn }}
					</text>
				</u-grid-item>
			</u-grid>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>


<script>
	export default {
		data() {
			return {
				i18n: 'cn',
				selectOpen: ["CN", "EN"],
				indicatorDots: false,
				autoplay: true,
				interval: 5000,
				duration: 500,
				query: {
					search: "",
					brand: "",
					price: "",
					sortup: "",
					sortdown: true
				},
				list: [{
						name: 'file-text-fill',
						title: '箱单预报',
						titleEn: 'Order'
					},
					{
						name: 'car-fill',
						title: '轨迹查询',
						titleEn: 'Trace'

					},
					{
						name: 'grid-fill',
						title: '箱单入库',
						titleEn: 'Box List'
					},
					{
						name: 'map-fill',
						title: '仓库地址',
						titleEn: 'Warehouse'
					}
				],
				imgUrls: [{
					image: 'https://relax-dev.oss-cn-shanghai.aliyuncs.com/relax/202305/20230525205741400.jpg?' +
						'Expires=2000379461&OSSAccessKeyId=LTAI5t98Fq42xKzqRr2g2fD4',
					title: '优势航线：美国/加拿大/中东/印度/澳洲/智利'
				}, {
					image: 'https://relax-dev.oss-cn-shanghai.aliyuncs.com/relax/202305/20230525210809432.jpg?' +
						'Expires=2000380089&OSSAccessKeyId=LTAI5t98Fq42xKzqRr2g2fD4',
					title: '优势航线：美国/加拿大/中东/印度/澳洲/智利',
				}],
			}
		},
		methods: {
			switchChange(e) {

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
			click(name) {
				if (name == 0) {
					uni.navigateTo({
						url: '/pages/commerce/container',
						fail: (res) => {
							console.log(res) //打印错误信息
						}
					});
				} else if (name == 1) {
					uni.navigateTo({
						url: '/pages/commerce/trace',
						fail: (res) => {
							console.log(res) //打印错误信息
						}
					});
				} else if (name == 2) {
					uni.navigateTo({
						url: '/pages/commerce/containerList',
						fail: (res) => {
							console.log(res) //打印错误信息
						}
					});
				} else {
					this.$refs.uToast.default(`功能尚未开放`)
					return;
				}

			},
			pictureView(index) {
				//准备一个装图片路径的  数组imgs
				let imgs = this.imgUrls.map(item => {
					//只返回图片路径
					return item.content
				})
				//调用预览图片的方法
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
		},
		onShow() {
			if (uni.getStorageSync('i18n') != '') {
				this.i18n = uni.getStorageSync('i18n');

				uni.setNavigationBarTitle({
					title: this.i18n === 'cn' ? '集运' : 'Gather'
				});
			}
		},
		created() {}
	}
</script>

<style lang="scss">
	$nav-height: 30px;

	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	@mixin height {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.swiper {
		height: 380rpx;
	}

	.swiper image {
		height: 100%;
		width: 100%;
	}


	.box {
		@include flex;
	}


	.box-bg {
		background-color: #FFFFFF;
	}

	.city {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		// width: 160rpx;
		margin-left: 4px;
	}

	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// width: 500rpx;
		flex: 1;
		background-color: #f8f8f8;
		height: $nav-height;
		border-radius: 15px;
		padding: 0 15px;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: $nav-height;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.nav-bar-input {
		height: $nav-height;
		line-height: $nav-height;
		/* #ifdef APP-PLUS-NVUE */
		width: 370rpx;
		/* #endif */
		padding: 0 5px;
		font-size: 12px;
		background-color: #f8f8f8;
	}

	.text {
		font-size: 12px;
		color: #666;
		margin-top: 5px;
	}

	.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
	}

	.uni-pb-5 {
		padding-bottom: 10px;
	}

	.example-body {
		background-color: #fff;
		padding: 3px 15px;
		justify-content: space-between;
	}

	.popup-content {
		@include flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		height: 100px;
		background-color: #fff;
	}

	.popup-height {
		@include height;
		width: 200px;
	}

	.button-text {
		background-color: #fff;
		padding: 10px 15px;
		justify-content: space-between;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 110px;
		height: 70px;
	}

	.slot-text {
		flex: 1;
		font-size: 14px;
		color: #4cd964;
		margin-right: 10px;
	}

	.slot-right {
		position: absolute;
		top: 15px;
		right: 15px;
	}

	.uni-tag-text.data-v-1516016e {
		font-size: 8px !important;
	}

	.uni-tag--small.data-v-1516016e {
		padding: 0px 4px !important;
	}

	.uni-tag.data-v-1516016e {
		display: revert !important;
	}

	.error-uni-tag--inverted.data-v-1516016e {
		margin-right: 5px !important;
	}

	.uni-list--border-top {
		background-color: unset !important;
	}

	image {
		height: 100% !important;
		width: 80% !important;
		border-radius: unset !important;
	}

	.u-icon__icon {
		color: #2e4ab1 !important;
	}

	.switch {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 80px;
		height: 48rpx;
		border-radius: 48rpx;
		background: #f7f7fb;
		border: 1px solid #2e4ab1;
	}

	.switchNums {
		width: 100rpx;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 48rpx;
		text-align: center;
	}

	.switchNum {
		width: 85rpx;
		height: 48rpx;
		line-height: 48rpx;
		border-radius: 48rpx;
		text-align: center;
	}

	.currentNum {
		background: #2e4ab1;
		color: #ffffff;
	}
	
	.u-swiper__wrapper__item__wrapper__title {
	    padding: 14rpx 24rpx !important;
	}
</style>