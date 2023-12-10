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
  const nextYear =
    nextMonthIndex === 12 ? latestPayment.year + 1 : latestPayment.year

  const upcomingMonths: UpcomingPayment[] = []
  for (let month = nextMonthIndex + 1; month <= 12; month++) {
    upcomingMonths.push({
      month: month,
      year: month === 13 ? nextYear : latestPayment.year,
      status: 'Pending',
      amount: latestPayment.amount,
    })
  }

  // If the next month is January, add a new entry for the next year
  // For instance, if the month is december then new month will be next year january
  if (nextMonthIndex === 12) {
    upcomingMonths.push({
      month: 1,
      year: nextYear,
      status: 'Pending',
      amount: latestPayment.amount,
    })
  }
  return upcomingMonths
}
