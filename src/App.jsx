import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './Calendar';
import DayCard from './DayCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/day/:date" element={<DayCard />} />
      </Routes>
    </Router>
  );
}

export default App;
