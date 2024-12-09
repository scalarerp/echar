import { getAllMonthsBetweenDates, monthlyFormat, getDaysInMonth } from "./datesUtil";
import { IDailyData, IMonthlyData, IData } from "./types";

export const generateMonthlyDrillDownData = (
  rawData: IData[],
  startDate: Date,
  endDate: Date
) => {
  const monthList: string[] = getAllMonthsBetweenDates(startDate, endDate);

  const monthlyResult: Record<string, Map<string, number | null>> = {};

  // Organiza os dados por mês em um Map para acesso rápido
  rawData.forEach(([timestamp, value]) => {
    const yearMonth = monthlyFormat(new Date(timestamp));
    const dateKey = new Date(timestamp).toISOString().split("T")[0]; // Formato YYYY-MM-DD

    if (!monthlyResult[yearMonth]) {
      monthlyResult[yearMonth] = new Map();
    }

    monthlyResult[yearMonth].set(dateKey, value);
  });

  const monthlyData: IMonthlyData[] = [];

  // Processa cada mês
  monthList.forEach((month) => {
    const monthData = monthlyResult[month] || new Map();
    const [year, monthIndex] = month.split("-").map(Number);

    // Preencher dias faltantes
    const daysInMonth = getDaysInMonth(year, monthIndex - 1);
    const dailyData: IDailyData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = String(day); // Chave do dia é apenas o número do dia
      const dateKey = `${year}-${String(monthIndex).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const value = monthData.get(dateKey) ?? null; // Busca no Map

      dailyData.push({
        value,
        groupId: dayKey,
      });
    }

    // Soma valores do mês para o gráfico mensal
    const monthSum = dailyData.reduce(
      (sum, { value }) => sum + (value ?? 0),
      0
    );

    // Adiciona aos resultados com filhos
    monthlyData.push({
      dataGroupId: month,
      value: monthSum || null,
      children: dailyData, // Dados diários como filhos
    });
  });

  console.log(monthlyData);

  return { monthlyData };
};

