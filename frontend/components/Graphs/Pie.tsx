'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

export interface PieChartProps {
  labels: string[];
  graphLabel: string;
  tableData: number[];
}

export const PieChartComponent = (props: PieChartProps) => {
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
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
        },
      ],
    };

    var myChart = new Chart(ctx ?? '', {
      type: 'pie',
      data,
    });
  }, [tableData]);

  return <canvas id='myChart' ref={canvasRef} className='w-full mb-5'></canvas>;
};
