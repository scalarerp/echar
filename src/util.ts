import { DataItem, DrillDownGroup, IData } from "./types";

export const generateMonthlyDrillDownData = (
  rawData: IData[],
  startDate: Date,
  endDate: Date
) => {
  const monthTimestamps = getFirstDaysOfMonths(startDate, endDate);

  const monthlyData: Record<string, IData[]> = {};
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
  const drillDownData: DrillDownGroup[] = [];

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

    drillDownData.push({
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

  return { seriesData, drillDownData };
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const fillDailyData = (monthData: IData[], month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const daysInMonth = getDaysInMonth(year, monthIndex - 1);

  const filledData: IData[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${monthIndex.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const existingData = monthData.find(([key]) => key === dateKey);
    filledData.push([dateKey, existingData ? existingData[1] : null]);
  }
  return filledData;
};

const getFirstDaysOfMonths = (start: Date, end: Date): number[] => {
  const result: number[] = [];

  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= end) {
    result.push(current.getTime());
    current.setMonth(current.getMonth() + 1);
  }
  return result;
};
