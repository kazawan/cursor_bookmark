import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EditModeProvider } from './context/EditModeContext';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookmarkManager from './pages/BookmarkManager';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <EditModeProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-gray-100">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/login" 
                    element={
                      <PrivateRoute requireAuth={false}>
                        <Login />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <PrivateRoute requireAuth={false}>
                        <Register />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/bookmarks" 
                    element={
                      <PrivateRoute requireAuth={true}>
                        <BookmarkManager />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </EditModeProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App; 