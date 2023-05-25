<template>
	<view>
		<view class="box-bg">
			<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration"
				class='swiper'>
				<swiper-item v-for="(item,index) in imgUrls" :key="index">
					<image :src="item.content" class="slide-image" width="355" height="150"
						@longpress="pictureDel(item.id)" />
				</swiper-item>
			</swiper>
		</view>
		<view class="box-bg">
			<uni-fab ref="fab" :content="content" :pattern="pattern" :horizontal="horizontal" :vertical="vertical"
				:direction="direction" @trigger="trigger" />
		</view>
	</view>
</template>

<script>
	export default {
		/**
		 * 页面的初始数据
		 */
		data() {
			return {
				imgUrls: [],
				imageValue: "",
				autoplay: true,
				interval: 5000,
				duration: 500,
				indicatorDots: false,
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
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
					text: '上传',
					active: 0
				}]
			};

		},
		methods: {
			trigger(e) {
				if (this.content[e.index].active == 0) {
					this.uploadImage();
				} else {
					this.pictureDel();
				}
			},

			// 上传图片成功后
			uploadImage(e) {
				let that = this;
				// 从相册选择1张图
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						uni.uploadFile({
							url: "https://www.sjcl.club/hotspotapi/upload/file",
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (res) => {
								that.upload(res.data);
							},
							fail: (err) => {}
						});

					}
				});
			},
			// 删除图片
			pictureDel(index) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: `确认删除图片？`,
					success: function(res) {
						if (res.confirm) {
							let delRes = that.$Tools.Axios({
								url: that.$api.car_common,
								method: 'POST',
								data: {
									"flag": "delete",
									"data": {
										"id": index
									}
								}
							});
							uni.showToast({
								title: "删除成功",
								icon: 'none'
							});
							that.imgList()
						}
					}
				})
			},
			// 获取广告图片
			imgList: async function() {
				let res = await this.$Tools.Axios({
					url: this.$api.car_common,
					method: 'POST',
					data: {
						"flag": "view",
						"data": {
							"type": "2"
						}
					}
				});
				if (res.result) {
					this.imgUrls = res.data
				} else {
					this.imgUrls = []
				}
			},
			upload: async function(val) {
				if (val != "") {
					let res = await this.$Tools.Axios({
						url: this.$api.car_common,
						method: 'POST',
						data: {
							"flag": "insert",
							"data": {
								"title": "广告链接",
								"content": val,
								"type": "2",
								"userId": "10000"
							}
						}
					});
					if (res.result) {
						uni.showToast({
							title: "上传成功",
							icon: 'none'
						});
						this.imgList()
					} else {
						uni.showToast({
							title: "上传失败",
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: '请上传图片后点击确认',
						icon: 'none'
					})
				}
			}
		},
		created() {
			this.imgList();
		}
	}
</script>

<style>
	.box-bg {
		background-color: #F5F5F5;
	}

	.swiper {
		height: 420rpx;
	}

	.swiper image {
		height: 100%;
		width: 100%;
	}
</style>
