import React, { useRef, useEffect } from 'react';
import { Chart, LineElement, PointElement, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(LineElement, PointElement, BarElement, CategoryScale, LinearScale);

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: data,
      options: { responsive: true },
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
