import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import { Toaster, toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('MLS');
  const [password, setPassword] = useState('2008');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(username, password);
      if (user) {
        toast.success(`Welcome back, ${user.username}!`);
        navigate('/');
      } else {
        setError('Invalid username or password.');
        toast.error('Invalid username or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Toaster richColors />
      <Card className="mx-auto max-w-sm w-full shadow-2xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-display">MLS ProAdmin</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. MLS"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Remember me
                    </Label>
                </div>
            </div>
            {error && <p className="text-sm text-red-500 pt-2">{error}</p>}
            <Button type="submit" className="w-full transition-all duration-200 ease-in-out hover:shadow-lg active:scale-95" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
            <Button variant="link" className="w-full text-sm text-muted-foreground" disabled>
                Forgot your password?
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}