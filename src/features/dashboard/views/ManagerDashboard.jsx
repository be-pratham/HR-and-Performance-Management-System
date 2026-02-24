import React, { useState } from 'react';
import { Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Search, Users, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Shared UI Imports
import DashboardHeader from '../../../components/ui/DashboardHeader';
import DatePill from '../../../components/ui/DatePill';
import StatCard from '../../../components/ui/StatCard';
import SurfaceCard from '../../../components/ui/SurfaceCard';

const myTeam = [
  { id: 101, name: "Pratham Bhardwaj", role: "Architect", status: "Rated", rating: 5.0, email: "pratham@company.com" },
  { id: 102, name: "Alice Johnson", role: "Frontend Dev", status: "Goals Submitted", rating: "Pending", email: "alice@company.com" },
  { id: 103, name: "Bob Smith", role: "Backend Dev", status: "Approved", rating: 4.5, email: "bob@company.com" },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const totalMembers = myTeam.length;
  const pendingReviews = myTeam.filter(e => e.status === 'Goals Submitted' || e.status === 'Review Needed').length;
  const ratedEmployees = myTeam.filter(e => typeof e.rating === 'number');
  const avgRating = ratedEmployees.length > 0 ? (ratedEmployees.reduce((acc, curr) => acc + curr.rating, 0) / ratedEmployees.length).toFixed(1) : "N/A";

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
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <DashboardHeader 
        title={`Good morning, ${user?.name?.split(' ')[0] || 'Manager'}`}
        subtitle="Here is your team's performance overview"
        rightContent={<DatePill />}
      />

      <div className="stats-grid">
        <StatCard icon={Users} label="Total Team Members" value={totalMembers} color="blue" />
        <StatCard icon={AlertCircle} label="Pending Reviews" value={pendingReviews} color="orange" />
        <StatCard icon={TrendingUp} label="Average Team Rating" value={avgRating} color="green" />
      </div>

      <SurfaceCard title="Team Directory">
        <div className="filter-toolbar" style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
            <TextField 
                size="small" placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }} sx={{ width: 300 }}
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

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="table-header-row">
                <TableCell>Employee Name</TableCell><TableCell>Role</TableCell>
                <TableCell>Current Status</TableCell><TableCell>Rating</TableCell><TableCell align="right">Action</TableCell>
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
                  <TableCell><Chip label={employee.status} color={getStatusColor(employee.status)} variant="filled" /></TableCell>
                  <TableCell>
                    {typeof employee.rating === 'number' ? (
                        <div className="rating-val">{employee.rating} <span className="rating-max">/ 5</span></div>
                    ) : ( <span className="status-pending">Pending</span> )}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant={employee.status === 'Review Needed' ? "contained" : "outlined"} size="small" endIcon={<ChevronRight size={16} />} onClick={() => navigate(`/manager/review/${employee.id}`)}>
                      {employee.status === 'Review Needed' ? "Review Now" : "Details"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SurfaceCard>
    </div>
  );
};

export default ManagerDashboard;