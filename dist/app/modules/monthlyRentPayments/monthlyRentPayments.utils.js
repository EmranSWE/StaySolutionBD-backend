'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getUpcomingPaymentMonths = void 0
const getUpcomingPaymentMonths = latestPayment => {
  const nextMonthIndex = latestPayment.month
  const upcomingMonths = []
  for (let month = nextMonthIndex + 1; month <= 12; month++) {
    upcomingMonths.push({
      month: month,
      year: latestPayment.year,
      status: 'Pending',
      amount: latestPayment.amount,
    })
  }
  return upcomingMonths
}
exports.getUpcomingPaymentMonths = getUpcomingPaymentMonths
