export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT', //결제대기중
  PROCESSING = 'Processing', //처리중
  COMPLETED = 'COMPLETED', //완료됨
  CANCELED = 'CANCELED', //취소됨
  REFUNDED = 'REFUNDED', //환불됨
}
