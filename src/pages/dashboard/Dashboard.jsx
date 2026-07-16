import React, { useContext } from 'react';
import { WorkspaceContext } from '../../contexts/WorkspaceContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { motion } from 'framer-motion';
import { 
  Plus, Layout, TrendingUp, CheckCircle, Clock, AlertCircle, 
  Calendar as CalendarIcon, FileText, MoreHorizontal, Play, CheckSquare, MessageSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ThemeContext } from '../../contexts/ThemeContext';
import './Dashboard.css';

const mockData = [
  { name: 'Mon', completed: 12, added: 16 },
  { name: 'Tue', completed: 18, added: 14 },
  { name: 'Wed', completed: 15, added: 22 },
  { name: 'Thu', completed: 25, added: 18 },
  { name: 'Fri', completed: 22, added: 15 },
  { name: 'Sat', completed: 8, added: 6 },
  { name: 'Sun', completed: 4, added: 5 },
];

export default function Dashboard() {
  const { workspaces, activeWorkspace, loading } = useContext(WorkspaceContext);
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-surface-hover rounded-[24px] shadow-sm flex items-center justify-center mb-6">
          <Layout className="w-10 h-10 text-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to TaskNova</h2>
        <p className="text-text-secondary mb-8 text-lg">
          You don't belong to any workspaces yet. Create one to start collaborating with your team.
        </p>
        <Button onClick={() => document.querySelector('header button:has(.lucide-plus)').click()} size="lg" className="rounded-xl px-8">
          <Plus className="w-5 h-5 mr-2" />
          Create Workspace
        </Button>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="dashboard-container"
    >
      <div className="dashboard-header">
        <motion.div variants={item}>
          <h1 className="dashboard-title">Overview</h1>
          <p className="dashboard-subtitle">Here's what's happening in {activeWorkspace?.name}</p>
        </motion.div>
        <motion.div variants={item} className="dashboard-header-actions">
          <Button variant="secondary" className="rounded-xl">Download Report</Button>
          <Button className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </motion.div>
      </div>

      {/* Top row: KPIs */}
      <motion.div variants={item} className="kpi-grid">
        {[
          { title: "Total Tasks", val: "248", change: "+12%", icon: Layout, color: "text-foreground", bg: "bg-surface-hover" },
          { title: "Completed", val: "164", change: "+18%", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
          { title: "In Progress", val: "42", change: "-4%", icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
          { title: "Overdue", val: "8", change: "+2%", icon: AlertCircle, color: "text-danger", bg: "bg-danger/10" }
        ].map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <div className={`kpi-icon-wrapper ${kpi.bg}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div>
              <div className="kpi-value">{kpi.val}</div>
              <p className="kpi-change">
                <span className={kpi.change.startsWith('+') ? 'text-emerald-500' : 'text-danger'}>
                  {kpi.change}
                </span> from last month
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filter & Action Bar */}
      <motion.div variants={item} className="filter-bar">
        <div className="filter-group">
          {['All', 'Active', 'Paused', 'Completed'].map((filter, index) => (
            <button 
              key={filter} 
              className={`filter-btn ${index === 0 ? 'active' : ''}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="filter-actions">
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-11 px-6 shadow-md border-none font-bold">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* Editorial Grid layout */}
      <div className="dashboard-grid mt-4">
        
        {/* Main Chart */}
        <motion.div variants={item} className="grid-main-chart">
          <div className="widget-card">
            <div className="widget-header">
              <div>
                <h3 className="widget-title">Productivity Analytics</h3>
                <p className="widget-desc">Tasks completed vs added over the last 7 days</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal size={18}/></Button>
            </div>
            <div className="widget-inner-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme === 'dark' ? '#FFFFFF' : '#111111'} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={theme === 'dark' ? '#FFFFFF' : '#111111'} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme === 'dark' ? '#6B7280' : '#A1A1AA'} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={theme === 'dark' ? '#6B7280' : '#A1A1AA'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2B2E38' : '#E5E7EB'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 500}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', boxShadow: 'var(--shadow-floating)', padding: '12px' }}
                    itemStyle={{ color: 'var(--color-foreground)', fontWeight: 600 }}
                    cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke={theme === 'dark' ? '#FFFFFF' : '#111111'} strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="added" stroke={theme === 'dark' ? '#6B7280' : '#A1A1AA'} strokeWidth={2} fillOpacity={1} fill="url(#colorAdded)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Side column: Time Tracking & Team */}
        <motion.div variants={item} className="grid-side-panel">
          
          {/* Time Tracking */}
          <div className="widget-card">
            <div className="widget-header">
              <h3 className="widget-title">Time Tracking</h3>
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-500/20 text-danger flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
                <Play size={14} className="ml-1" />
              </div>
            </div>
            <div className="widget-content">
              <div className="mt-2 mb-6 text-center">
                <div className="text-4xl font-bold font-mono tracking-tight text-foreground">04:25:10</div>
                <div className="text-sm font-medium text-foreground mt-1">Active: UI Redesign</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary font-medium">Design</span>
                  <span className="font-semibold text-foreground">35%</span>
                </div>
                <div className="w-full bg-surface-hover rounded-full h-2 overflow-hidden">
                  <div className="bg-foreground h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-text-secondary font-medium">Development</span>
                  <span className="font-semibold text-foreground">45%</span>
                </div>
                <div className="w-full bg-surface-hover rounded-full h-2 overflow-hidden">
                  <div className="bg-text-secondary h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="widget-card">
            <div className="widget-header">
              <h3 className="widget-title">Active Team</h3>
            </div>
            <div className="widget-content">
              <div className="flex items-center space-x-3 mt-2">
                <Avatar name="Sarah K." size="lg" />
                <Avatar name="John Doe" size="lg" />
                <Avatar name="Alex Lee" size="lg" />
                <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-hover border border-dashed border-border flex-shrink-0 cursor-pointer hover:bg-border transition-colors">
                  <Plus size={18} className="text-text-secondary" />
                </div>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Third row: Calendar, Activity, Upcoming */}
        <motion.div variants={item} className="grid-third-col">
          <div className="widget-card">
            <div className="widget-header">
              <h3 className="widget-title">Upcoming Deadlines</h3>
            </div>
            <div className="widget-content space-y-4">
              {[
                { task: 'Finalize Q3 Roadmap', date: 'Today, 5:00 PM', priority: 'High', color: 'danger' },
                { task: 'Client Presentation', date: 'Tomorrow, 10:00 AM', priority: 'Medium', color: 'warning' },
                { task: 'Deploy v2.0', date: 'Oct 24, 2026', priority: 'High', color: 'danger' },
              ].map((item, i) => (
                <div key={i} className="flex items-start p-3 rounded-xl bg-surface hover:bg-surface-hover border border-transparent hover:border-border transition-all cursor-pointer">
                  <div className="mt-1 mr-3">
                    <div className={`w-3 h-3 rounded-full bg-${item.color}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.task}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid-third-col">
          <div className="widget-card">
            <div className="widget-header">
              <div>
                <h3 className="widget-title">Recent Activity</h3>
                <p className="widget-desc">Your team's latest actions</p>
              </div>
            </div>
            <div className="widget-content space-y-5">
              {[
                { user: 'SK', text: 'completed task', target: 'Update Landing Page', time: '2h ago', icon: CheckSquare, color: 'text-success', bg: 'bg-success/10' },
                { user: 'JD', text: 'commented on', target: 'API Integration', time: '4h ago', icon: MessageSquare, color: 'text-foreground', bg: 'bg-surface-hover' },
                { user: 'AL', text: 'uploaded file', target: 'design-specs.fig', time: '5h ago', icon: FileText, color: 'text-warning', bg: 'bg-warning/10' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className={`h-10 w-10 rounded-xl ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{activity.user}</span> {activity.text} <span className="font-medium text-foreground underline decoration-border underline-offset-4 cursor-pointer">{activity.target}</span>
                    </p>
                    <p className="text-xs text-text-secondary mt-1 font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid-third-col">
          <div className="widget-card bg-foreground text-background border-none p-0 flex flex-col justify-between relative overflow-hidden" style={{ minHeight: '300px' }}>
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Layout size={100} />
            </div>
            <div className="p-8 relative z-10 flex-grow">
              <Badge className="bg-background/20 text-background border-none mb-4">Pro Plan</Badge>
              <h3 className="text-2xl font-bold mb-2">Upgrade your workspace</h3>
              <p className="text-background/80 text-sm mb-6">Get access to advanced analytics, unlimited projects, and priority support.</p>
            </div>
            <div className="p-8 pt-0">
              <Button className="w-full bg-background text-foreground hover:bg-background/90 border-none shadow-lg z-10 font-bold">
                Upgrade Now
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
