import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import AppLayout from './pages/AppLayout';
import Applications from './pages/Applications';
import Insights from './pages/Insights';
import { AuthProvider } from './contexts/AuthContext';
import AddApplication from './pages/AddApplication';
import ApplicationReview from './pages/ApplicationReview';
import ApplicationDetails from './pages/ApplicationDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<AppLayout />}>
            <Route path='/applications' element={<Applications />} />
            <Route path='/applications/new' element={<AddApplication />} />
            <Route
              path='/applications/review'
              element={<ApplicationReview />}
            />
            <Route path='/applications/:id' element={<ApplicationDetails />} />
            <Route
              path='/applications/review/:id'
              element={<ApplicationReview />}
            />

            <Route path='/insights' element={<Insights />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
