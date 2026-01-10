import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ChatDashboard from './pages/ChatDashboard';
import { ChatProvider } from './context/ChatContext';

function App() {
    // Check if user is logged in
    const token = localStorage.getItem('token');

    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<AuthPage />} />

                {/* Private Route - Wrapped in ChatProvider to provide SignalR connection */}
                <Route 
                    path="/chat" 
                    element={
                        token ? (
                            <ChatProvider token={token}>
                                <ChatDashboard />
                            </ChatProvider>
                        ) : (
                            <Navigate to="/login" />
                        )
                    } 
                />

                {/* Default Route */}
                <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;