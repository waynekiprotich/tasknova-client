import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  
  const { login, demoLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center text-sm text-red-500">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />
          
          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-foreground hover:opacity-80 transition-colors">
              Forgot password?
            </Link>
          </div>
          
          <div className="flex flex-col space-y-2 mt-4">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
                  Or continue without an account
                </span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" 
              isLoading={isDemoLoading}
              onClick={async () => {
                setIsDemoLoading(true);
                try {
                  await demoLogin();
                  navigate('/dashboard');
                } catch (err) {
                  setError('Failed to load demo account');
                } finally {
                  setIsDemoLoading(false);
                }
              }}
            >
              Try Demo App
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-border/50 pt-6">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-foreground hover:opacity-80 transition-colors">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
