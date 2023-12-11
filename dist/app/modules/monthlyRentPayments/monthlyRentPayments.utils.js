"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpcomingPaymentMonths = void 0;
const getUpcomingPaymentMonths = (latestPayment) => {
    const nextMonthIndex = latestPayment.month;
    const nextYear = nextMonthIndex === 12 ? latestPayment.year + 1 : latestPayment.year;
    const upcomingMonths = [];
    for (let month = nextMonthIndex + 1; month <= 12; month++) {
        upcomingMonths.push({
            month: month,
            year: month === 13 ? nextYear : latestPayment.year,
            status: 'Pending',
            amount: latestPayment.amount,
        });
    }
    // If the next month is January, add a new entry for the next year
    // For instance, if the month is december then new month will be next year january
    if (nextMonthIndex === 12) {
        upcomingMonths.push({
            month: 1,
            year: nextYear,
            status: 'Pending',
            amount: latestPayment.amount,
        });
    }
    return upcomingMonths;
};
exports.getUpcomingPaymentMonths = getUpcomingPaymentMonths;
