import { Container } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';   
import { data } from './components/PieChart';


function ComparisonPage() {
  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: '#050505', color: 'white' }}>
      <Container>
        <h1>Comparison Dashboard</h1>
        <p>Chart.js Bar, Pie, and Radar graphs will go here. Also decide where you wanna add all the nutritional data babes :/</p>

        <Pie data={data} />
      </Container>
    </div>
  );
}

export default ComparisonPage;