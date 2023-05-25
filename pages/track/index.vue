<template>
	<view>
		<view class="box-bg">
			<uni-row>
				<uni-col :span="18">
					<uni-search-bar :placeholder="i18n == 'cn' ? '请输入单号' : 'Please enter a single number'"
						cancelButton="none" @confirm="queryTracking(inputValue)" :focus="true" v-model="inputValue">
						<uni-icons slot="searchIcon" color="#999999" size="18" type="search" />
					</uni-search-bar>
				</uni-col>
				<uni-col :span="6">
					<button type="primary" style="background-color: #2e4ab1;" @click="queryTracking(inputValue)">
						{{ i18n == 'cn' ? '查轨迹' : 'Trace' }}
					</button>
				</uni-col>
			</uni-row>
		</view>

		<view style="height: 240rpx;">
			<view>
				<uni-nav-bar :leftText="i18n == 'cn' ? '历史记录':'History'" right-icon="trash"
					@clickRight="clearHistory" />
			</view>
			<view class="view-body">
				<view class="example-body-item" v-for="(item,index) in searchList">
					<view @click="queryTracking(item.name,index)">{{item.name}}</view>
				</view>
			</view>
		</view>

		<u-popup :show="show" @close="show = false" :round="20">
			<view style="margin-top: 10px;" />
			<view class="flex start" style="padding: 5px 15px;align-items: center;font-size:18px;">
				<text style="display: -webkit-inline-box;min-width: 70px;">
					{{ i18n == 'cn' ? '发件地：' :'From：' }}
				</text>
				<uni-icons type="location"></uni-icons>
				<text style="font-size:16px;font-weight: 700;padding-left: 5px;">{{commerce.pol}}</text>
			</view>
			<view style="border-bottom: 1px solid rgb(234 234 234);margin-bottom: 1rpx;" />
			<view class="flex start" style="padding: 5px 15px;align-items: center;font-size:18px;">
				<text style="display: -webkit-inline-box;min-width: 70px;">
					{{ i18n == 'cn' ? '目的地：' :'To：' }}
				</text>
				<uni-icons type="location-filled"></uni-icons>
				<text style="font-size:16px;font-weight: 700;padding-left: 5px;">{{commerce.pod}}</text>
			</view>

			<uni-section class="mb-10" :title="i18n == cn ? '轨迹动态' : 'Trace dynamics'" style="overflow-y: auto;">
				<uni-steps :options="trackList" active-color="#007AFF" direction="column" v-if="trackList != null" />
				<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"
					v-if="trackList == null"></u-empty>
			</uni-section>
		</u-popup>

		<u-toast ref="uToast"></u-toast>
	</view>

</template>


<script>
	export default {
		data() {
			return {
				i18n: 'cn',
				show: false,
				inputValue: "",
				commerce: {
					nos: '',
					pol: '',
					pod: ''
				},
				searchList: [{
					name: 'TSZE23040058',
					value: ''
				}, {
					name: 'TSZE23050859',
					value: ''
				}, {
					name: 'TSZE23050856',
					value: ''
				}],
				trackList: [],
			}
		},
		methods: {
			// 清理历史记录
			clearHistory() {
				this.searchList = [];
			},
			// 获取列表
			queryTracking: async function(e) {

				this.inputValue = e;

				if (this.inputValue == '' || this.inputValue == null) {
					this.$refs.uToast.error(`请输入运单号`)
					return;
				}

				let res = await this.$Tools.Axios({
					url: this.$api.tracking,
					method: 'GET',
					data: {
						"qrynos": this.inputValue
					}
				});
				if (res.Data) {
					this.commerce = res.Data[0];
					this.trackList = JSON.parse(res.Data[0].tracklist);
					this.show = true;

					// 最近搜索追加记录
					let obj = {}
					obj['value'] = e;
					obj['name'] = e;
					let temp = 0;

					for (var i = 0; i < this.searchList.length; i++) {
						if (this.searchList[i].name == e) {
							temp++;
						}
					}
					if (temp == 0 && this.searchList.length <= 8) {
						if (this.searchList.length == 8) {
							this.searchList.pop()
							this.searchList.push(obj)
						} else {
							this.searchList.push(obj)
						}
					}



				} else {
					this.commerce = {};
					this.trackList = [];
				}
			},
		},
		onShow() {
			if (uni.getStorageSync('i18n') != '') {
				this.i18n = uni.getStorageSync('i18n');

				uni.setNavigationBarTitle({
					title: this.i18n === 'cn' ? '查轨迹' : 'Trace'
				});
			}
		},
		created() {}

	}
</script>

<style lang="scss">
	$nav-height: 30px;

	.box-bg {
		padding: 1px 0;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.uni-section .uni-section-header {
		padding: 8px 15px !important;
	}

	.box-body-item {
		border-color: #737373;
		border-style: solid;
		border-width: 1px;
		border-radius: 5px;
		text-align: center;
		width: 100px;
		height: 24px;
		margin: 5px 5px;
	}

	.uni-searchbar {
		display: flex;
		flex-direction: row;
		position: relative;
		padding: 8px 0px 8px 8px !important;
		border-radius: unset;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	button[type=primary] {
		height: 36px;
		line-height: 36px;
		margin: 8px 8px 8px 0px;
		font-size: 15px;
		border-radius: unset;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.uni-searchbar__box {
		border-color: #2e4ab1 !important;
		border-radius: unset !important;
		border-top-left-radius: 5px !important;
		border-bottom-left-radius: 5px !important;
	}

	.view-body {
		display: flex;
		flex-wrap: wrap;
		margin-top: 5px;
		margin-left: 5px;
	}


	.example-body-item {
		border-color: #e5e5e5;
		border-style: solid;
		border-width: 1px;
		border-radius: 5px;
		text-align: center;
		margin: 4px 4px;
		padding: 0px 4px;
		line-height: 24px;
		height: 25px;
		font-size: 10px;
	}

	.u-empty {
		margin-bottom: 15px !important;
	}

	.u-popup__content {
		max-height: calc(100vh - 105px);
		min-height: 295px;
	}

	.uni-steps__column-title {
		font-size: 12px !important;
		width: 95%;
	}

	element.style {
		color: #000000;
		font-size: 22px;
	}
</style>