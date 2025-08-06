'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Zap, Sparkles } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email, password);
    
    if (result.error) {
      setError(result.error.message);
    } else {
      router.push('/dashboard');
    }
    
    setLoading(false);
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl border-0 bg-white/95 backdrop-blur-xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Welcome to ProjectHub
          </CardTitle>
          <CardDescription className="text-gray-600 text-base font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50 text-red-800">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-200"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-200 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => quickLogin('ceo@company.com')}>
                  <span className="text-gray-600">CEO:</span>
                  <span className="text-indigo-600 font-semibold">ceo@company.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => quickLogin('pm@company.com')}>
                  <span className="text-gray-600">PM:</span>
                  <span className="text-indigo-600 font-semibold">pm@company.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => quickLogin('finance@company.com')}>
                  <span className="text-gray-600">Finance:</span>
                  <span className="text-indigo-600 font-semibold">finance@company.com</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => quickLogin('hr@company.com')}>
                  <span className="text-gray-600">HR:</span>
                  <span className="text-indigo-600 font-semibold">hr@company.com</span>
                </div>
                <div className="text-center mt-3 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <span className="text-gray-600">Password: </span>
                  <span className="text-purple-600 font-semibold">password</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}