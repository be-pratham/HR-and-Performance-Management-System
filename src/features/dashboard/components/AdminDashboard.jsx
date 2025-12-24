import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Briefcase, FileSearch, 
  TrendingUp, Search, Filter, MoreVertical, 
  Download, Mail, ShieldCheck, Sun, ExternalLink, ArrowRight 
} from 'lucide-react';
import { 
  Button, Snackbar, Alert, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Chip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './DashboardStyles.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });

  // HR Specific Stats
  const hrStats = [
    { id: 1, label: "Total Employees", value: "156", icon: Users, color: "blue" },
    { id: 2, label: "Working from Home", value: "5", icon: Briefcase, color: "purple" },
    { id: 3, label: "Working from Office", value: "20", icon: UserPlus, color: "green" },
    { id: 4, label: "On Leave", value: "2", icon: ShieldCheck, color: "orange" }
  ];

  const [employees, setEmployees] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('company_employees') || '[]');
    if (localData.length > 0) {
      setEmployees(localData.slice(-4).reverse());
    } else {
      setEmployees([
        { id: 'EMP001', name: "Sarah Chen", role: "Sr. Engineer", dept: "Engineering", status: "Active", email: "s.chen@company.com" },
        { id: 'EMP002', name: "Rajesh Ramasamy", role: "Product Manager", dept: "Product", status: "On Leave", email: "r.ram@company.com" },
        { id: 'EMP003', name: "Jessica Pearson", role: "Managing Partner", dept: "Legal", status: "Active", email: "j.pearson@company.com" },
        { id: 'EMP004', name: "Mike Ross", role: "Associate", dept: "Legal", status: "Probation", email: "m.ross@company.com" },
      ]);
    }
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Probation': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard-container">
      {/* 1. HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">HR Management Portal</h1>
          <div className="dashboard-subtitle">Administrator Oversight & Workforce Analytics</div>
        </div>
        <div className="header-date-pill">
          <Sun size={18} className="sun-icon" />
          <span>{today}</span>
        </div>
      </div>

      {/* 2. RESPONSIVE SINGLE LINE STATS */}
      <div className="admin-stats-row">
        {hrStats.map((stat) => (
          <div key={stat.id} className={`stat-card-compact ${stat.color}`}>
            <div className="stat-icon-wrapper-sm">
              <stat.icon size={20} />
            </div>
            <div className="stat-stack">
              <div className="stat-val-sm">{stat.value}</div>
              <div className="stat-label-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. RECENTLY ADDED DIRECTORY */}
      <div className="dashboard-surface">
        <div className="surface-title">
          <div className="title-group">
            <h3>Recently Added Employees</h3>
            <span className="badge-count">Latest Entries</span>
          </div>
          <div className="action-group">
             <Button variant="outlined" endIcon={<ExternalLink size={16} />} onClick={() => navigate('/directory')}>
               Open Full Directory
             </Button>
             <Button variant="contained" startIcon={<UserPlus size={16} />} onClick={() => navigate('/add-employee')}>
               Add Employee
             </Button>
          </div>
        </div>

        <TableContainer>
          <Table>
            <TableHead className="table-header-row">
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <div className="employee-name">{emp.name}</div>
                    <div className="employee-email">{emp.id} • {emp.role}</div>
                  </TableCell>
                  <TableCell>{emp.dept}</TableCell>
                  <TableCell>
                    <Chip 
                      label={emp.status} 
                      color={getStatusColor(emp.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell align="right">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="icon-btn-subtle" onClick={() => setSnackbar({open: true, message: `Email draft created for ${emp.name}`})}>
                        <Mail size={18} color="var(--text-secondary)" />
                      </button>
                      <button className="icon-btn-subtle">
                        <MoreVertical size={18} color="var(--text-secondary)" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* 4. SECONDARY LAYOUT */}
      <div className="dashboard-split-layout" style={{ marginTop: '24px' }}>
        <div className="dashboard-surface">
          <div className="surface-title">
            <h3>Recent Policy Updates</h3>
            <TrendingUp size={20} color="var(--brand-blue)" />
          </div>
          <div className="announcement-list">
            <div className="announcement-item-mini">
              <div className="dot blue"></div>
              <div className="announce-content-mini">
                <h4>2026 Benefits Guide</h4>
                <p>New health insurance premiums updated.</p>
              </div>
              <ArrowRight size={16} className="arrow" />
            </div>
            <div className="announcement-item-mini">
              <div className="dot orange"></div>
              <div className="announce-content-mini">
                <h4>Remote Work Addendum</h4>
                <p>Revised guidelines for tax compliance.</p>
              </div>
              <ArrowRight size={16} className="arrow" />
            </div>
          </div>
        </div>

        <div className="dashboard-surface">
          <div className="surface-title">
            <h3>Quick Actions</h3>
            <FileSearch size={20} color="var(--text-secondary)" />
          </div>
          <div className="task-list">
            <div className="task-item-simple" onClick={() => setSnackbar({open: true, message: 'Opening Payroll Portal...'})}>
              <Briefcase size={18} />
              <span className="task-text">Process Monthly Payroll</span>
            </div>
            <div className="task-item-simple" onClick={() => setSnackbar({open: true, message: 'Opening Reviews...'})}>
              <FileSearch size={18} />
              <span className="task-text">Review 14 Pending Appraisals</span>
            </div>
          </div>
        </div>
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity="info" variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default AdminDashboard;