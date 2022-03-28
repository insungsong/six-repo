export enum OrderStatus {
  BEFORE_DEPOSIT = 'BEFORE_DEPOSIT', //입금 전
  PROCESSING = 'PROCESSING', //처리중
  COMPLETED = 'COMPLETED', //완료됨
  CANCELED = 'CANCELED', //취소됨
  DELEVERY = 'DELEVERY', //배송중
  REFUNDED = 'REFUNDED', //환불됨
}
