import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, UserPlus, Briefcase, ShieldCheck, Search, Trash2, Edit } from 'lucide-react';
import { Button, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box } from '@mui/material';
import { addEmployee, deleteEmployee, updateEmployee, setSearchTerm, selectFilteredEmployees } from '../../../store/reducers/employeeSlice';

// Shared UI Imports
import DashboardHeader from '../../../components/ui/DashboardHeader';
import DatePill from '../../../components/ui/DatePill';
import StatCard from '../../../components/ui/StatCard';
import SurfaceCard from '../../../components/ui/SurfaceCard';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const filteredEmployees = useSelector(selectFilteredEmployees);
  const allEmployees = useSelector((state) => state.employees.list);
  const { searchTerm } = useSelector((state) => state.employees);

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', role: '', dept: '', email: '', status: 'Active' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const hrStats = [
    { id: 1, label: "Total Employees", value: allEmployees.length, icon: Users, color: "blue" },
    { id: 2, label: "Active", value: allEmployees.filter(e => e.status === 'Active').length, icon: Briefcase, color: "green" },
    { id: 3, label: "On Leave", value: allEmployees.filter(e => e.status.toLowerCase().includes('leave')).length, icon: ShieldCheck, color: "orange" },
    { id: 4, label: "Probation", value: allEmployees.filter(e => e.status === 'Probation').length, icon: UserPlus, color: "purple" }
  ];

  const handleOpen = (emp = null) => {
    if (emp) { setFormData(emp); setIsEditing(true); } 
    else { setFormData({ id: '', name: '', role: '', dept: '', email: '', status: 'Active' }); setIsEditing(false); }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (isEditing) {
      dispatch(updateEmployee(formData));
      setSnackbar({ open: true, message: 'Employee updated successfully!', severity: 'success' });
    } else {
      dispatch(addEmployee(formData));
      setSnackbar({ open: true, message: 'New employee added!', severity: 'success' });
    }
    handleClose();
  };

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id));
    setSnackbar({ open: true, message: 'Employee removed.', severity: 'error' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'On Leave': 
      case 'Medical Leave': return 'warning';
      case 'Probation': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader 
        title="HR Management Portal" 
        subtitle="Administrator Oversight & Workforce Analytics" 
        rightContent={<DatePill />} 
      />

      <div className="admin-stats-row">
        {hrStats.map((stat) => (
          <StatCard key={stat.id} {...stat} variant="compact" />
        ))}
      </div>

      <SurfaceCard 
        title="Employee Directory"
        headerAction={
          <div className="title-group">
            <TextField 
              size="small" placeholder="Search by name, dept, or role..." value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              InputProps={{ startAdornment: <Search size={16} style={{marginRight: 8}} /> }}
            />
            <Button variant="contained" startIcon={<UserPlus size={16} />} onClick={() => handleOpen()}>
              Add Employee
            </Button>
          </div>
        }
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell><TableCell>Department</TableCell>
                <TableCell>Status</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>
                    <div className="employee-name">{emp.name}</div>
                    <div className="employee-email">{emp.role} • {emp.email}</div>
                  </TableCell>
                  <TableCell>{emp.dept}</TableCell>
                  <TableCell><Chip label={emp.status} color={getStatusColor(emp.status)} size="small" /></TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <button className="icon-btn-subtle" onClick={() => handleOpen(emp)}><Edit size={18} color="var(--brand-blue)" /></button>
                      <button className="icon-btn-subtle" onClick={() => handleDelete(emp.id)}><Trash2 size={18} color="#f44336" /></button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SurfaceCard>

      {/* Keep Dialog and Snackbar here for now */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Full Name" fullWidth value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <TextField label="Role" fullWidth value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
            <TextField label="Department" fullWidth value={formData.dept} onChange={(e) => setFormData({...formData, dept: e.target.value})} />
            <TextField label="Email" fullWidth value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default AdminDashboard;