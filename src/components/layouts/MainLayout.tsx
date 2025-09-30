import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Users,
  Home,
  FileText,
  Building,
  FlaskConical,
  User,
  Code,
  LogOut,
  Menu,
  X,
  Shield,
  ClipboardCheck,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/users', label: 'Users', icon: Users },
];
const definitionItems = [
  { href: '/definitions/sponsors', label: 'Sponsors', icon: Building },
  { href: '/definitions/centers', label: 'Centers', icon: FileText },
  { href: '/definitions/researchers', label: 'Researchers', icon: FlaskConical },
  { href: '/definitions/project-codes', label: 'Project Codes', icon: Code },
  { href: '/definitions/work-performed', label: 'Work Performed', icon: ClipboardCheck },
  { href: '/definitions/sdc-tracking', label: 'SDC Tracking List', icon: ListTodo },
];
const NavContent = () => (
  <nav className="flex flex-col gap-4 px-4">
    <NavLink
      to="/"
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-white hover:bg-slate-700',
          isActive && 'bg-blue-600 text-white'
        )
      }
    >
      <Home className="h-4 w-4" />
      Dashboard
    </NavLink>
    <NavLink
      to="/users"
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-white hover:bg-slate-700',
          isActive && 'bg-blue-600 text-white'
        )
      }
    >
      <Users className="h-4 w-4" />
      Users
    </NavLink>
    <div className="px-3 py-2">
      <h2 className="mb-2 text-lg font-semibold tracking-tight text-white">
        Definitions
      </h2>
      <div className="space-y-1">
        {definitionItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-all hover:text-white hover:bg-slate-700 text-sm',
                isActive && 'bg-slate-700 text-white'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);
export function MainLayout() {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const handleLogout = () => {
    logout();
    toast.success('You have been logged out successfully.');
    navigate('/login');
  };
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <aside className="hidden border-r bg-slate-900 text-white md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b border-slate-700 px-6">
            <NavLink to="/" className="flex items-center gap-2 font-semibold">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-display">MLS ProAdmin</span>
            </NavLink>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <NavContent />
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900 text-white border-slate-700 p-0">
                <div className="flex h-16 items-center border-b border-slate-700 px-6">
                    <NavLink to="/" className="flex items-center gap-2 font-semibold">
                        <Shield className="h-6 w-6 text-blue-500" />
                        <span className="text-xl font-display">MLS ProAdmin</span>
                    </NavLink>
                </div>
                <div className="py-4" onClick={() => setIsSheetOpen(false)}>
                    <NavContent />
                </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${currentUser?.username}.png`} />
                  <AvatarFallback>
                    {getInitials(currentUser?.username || 'U')}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.role}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6 md:p-8 lg:gap-6 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}