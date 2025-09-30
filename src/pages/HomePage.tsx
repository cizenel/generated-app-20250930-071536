import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { Shield, Users, Building, FileText, Loader2, ClipboardCheck, ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
interface Stats {
  users: number | null;
  sponsors: number | null;
  projects: number | null;
  workPerformed: number | null;
  sdcTracking: number | null;
}
export function HomePage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [stats, setStats] = useState<Stats>({ users: null, sponsors: null, projects: null, workPerformed: null, sdcTracking: null });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usersCount, sponsorsCount, projectsCount, workPerformedCount, sdcTrackingCount] = await Promise.all([
          api<{ count: number }>('/api/stats/user-count'),
          api<{ count: number }>('/api/stats/sponsor-count'),
          api<{ count: number }>('/api/stats/project-code-count'),
          api<{ count: number }>('/api/stats/work-performed-count'),
          api<{ count: number }>('/api/stats/sdc-tracking-count'),
        ]);
        setStats({
          users: usersCount.count,
          sponsors: sponsorsCount.count,
          projects: projectsCount.count,
          workPerformed: workPerformedCount.count,
          sdcTracking: sdcTrackingCount.count,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: number | null, icon: React.ElementType, description: string }) => (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <div className="text-2xl font-bold">{value ?? 'N/A'}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-block p-6 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/50 animate-float">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-white"
            fill="currentColor"
          >
            <title>Major League Soccer</title>
            <path d="M12 0L2.33 3.1v5.88c0 5.03 4.12 9.63 9.67 11.91 5.55-2.28 9.67-6.88 9.67-11.91V3.1L12 0zm-1.04 17.06L7.4 13.5l1.06-1.06 2.5 2.5 5.5-5.5 1.06 1.06-6.56 6.56z" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-800 dark:text-slate-100">
          Welcome to MLS ProAdmin
        </h1>
        <p className="text-xl text-muted-foreground">
          Hello, <span className="font-semibold text-blue-600">{currentUser?.username}</span>! Manage your data with ease.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 w-full">
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.role}</div>
            <p className="text-xs text-muted-foreground">
              Access level for system operations
            </p>
          </CardContent>
        </Card>
        <StatCard title="Total Users" value={stats.users} icon={Users} description="Total users in the system" />
        <StatCard title="Sponsors" value={stats.sponsors} icon={Building} description="Currently managed sponsors" />
        <StatCard title="Projects" value={stats.projects} icon={FileText} description="Total research projects" />
        <StatCard title="Work Items" value={stats.workPerformed} icon={ClipboardCheck} description="Total work items recorded" />
        <StatCard title="SDC Entries" value={stats.sdcTracking} icon={ListTodo} description="SDC tracking entries" />
      </div>
      <footer className="text-center text-muted-foreground/80 pt-12">
        <p>Built with ❤�� at Cloudflare</p>
      </footer>
    </div>
  );
}