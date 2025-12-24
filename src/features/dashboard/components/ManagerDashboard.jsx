import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel} from '@mui/material';
import { Search, Users, AlertCircle, TrendingUp, ChevronRight, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './DashboardStyles.css'; 

const myTeam = [
  { id: 101, name: "Pratham Bhardwaj", role: "Architect", status: "Rated", rating: 5.0, email: "pratham@company.com" },
  { id: 102, name: "Alice Johnson", role: "Frontend Dev", status: "Goals Submitted", rating: "Pending", email: "alice@company.com" },
  { id: 103, name: "Bob Smith", role: "Backend Dev", status: "Approved", rating: 4.5, email: "bob@company.com" },
  { id: 104, name: "Charlie Davis", role: "Designer", status: "Review Needed", rating: "Pending", email: "charlie@company.com" },
  { id: 105, name: "Diana Prince", role: "Product Manager", status: "Draft", rating: "Pending", email: "diana@company.com" },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Stats Logic
  const totalMembers = myTeam.length;
  const pendingReviews = myTeam.filter(e => e.status === 'Goals Submitted' || e.status === 'Review Needed').length;
  const ratedEmployees = myTeam.filter(e => typeof e.rating === 'number');
  const avgRating = ratedEmployees.length > 0 
    ? (ratedEmployees.reduce((acc, curr) => acc + curr.rating, 0) / ratedEmployees.length).toFixed(1) 
    : "N/A";

  // Helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'Rated': return 'info';
      case 'Approved': return 'success';
      case 'Goals Submitted': return 'warning';
      case 'Review Needed': return 'error';
      default: return 'default';
    }
  };

  const filteredTeam = myTeam.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      
      {/* 1. SHARED HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Good morning, {user?.name?.split(' ')[0] || 'Manager'}</h1>
          <div className="dashboard-subtitle">Here is your team's performance overview</div>
        </div>
        <div className="header-date-pill">
           <Sun size={18} className="sun-icon" />
           <span>{today}</span>
        </div>
      </div>

      {/* 2. SHARED STATS GRID */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon-wrapper"><Users size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-value">{totalMembers}</div>
            <div className="stat-label">Total Team Members</div>
          </div>
        </div>
        
        <div className="stat-card orange">
          <div className="stat-icon-wrapper"><AlertCircle size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-value">{pendingReviews}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Average Team Rating</div>
          </div>
        </div>
      </div>

      {/* 3. TABLE WIDGET (Using the Surface Card style) */}
      <div className="dashboard-surface">
        
        {/* Filter Toolbar */}
        <div className="filter-toolbar">
            <TextField 
                size="small" placeholder="Search employee..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }}
                sx={{ width: 300 }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select value={statusFilter} label="Filter by Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="All">All Statuses</MenuItem>
                    <MenuItem value="Goals Submitted">Goals Submitted</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rated">Rated</MenuItem>
                    <MenuItem value="Review Needed">Review Needed</MenuItem>
                </Select>
            </FormControl>
        </div>

        {/* MUI Table with Dark Theme Overrides */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="table-header-row">
                <TableCell>Employee Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Current Status</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            
              <TableBody>
                {filteredTeam.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <div className="employee-name">{employee.name}</div>
                      <div className="employee-email">{employee.email}</div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <Chip label={employee.status} color={getStatusColor(employee.status)} variant="filled" />
                    </TableCell>
                    <TableCell>
                      {typeof employee.rating === 'number' ? (
                          <div className="rating-val">
                             {employee.rating} <span className="rating-max">/ 5</span>
                          </div>
                      ) : (
                          <span className="status-pending">Pending</span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant={employee.status === 'Review Needed' ? "contained" : "outlined"}
                        size="small"
                        endIcon={<ChevronRight size={16} />}
                        onClick={() => navigate(`/manager/review/${employee.id}`)}
                      >
                        {employee.status === 'Review Needed' ? "Review Now" : "Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ManagerDashboard;