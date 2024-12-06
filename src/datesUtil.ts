export const firstAndLastDayOfMonth = (d: Date) => {
  const year = d.getFullYear();
  const month = d.getMonth();

  return {
    firstDayOfMonth: getFirstDayOfMonth(year, month),
    lastDayOfMonth: getLastDayOfMonth(year, month),
  };
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1);
};

export const getLastDayOfMonth = (year: number, month: number) => {
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
    const formattedMonth = `${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;
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
