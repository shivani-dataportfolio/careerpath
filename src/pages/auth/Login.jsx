import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, BrainCircuit, AlertCircle, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            console.error('Google login error:', err);
            let message = 'Google login failed.';
            if (err.code === 'auth/operation-not-allowed') {
                message = 'Google Login is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
            } else if (err.code === 'auth/popup-blocked') {
                message = 'The login popup was blocked by your browser. Please allow popups for this site.';
            } else if (err.code === 'auth/popup-closed-by-user') {
                message = 'The login window was closed before completing.';
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            const errorCode = err.code;
            let message = 'Login failed. Please check your credentials.';
            
            if (errorCode === 'auth/invalid-email') message = 'The email address is not valid.';
            if (errorCode === 'auth/user-disabled') message = 'This account has been disabled.';
            if (errorCode === 'auth/user-not-found') message = 'No account found with this email.';
            if (errorCode === 'auth/wrong-password') message = 'Incorrect password. Please try again.';
            if (errorCode === 'auth/invalid-credential') message = 'Invalid email or password.';
            
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 selection:bg-primary-100">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-200">
                        <BrainCircuit size={24} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">PathAI</span>
                </div>
                <Card className="p-8 shadow-2xl border-none">
                    <CardHeader className="text-center mb-8">
                        <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</CardTitle>
                        <p className="text-slate-500 font-medium">Log in to continue your career journey.</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in duration-300">
                                    <AlertCircle size={18} />
                                    <p className="text-xs font-bold">{error}</p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-2xl text-lg font-bold shadow-xl shadow-primary-200 h-16"
                            >
                                {isLoading ? 'Signing in...' : 'Log In'}
                            </Button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full py-4 px-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12 5.04c1.94 0 3.7.67 5.07 1.98l3.8-3.8C18.57 1.13 15.5 0 12 0 7.31 0 3.32 2.69 1.34 6.64l4.43 3.44C6.82 7.02 9.17 5.04 12 5.04z" />
                                    <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.37H12v4.51h6.44c-.28 1.48-1.11 2.73-2.36 3.58l3.67 2.85c2.15-1.99 3.39-4.92 3.39-8.57z" />
                                    <path fill="#FBBC05" d="M5.77 14.36c-.24-.71-.38-1.47-.38-2.27 0-.8.14-1.56.38-2.27L1.34 6.64C.48 8.35 0 10.28 0 12.31c0 2.03.48 3.96 1.34 5.67l4.43-3.62z" />
                                    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.67-2.85c-1.1.74-2.51 1.18-4.28 1.18-3.3 0-6.1-2.22-7.1-5.23l-4.43 3.63C3.32 21.31 7.31 24 12 24z" />
                                </svg>
                                Google
                            </button>
                            <p className="text-center text-slate-500 text-sm font-medium">
                                Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">Register now</Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
