import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EditModeProvider } from './context/EditModeContext';
import { UserProvider } from './context/UserContext';
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/bookmarks" element={<BookmarkManager />} />
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