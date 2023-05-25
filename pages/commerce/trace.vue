<template>
	<view>
		<view class="box-bg" style="padding: 1px;">
			<uni-list v-for="(item,index) in commerceList">
				<uni-list-item direction="column">
					<template v-slot:header>
						<view class="slot-box">
							<uni-card :title="item.nos"
								:extra=" i18n == 'cn' ? '目的地：' + item.destcountry : 'To：'+ item.destcountry"
								style="border-radius: 15px;" :is-shadow="true">
								<uni-collapse ref="collapse">
									<uni-collapse-item :title="i18n == 'cn' ? '轨迹动态':'Trace dynamics'">
										<uni-steps :options="JSON.parse(item.tracklist)" active-color="#007AFF"
											direction="column" />
									</uni-collapse-item>
								</uni-collapse>
							</uni-card>

						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				i18n: 'cn',
				userInfo: {
					corpid: '57689728888'
				},
				commerceList: []
			};

		},
		methods: {
			// 获取列表
			queryCommerceList: async function(Fval, Vval) {
				console.log(Fval, Vval);
				let res = await this.$Tools.Axios({
					url: this.$api.commerceList,
					method: 'GET',
					data: {
						corpid: this.userInfo.corpid
					}
				});
				if (res.Data) {
					this.commerceList = res.Data
				} else {
					this.commerceList = []
				}
			},
			// 下拉刷新
			onPullDownRefresh() {
				let _this = this;
				setTimeout(function() {
					_this.queryCommerceList()
					uni.stopPullDownRefresh();
				}, 500)
			},
		},
		onShow() {
			if (uni.getStorageSync("userInfo") != '') {
				this.userInfo = uni.getStorageSync("userInfo")
			}
			if (uni.getStorageSync('i18n') != '') {
				this.i18n = uni.getStorageSync('i18n');

				uni.setNavigationBarTitle({
					title: this.i18n === 'cn' ? '轨迹' : 'Trace'
				});
			}
			this.queryCommerceList();
		},
		created() {}
	}
</script>

<style lang="scss">
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

	.box {
		@include flex;
	}

	.box-bg {
		background-color: #F5F5F5;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		width: 100px;
		height: 60px;
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

	.slot-center {
		position: absolute;
		top: 15px;
		left: 120px;
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

	.uni-list-item__container {
		padding: 0px 0px !important;
	}

	.example-body {
		background-color: #fff;
		padding: 3px 15px;
		justify-content: space-between;
	}

	.button-text {
		background-color: #fff;
		padding: 10px 15px;
		justify-content: space-between;
	}

	button[size=mini] {
		display: inline-block;
		font-size: 10px;
		line-height: 2;
		padding: 0 1.38em;
	}

	.uni-card__content {
		padding: 5px !important;
	}

	.uni-steps__column-title {
		font-size: 14px;
		text-align: left;
		line-height: 18px;
		// width: 250px;
		// overflow: hidden;
		// white-space: nowrap;
		// text-overflow: ellipsis;
	}

	.uni-collapse-item__title.uni-collapse-item-border {
		border-bottom: unset !important;
	}

	.uni-steps__column-text.data-v-1ec1e3f6 {
		border-bottom-width: 0px !important;
	}

	.uni-collapse-item__wrap-content.uni-collapse-item--border {
		border-bottom-width: 0px !important;
	}

	.uni-steps__column-title {
		font-size: 12px !important;
		width: 95%;
	}

	.uni-row {
		text-align: center;
		margin: 10px 0px;
	}
</style>