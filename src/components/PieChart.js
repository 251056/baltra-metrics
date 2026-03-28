import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3],
      backgroundColor: [
        'rgba(16, 108, 147, 1)',
        'rgba(202, 126, 20, 1)',
        'rgba(185, 50, 52, 1)',
      ],
      borderColor: [
        'rgba(0, 0, 0, 1)',
        'rgba(0, 0, 0, 1)',
        'rgba(0, 0, 0, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export function App() {
  return <Doughnut data={data} />;
}
