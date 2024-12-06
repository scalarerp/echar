import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { data } from "./rdata";
import { fillDailyData, generateMonthlyDrilldownData } from "./util";

const startDate = new Date("2024-01-01");
const endDate = new Date("2024-12-31");

const { seriesData, drilldownData } = generateMonthlyDrilldownData(
  data,
  startDate,
  endDate
);

const App = () => {
  const [view, setView] = useState<"monthly" | "daily">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const getOptions = () => {
    if (view === "monthly") {
      return {
        title: { text: "Dados Mensais" },
        xAxis: {
          type: "category",
          data: seriesData.map((item) => item.groupId), // Meses como categorias
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "bar",
            data: seriesData.map((item) => item.value),
          },
        ],
      };
    }

    const dailyData = drilldownData.find(
      (group) => group.dataGroupId === selectedMonth
    )?.data;

    const filledDailyData = dailyData
      ? fillDailyData(dailyData, selectedMonth!)
      : [];

    return {
      title: { text: `Dados Diários (${selectedMonth})` },
      xAxis: {
        type: "category",
        data: filledDailyData.map(([date]) => date),
      },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: filledDailyData.map(([, value]) => value),
        },
      ],
    };
  };

  return (
    <div>
      {view === "daily" && (
        <button onClick={() => setView("monthly")}>Voltar</button>
      )}
      <ReactECharts
        option={getOptions()}
        onEvents={{
          click: (params) => {
            if (view === "monthly") {
              const month = seriesData[params.dataIndex]?.groupId;
              if (month) {
                setSelectedMonth(month);
                setView("daily");
              }
            }
          },
        }}
        style={{ height: 400 }}
      />
    </div>
  );
};

export default App;
