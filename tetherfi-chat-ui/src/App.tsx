import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ChatDashboard from './pages/ChatDashboard';
import { ChatProvider } from './context/ChatContext';

// Senior Architect Tip: Create a wrapper for Protected Routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    // If no token, redirect to login
    if (!token) return <Navigate to="/login" replace />;
    
    // If token exists, wrap children with the ChatProvider
    return <ChatProvider token={token}>{children}</ChatProvider>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                
                <Route 
                    path="/chat" 
                    element={
                        <ProtectedRoute>
                            <ChatDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Redirect root to chat or login */}
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="*" element={<Navigate to="/chat" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;