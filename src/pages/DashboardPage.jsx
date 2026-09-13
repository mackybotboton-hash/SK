import React, { useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import useController from '../hooks/useController';
import { dashboardController } from '../controllers/DashboardController';
import SummaryCard from '../components/common/SummaryCard';
import BudgetOverviewChart from '../components/dashboard/BudgetOverviewChart';
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart';
import RecentActivityWidget from '../components/dashboard/RecentActivityWidget';
import UpcomingActivitiesWidget from '../components/dashboard/UpcomingActivitiesWidget';
import { MdFolder, MdAccountBalance, MdDescription, MdCheckCircle } from 'react-icons/md';
import { formatCurrency } from '../utils/formatters';

export default function DashboardPage() {
  const { loading, error, data } = useController(dashboardController);
  const { stats, budgetData, projectData, recentActivities, upcomingActivities } = data || {};

  useEffect(() => {
    dashboardController.initialize();
  }, []);

  if (loading || !stats) {
    return (
      <div className="page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div className="spinner-lg" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="page-enter">
      <PageHeader 
        title="Dashboard" 
        description="Overview of SKHub projects, budgets, and activities." 
      />
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', 
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <SummaryCard 
          title="Active Projects" 
          value={stats.activeProjects} 
          icon={MdFolder} 
          color="var(--primary)"
          trend={12}
          trendLabel="vs last month"
        />
        <SummaryCard 
          title="Total Budget (FY)" 
          value={formatCurrency(stats.totalBudget)} 
          icon={MdAccountBalance} 
          color="var(--info)"
        />
        <SummaryCard 
          title="Budget Utilized" 
          value={formatCurrency(stats.budgetUtilized)} 
          icon={MdCheckCircle} 
          color="var(--success)"
          trend={-5}
          trendLabel="vs avg spending"
        />
        <SummaryCard 
          title="Pending Proposals" 
          value={stats.pendingProposals} 
          icon={MdDescription} 
          color="var(--warning)"
        />
      </div>

      {/* Charts Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', 
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <BudgetOverviewChart data={budgetData} />
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <ProjectStatusChart data={projectData} />
        </div>
      </div>

      {/* Widgets Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <RecentActivityWidget activities={recentActivities} />
        <UpcomingActivitiesWidget activities={upcomingActivities} />
      </div>

    </div>
  );
}
