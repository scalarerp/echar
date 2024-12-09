export const monthlyFormat = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
export const dayTwoDigitsFormat = (d: Date) => {
  return `${d.getDate()}`.padStart(2, "0");
};

export const firstAndLastDayOfMonth = (d: Date) => {
  const year = d.getFullYear();
  const month = d.getMonth();

  return {
    firstDayOfMonth: getFirstDayOfMonth(year, month),
    lastDayOfMonth: getLastDayOfMonth(year, month),
  };
};

export const getDaysInMonth = (
  year: number,
  month: number,
  monthZeroBased: boolean = false
): number => {
  if (!monthZeroBased) new Date(year, month, 0).getDate();
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (
  year: number,
  month: number,
  monthZeroBased: boolean = false
) => {
  if (!monthZeroBased) return new Date(year, month - 1, 1);
  return new Date(year, month, 1);
};

export const getLastDayOfMonth = (
  year: number,
  month: number,
  monthZeroBased: boolean = false
) => {
  if (!monthZeroBased) return new Date(year, month, 0);
  return new Date(year, month + 1, 0);
};

export const getAllDaysOfMonth = (date: Date): Date[] => {
  const { firstDayOfMonth, lastDayOfMonth } = firstAndLastDayOfMonth(date);

  const days: Date[] = [];
  for (
    let day = firstDayOfMonth.getDate();
    day <= lastDayOfMonth.getDate();
    day++
  ) {
    days.push(
      new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), day)
    );
  }
  return days;
};

export const getAllMonthsBetweenDates = (
  startDate: Date,
  endDate: Date
): string[] => {
  const months: string[] = [];
  const currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  ); // Normaliza para o início do mês

  while (currentDate <= endDate) {
    const formattedMonth = monthlyFormat(currentDate);
    months.push(formattedMonth);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
};

export const getFirstDayOfMonthFromDate = (d: Date) => {
  const year = d.getFullYear();
  const month = d.getMonth();
  return new Date(year, month, 1);
};

export const getLastDayOfMonthFromDate = (d: Date) => {
  const year = d.getFullYear();
  const month = d.getMonth();
  return new Date(year, month + 1, 0);
};
