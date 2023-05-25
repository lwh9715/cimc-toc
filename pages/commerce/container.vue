<template>
	<view>
		<uni-section :title="i18n == 'cn' ? '基本信息' : 'Basic information'" type="line">
			<uni-forms ref="baseForm" :modelValue="commerce">
				<uni-forms-item :label="i18n == 'cn' ? '订单号' : 'Order'"
					v-if="commerce.nos != '' && commerce.nos != null">
					<uni-easyinput v-model="commerce.nos" :placeholder="i18n == 'cn' ? '订单号' : 'OrderNum'" disabled />
				</uni-forms-item>
				<uni-forms-item :label="i18n == 'cn' ? '送货地' : 'Delivery'" required>
					<input v-model="commerce.deliverytocode" @focus="openDelivery()"
						:placeholder="i18n == 'cn' ? '送货地' : 'Delivery Place'" />
				</uni-forms-item>
				<uni-forms-item :label="i18n == 'cn' ? '产品名称' : 'Channel'" required>
					<input v-model="commerce.productname" @focus="openProduct()"
						:placeholder="i18n == 'cn' ? '产品名称' : 'Channel'" />
				</uni-forms-item>
				<uni-section :title="i18n=='cn' ? '箱单信息' : 'Box information'" type=" line">
					<uni-forms-item :label="i18n=='cn' ? '预报件数' : 'PKG'" required>
						<uni-easyinput type="digit" v-model="commerce.bkpkgnum" placeholder="PKG"
							@input="chagePacking()" />
					</uni-forms-item>
					<uni-forms-item :label="i18n=='cn' ? '预报重量' : 'KGS'" required>
						<uni-easyinput type="digit" v-model="commerce.bkgw" placeholder="KGS" />
					</uni-forms-item>
					<uni-forms-item :label="i18n=='cn' ? '预报体积' : 'CBM'" required>
						<uni-easyinput type="digit" v-model="commerce.bkvol" placeholder="CBM" />
					</uni-forms-item>
					<uni-forms-item :label="i18n=='cn' ? '货物品名' : 'Goods'">
						<uni-easyinput v-model="commerce.cargoname" :placeholder="i18n=='cn' ? '货物品名' : 'Goods'"
							@input="chagePacking()" />
					</uni-forms-item>
					<uni-forms-item :label="i18n=='cn' ? '备注' : 'Remarks'">
						<uni-easyinput type="textarea" v-model="commerce.remark"
							:placeholder="i18n=='cn' ? '备注' : 'Remarks'" />
					</uni-forms-item>
				</uni-section>
			</uni-forms>
			<view>
				<button type="primary" style="margin: 10px 15px;background-color: #2e4ab1;" @click="saveContainer()">
					{{i18n == 'cn' ? '确认预报' : 'Confirm'}}
				</button>
			</view>
		</uni-section>
		<u-popup :show="showDelivery" @close="showDelivery = false" :round="20">
			<view style="height: calc(100vh - 300rpx);overflow-y: auto;margin-top: 18px;text-align: center;">
				<uni-list v-for="(item,index) in deliveryList" index="index">
					<uni-list-item :title="item.code + ' / ' + item.countrycode" @click="changeDelivery(item)"
						clickable />
				</uni-list>
			</view>
		</u-popup>
		<u-popup :show="showProduct" @close="showProduct = false" :round="20">
			<view style="height: calc(100vh - 300rpx);overflow-y: auto;margin-top: 18px;text-align: center;">
				<uni-list v-for="(item,index) in productList" index="index">
					<uni-list-item :title="item.namec" @click="changeProduct(item)" clickable />
				</uni-list>
			</view>
		</u-popup>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				i18n: 'cn',
				showProduct: false,
				showDelivery: false,
				isHideKeyboard: true,
				userInfo: {
					corpid: ''
				},
				commerce: {
					nos: '',
					jobid: '',
					productname: '',
					bkpkgnum: '',
					bkgw: '',
					bkvol: '',
					deliverytocode: '',
					deliverynamec: '',
					destcountrycode: '',
					postcode: '',
					remark: ''
				},
				commerceList: [],
				buspacklist: [{
					price: '',
					piece3: '',
					priceall: '',
					piece: '',
					packagee: '',
					factoryname: '',
					outerpackagecode: ''
				}],
				productList: [],
				deliveryList: []
			};

		},
		methods: {
			chagePacking() {
				this.buspacklist[0].piece = this.commerce.bkpkgnum;
				this.buspacklist[0].factoryname = this.commerce.cargoname;
			},
			openProduct() {
				//禁止软键盘弹出
				uni.hideKeyboard();
				this.showProduct = true;
			},
			openDelivery() {
				//禁止软键盘弹出
				uni.hideKeyboard();
				this.showDelivery = true;
			},
			// 产品名称
			changeProduct(e) {
				this.commerce.productname = e.namec;
				this.showProduct = false;
			},
			// 送货地
			changeDelivery(e) {
				this.commerce.deliverytocode = e.code;
				this.commerce.deliverynamec = e.code;
				this.commerce.destcountrycode = e.countrycode;
				this.commerce.postcode = e.postcode;
				this.showDelivery = false;
			},
			// 确认预报
			saveContainer: async function(Fval, Vval) {

				if (this.userInfo.corpid == '') {
					this.$refs.uToast.error(this.i18n == 'cn' ? '请登录后在进行预报' : 'Please log in and make a forecast.');
					return;
				} else if (this.commerce.deliverytocode == '') {
					this.$refs.uToast.error(this.i18n == 'cn' ? '送货地不能为空' : 'Delivery place cannot be empty.');
					return;
				} else if (this.commerce.productname == '') {
					this.$refs.uToast.error(this.i18n == 'cn' ? '产品名称不能为空' : 'Product name cannot be empty.');
					return;
				} else if (this.commerce.bkpkgnum == '') {
					this.$refs.uToast.error(this.i18n == 'cn' ? '件数不能为空' : 'Number of pieces cannot be empty.');
					return;
				} else if (this.commerce.bkgw == '') {
					this.$refs.uToast.error(this.i18n == 'cn' ? '重量不能为空' : 'Weight cannot be empty.');
					return;
				} else if (this.commerce.bkvol == '') {
					this.$refs.uToast.error(this.i18n == 'cn' ? '体积不能为空' : 'Volume cannot be empty.');
					return;
				} else {
					let res = await this.$Tools.Axios({
						url: this.$api.save,
						method: 'POST',
						data: {
							"buspacklist": this.buspacklist,
							"commerce": this.commerce,
							"finajobs": {
								"corpid": Number(this.userInfo.corpid)
							}
						}
					});
					if (res.data != '') {
						this.$refs.uToast.success(this.i18n === 'cn' ? `预报成功` : `forecast successful`)
						let finajobs = JSON.parse(res.data)
						this.commerce.nos = finajobs.nos;
						this.commerce.jobid = finajobs.id;
					} else {
						this.$refs.uToast.error(this.i18n === 'cn' ? `预报失败` : `Forecast failed`)
					}
				}
			},
			// 获取列表
			queryCommerceList: async function(Fval, Vval) {
				console.log(Fval, Vval);
				let res = await this.$Tools.Axios({
					url: this.$api.commerceList,
					method: 'GET'
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
			// 获取送货地
			queryDelivery: async function() {
				let res = await this.$Tools.Axios({
					url: this.$api.common,
					method: 'POST',
					data: {
						code: "",
						methodFlag: "address",
						query: ""
					}
				});
				if (res.address) {
					this.deliveryList = JSON.parse(res.address);
				} else {
					this.deliveryList = []
				}
			},
			// 获取产品名称
			queryProduct: async function() {
				let res = await this.$Tools.Axios({
					url: this.$api.common,
					method: 'POST',
					data: {
						methodFlag: "product",
						query: ""
					}
				});
				if (res.product) {
					this.productList = JSON.parse(res.product);
				} else {
					this.productList = []
				}
			}
		},
		onShow() {

			if (uni.getStorageSync("userInfo") != '') {
				this.userInfo = uni.getStorageSync("userInfo")
			}
			if (uni.getStorageSync('i18n') != '') {
				this.i18n = uni.getStorageSync('i18n');
				uni.setNavigationBarTitle({
					title: this.i18n === 'cn' ? '箱单预报' : 'Box list forecast'
				});
			}
		},
		created() {
			this.queryDelivery();
			this.queryProduct();
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

	.uni-forms-item__inner {
		padding-bottom: 10px !important;
		margin: 0px 10px;
	}

	.is-input-border {
		border: unset !important;
		border-radius: unset !important;
	}

	.is-textarea {
		border-bottom: 1px solid #e5e5e5 !important;
	}

	.uni-list--border-top {
		background-color: unset !important;
	}

	input {
		padding-left: 10px;
		min-height: 36px;
		border-bottom: 1px solid #e5e5e5;
	}

	.is-disabled {
		background-color: #ffffff !important;
	}

	.u-toast__content__text {
		max-width: 300px !important;
	}
</style>