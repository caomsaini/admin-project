import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const MyChart = () => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
        fill: true, // Requires Filler plugin
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default MyChart;
