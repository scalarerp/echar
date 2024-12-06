export type IData = (number | null)[];

interface DataItem {
  value: number | null;
  groupId: string;
}

interface DrilldownGroup {
  dataGroupId: string;
  data: IData[];
}

export const generateMonthlyDrilldownData = (
  rawData: [number, number | null][],
  startDate: Date,
  endDate: Date
) => {
  const getFirstDaysOfMonths = (start: Date, end: Date): number[] => {
    const result: number[] = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      result.push(current.getTime());
      current.setMonth(current.getMonth() + 1);
    }
    return result;
  };

  const monthTimestamps = getFirstDaysOfMonths(startDate, endDate);

  const monthlyData: Record<string, [number, number | null][]> = {};
  rawData.forEach(([timestamp, value]) => {
    const date = new Date(timestamp);
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = [];
    }
    monthlyData[yearMonth].push([timestamp, value]);
  });

  const seriesData: DataItem[] = [];
  const drilldownData: DrilldownGroup[] = [];

  monthTimestamps.forEach((timestamp) => {
    const date = new Date(timestamp);
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthData = monthlyData[yearMonth] || [];

    const monthSum = monthData.reduce(
      (sum, [, value]) => sum + (value ?? 0),
      0
    );
    seriesData.push({
      value: monthSum || null,
      groupId: yearMonth,
    });

    drilldownData.push({
      dataGroupId: yearMonth,
      data:
        monthData.length > 0
          ? monthData.map(([ts, value]) => [
              new Date(ts).toISOString().split("T")[0], // Dia no formato "YYYY-MM-DD"
              value,
            ])
          : [[`${yearMonth}-01`, null]],
    });
  });

  return { seriesData, drilldownData };
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const fillDailyData = (
  monthData: Array<[string, number | null]>,
  month: string
) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const daysInMonth = getDaysInMonth(year, monthIndex - 1);

  const filledData: Array<[string, number | null]> = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${monthIndex.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const existingData = monthData.find(([key]) => key === dateKey);
    filledData.push([dateKey, existingData ? existingData[1] : null]);
  }
  return filledData;
};
