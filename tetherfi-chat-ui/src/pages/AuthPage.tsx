import React, { useState } from 'react';
import { identityApi } from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    
    // UI State
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

       try {
            if (isLogin) {
                const response = await identityApi.post('/auth/login', {
                    username: formData.username,
                    password: formData.password
                });
                
                const data = response.data;
                const token = data.token || data.Token;
                const user = data.user || data.User;
                
                if (token && user) {
                    localStorage.clear(); // Clear any old junk
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    console.log("Login successful, redirecting...");
                    
                    // Option A: Standard Navigate
                    // navigate('/chat'); 
                    
                    // Option B: FORCE REDIRECT (Use this if Option A fails)
                    window.location.href = '/chat'; 
                } else {
                    setError("Server returned success but data is missing. Check Network tab.");
                }
            } 
            // ... register logic ...
                // --- REGISTER LOGIC ---
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }

                await identityApi.post('/auth/register', {
                    username: formData.username,
                    password: formData.password
                });

                alert("Registration successful! Please login.");
                setIsLogin(true); // Switch to login view
                setFormData({ username: formData.username, password: '', confirmPassword: '' }); 
            }
        catch (err: any) {
            console.error("Auth Error Object:", err);
            const serverMessage = err.response?.data?.message || err.response?.data?.Message;
            setError(serverMessage || "Connection failed. Ensure Backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                
                <div className="bg-blue-600 p-8 text-white text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Tetherfi Chat</h1>
                    <p className="text-blue-100 mt-2">
                        {isLogin ? 'Welcome back! Please login.' : 'Create your employee account.'}
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center text-sm">
                            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold transition-all shadow-md ${
                                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                            }`}
                        >
                            {loading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    {isLogin ? <LogIn size={20} className="mr-2" /> : <UserPlus size={20} className="mr-2" />}
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t pt-6">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;