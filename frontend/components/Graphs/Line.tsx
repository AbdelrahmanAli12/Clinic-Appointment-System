import React, { useEffect, useRef } from 'react';
import { BarChartProps } from './Bar';
import { Chart } from 'chart.js';

const LineChartComponent = (props: BarChartProps) => {
  const { tableData, labels, graphLabel } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    var ctx = canvasRef?.current?.getContext('2d');

    const data = {
      labels: labels,
      datasets: [
        {
          axis: 'y',
          label: graphLabel,
          data: tableData,
          borderWidth: 3,
          borderColor: 'rgb(75, 192, 192)',
        },
      ],
    };

    var myChart = new Chart(ctx ?? '', {
      type: 'line',
      options: {
        scales: {
          min: '0',
          display: false,
          ticks: {
            beginAtZero: true,
            precision: 0,
            stepSize: 1,
          },
        },
      },
      data,
    });
  }, [tableData]);

  return <canvas id='myChart' ref={canvasRef} className='w-full mb-5'></canvas>;
};

export default LineChartComponent;
