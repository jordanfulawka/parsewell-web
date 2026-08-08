import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import AppLayout from './pages/AppLayout';
import Applications from './pages/Applications';
import Insights from './pages/Insights';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<AppLayout />}>
          <Route path='/applications' element={<Applications />} />
          <Route path='/insights' element={<Insights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
