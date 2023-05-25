<template>
	<view>
		<uni-steps :options="list2" active-color="#007AFF" :active="active" direction="column" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,
				list2: [{
					title: '您的货物已经入仓，请您尽快确认进仓数据，谢谢',
					desc: '2018-11-11'
				}, {
					title: '您的货物已经装柜，预计离港2023/5/4；预计到港 2023/5/18',
					desc: '2018-11-12'
				}, {
					title: '您的货物已经报关放行',
					desc: '2018-11-13'
				}, {
					title: '您的货物已于5/4开船，预计到港时间5/18',
					desc: '2018-11-14'
				}],
				carLists: [],
				sortValue: false,
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				carInfo: {
					sellTitle: '',
					carBrand: '',
					carPrice: '',
					carFactoryTime: '',
					salesId: '',
					servicePrice: '',
					carImg: 'http://relax-dev.oss-cn-shanghai.aliyuncs.com/relax/202303/20230318225437893.jpg?' +
						'Expires=1994511277&OSSAccessKeyId=LTAI5t98Fq42xKzqRr2g2fD4&Signature=r1geN03PWpet7rom5ch5DcVut%2Fw%3D'
				},
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				content: [{
					iconPath: '/static/upload.png',
					selectedIconPath: '/static/upload.png',
					text: '下架车辆'
				}, {
					iconPath: '/static/upload.png',
					selectedIconPath: '/static/upload.png',
					text: '新增'
				}, ]
			};

		},
		methods: {
			// 选择品牌
			openBrandPage() {
				uni.navigateTo({
					url: '/pages/buy/brand',
					fail: (res) => {
						console.log(res) //打印错误信息
					}
				});
			},
			// 排序
			clickSort() {
				this.sortValue = !this.sortValue
				if (this.sortValue) {
					this.carList('sortup', true)
				} else {
					this.carList('sortdown', true)
				}
			},
			// 图片放大
			pictureView(index) {
				//准备一个装图片路径的  数组imgs
				let imgs = this.carLists.map(item => {
					//只返回图片路径
					return item.carImg
				})
				//调用预览图片的方法
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
			//新增车辆信息
			toAddCar: async function(e) {
				if (e.index == 0) {
					console.log(e.index) //打印错误信息

				} else if (e.index == 1) {
					let res = await this.$Tools.Axios({
						url: this.$api.car_save,
						method: 'POST',
						data: this.carInfo
					});
					if (res.result) {
						setTimeout(function() {
							uni.navigateTo({
								url: '/pages/home/vehicledit?jobNum=' + res.data,
								fail: (res) => {
									console.log(res) //打印错误信息
								}
							});
						}, 800)
					}
				}

			},
			//修改车辆信息
			toEditCar(e) {
				uni.navigateTo({
					url: '/pages/home/vehicledit?jobNum=' + e,
					fail: (res) => {
						console.log(res) //打印错误信息
					}
				});
			},
			// 获取车列表
			carList: async function(Fval, Vval) {
				console.log(Fval, Vval);
				let res = await this.$Tools.Axios({
					url: this.$api.car_list,
					method: 'POST',
					data: {
						"search": Fval == "search" ? Vval : "",
						"brand": Fval == "brand" ? Vval : "",
						"price": Fval == "price" ? Vval : "",
						"sortup": Fval == "sortup" ? Vval : "",
						"sortdown": Fval == "sortdown" ? Vval : ""
					}
				});
				if (res.result) {
					this.carLists = res.data
				} else {
					this.carLists = []
				}
			},
			// 下拉刷新
			onPullDownRefresh() {
				let _this = this;
				setTimeout(function() {
					_this.carList('sortdown', true)
					uni.stopPullDownRefresh();
				}, 500)
			},
			// 下架
			offlineEvent(carid) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: `确认下架车辆？`,
					success: function(res) {
						if (res.confirm) {
							that.$Tools.Axios({
								url: that.$api.car_del,
								method: 'POST',
								data: {
									"carId": carid
								}
							}).then(function(result) {
								if (result.result) {
									uni.showToast({
										title: "删除成功",
										duration: 1500
									});
									setTimeout(function() {
										that.carList()
									}, 1800)

								}
							}).catch(function(result) {
								uni.showToast({
									title: "删除异常",
									icon: 'fail'
								});
							});
						}
					}
				})
			},
			// 删除
			delEvent(carid) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: `确认删除车辆？`,
					success: function(res) {
						if (res.confirm) {
							that.$Tools.Axios({
								url: that.$api.car_del,
								method: 'POST',
								data: {
									"carId": carid
								}
							}).then(function(result) {
								if (result.result) {
									uni.showToast({
										title: "删除成功",
										duration: 1500
									});
									setTimeout(function() {
										that.carList()
									}, 1800)

								}
							}).catch(function(result) {
								uni.showToast({
									title: "删除异常",
									icon: 'fail'
								});
							});
						}
					}
				})
			}
		},
		// 获取搜索搜索返回值
		onShow() {
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1]; // 当前页的实例
			if (currPage.$vm.title == 'brand') {
				this.brandValue = currPage.$vm.value
				this.carList('brand', this.brandValue)
			} else if (currPage.$vm.title == 'search') {
				this.inputValue = currPage.$vm.value
				this.carList('search', this.inputValue)
			}
		},
		created() {
			this.carInfo.salesId = uni.getStorageSync('userId');
			this.carList('sortdown', true)
		}
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
		padding: 8px 10px !important;
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
</style>