import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import AppLayout from './pages/AppLayout';
import Applications from './pages/Applications';
import Insights from './pages/Insights';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<AppLayout />}>
            <Route path='/applications' element={<Applications />} />
            <Route path='/insights' element={<Insights />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
