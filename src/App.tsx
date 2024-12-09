import { useEffect, useRef } from "react";
import { dispose, init } from "echarts";
import type { ECElementEvent } from "echarts";
import { data } from "./rdata";
import { generateMonthlyDrillDownData } from "./util";
import { getFirstDayOfMonth, getLastDayOfMonth } from "./datesUtil";
import { IMonthlyData } from "./types";

const startDate = getFirstDayOfMonth(2024, 1);
const endDate = getLastDayOfMonth(2024, 12);
const { monthlyData } = generateMonthlyDrillDownData(data, startDate, endDate);
let showBackButton = false;

const App = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const getOptions = (selected?: IMonthlyData) => {
    const month = selected?.dataGroupId || "";

    const xAxisData = selected
      ? selected.children.map((x) => x.groupId)
      : monthlyData.map((x) => x.dataGroupId);
    const yAxisData = selected
      ? selected.children.map((x) => x.value)
      : monthlyData.map((x) => x.value);

    const result = {
      title: { text: selected ? `Dados Diários ${month}  :  Voltar` : "Dados Mensais" },
      xAxis: {
        type: "category",
        data: xAxisData,
      },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: yAxisData,
        },
      ],
    };

    return result;
  };

  useEffect(() => {
    if (!chartRef) return;
    if (!chartRef.current) return;

    const _echart = init(chartRef.current, "light", { renderer: "canvas" });
    _echart.on("click", (params: ECElementEvent) => {
      console.log(params);
      showBackButton = false;

      const selected = monthlyData[params.dataIndex];
      if (selected) {
        showBackButton = true;
        _echart.setOption(getOptions(selected), true);
        return;
      }
      _echart.setOption(getOptions(), true);
    });

    _echart.getZr().on("click", () => {
      if (showBackButton) {                        
        _echart.setOption(getOptions())
      }
    });

    _echart.setOption(getOptions());
    return () => {
      dispose(_echart);
    };
  }, []);

  return (
    <div>
      <div
        className="mb-3"
        id={"bar-chart"}
        ref={chartRef}
        style={{ width: "92%", height: 400 }}
      />
    </div>
  );
};

export default App;
