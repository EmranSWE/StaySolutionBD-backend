/* eslint-disable @typescript-eslint/no-explicit-any */
type UpcomingPayment = {
  month: number
  year: number
  status: string
  amount: number
}

export const getUpcomingPaymentMonths = (
  latestPayment: any,
): UpcomingPayment[] => {
  const nextMonthIndex = latestPayment.month
  const upcomingMonths: UpcomingPayment[] = []
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
