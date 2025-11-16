export type Company = {
  companyId: string;
  companyName: string;
  companyNameEn: string;
  logo: string;
}


export type CarSource = {
  id: string | number;
  /** 图片 */
  carPhoto?: string[];
  /** 品牌 */
  brand: string;
  /** 名称 */
  title: string;
  /** 指导价 */
  guidePrice: string;
  /** 优惠金额 */
  discountAmount: number;
  /** 出口方式 */
  exportMethod: string;
  /** 出口价 */
  exportPrice: string;
  /** 颜色 */
  color: string;
  /** 提车类型 比如 现车 */
  deliveryType: string;
  /** 可提车城市 */
  deliveryCity: string;
  /** 保险类型 */
  insuranceType: string;
  /** 微信二维码图片 */
  weChat: string;
  /** 联系人姓名 */
  contact: string;
  /** 联系人手机号 */
  number: string;
  /** 创建时间 */
  createTime: string;
};
