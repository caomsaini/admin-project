import React, { useState, useEffect } from "react";
import KPICard from "./KPICard";
import MyChart from "./MyChart";

const AnalyticsCards = () => {
  const [kpiData, setKpiData] = useState([
    { title: "Total Revenue", value: "$50,000" },
    { title: "Total Orders", value: "1,200" },
    { title: "Active Users", value: "800" },
  ]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.kpiUpdate) {
        setKpiData([
          { title: "Total Revenue", value: data.kpiUpdate.totalRevenue },
          { title: "Total Orders", value: data.kpiUpdate.totalOrders },
          { title: "Active Users", value: data.kpiUpdate.activeUsers },
        ]);
      }
    };

    return () => ws.close();
  }, []);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [1000, 2000, 1500, 2500, 3000, 4000],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="analytics-cards">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} title={kpi.title} value={kpi.value} />
      ))}
      <MyChart data={chartData} type="line" />
    </div>
  );
};

export default AnalyticsCards;
