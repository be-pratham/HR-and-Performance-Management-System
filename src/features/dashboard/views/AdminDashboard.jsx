import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, ShieldCheck, UserPlus, Trash2, Megaphone, Plus, ArrowRight, X, User, Calendar } from 'lucide-react';
import { Button, Snackbar, Alert, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, Grid, Drawer, Typography, MenuItem, IconButton, Avatar, Divider } from '@mui/material';
import '../DashboardStyles.css';

import { updateEmployee } from '../../../store/reducers/employeeSlice';
import { addAnnouncement, deleteAnnouncement } from '../../../store/reducers/announcementSlice';
import DashboardHeader from '../components/DashboardHeader';
import DatePill from '../components/DatePill';
import StatCard from '../components/StatCard';
import SurfaceCard from '../components/SurfaceCard';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const allEmployees = useSelector((state) => state.employees.list) || [];
  const announcements = useSelector((state) => state.announcements.list) || [];
  
  const [announcementModal, setAnnouncementModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [annForm, setAnnForm] = useState({ title: '', content: '', targetRole: 'All', schedule: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', role: '', dept: '', email: '', status: '' });

  const hrStats = [
    { id: 1, label: "Total Employees", value: allEmployees.length, icon: Users, color: "blue" },
    { id: 2, label: "Active", value: allEmployees.filter(e => e.status === 'Active').length, icon: Briefcase, color: "green" },
    { id: 3, label: "On Leave", value: allEmployees.filter(e => e.status.toLowerCase().includes('leave')).length, icon: ShieldCheck, color: "orange" },
    { id: 4, label: "Probation", value: allEmployees.filter(e => e.status === 'Probation').length, icon: UserPlus, color: "purple" }
  ];

  const handleOpenDrawer = (emp) => {
    setSelectedEmp(emp);
    setEditForm(emp);
    setDrawerOpen(true);
  };

  const handleUpdateEmployee = () => {
    dispatch(updateEmployee(editForm));
    setDrawerOpen(false);
    setSnackbar({ open: true, message: 'Employee updated successfully!', severity: 'success' });
  };

  const handlePostAnnouncement = () => {
    dispatch(addAnnouncement(annForm));
    setAnnouncementModal(false);
    setAnnForm({ title: '', content: '', targetRole: 'All', schedule: '' });
    setSnackbar({ open: true, message: `Sent to ${annForm.targetRole}`, severity: 'success' });
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      
      <DashboardHeader 
        title="HR Management Portal" 
        subtitle="Administrator Oversight & Workforce Analytics" 
        rightContent={<DatePill />} 
      />

      {/* --- TOP STATS ROW FIX --- 
          Converted to CSS Grid to force 100% width distribution across 4 columns 
      */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 3, 
        width: '100%', 
        flexShrink: 0 
      }}>
        {hrStats.map((stat) => (
          <Box key={stat.id} sx={{ width: '100%', '& > div': { width: '100%', boxSizing: 'border-box' } }}>
            <StatCard {...stat} variant="compact" />
          </Box>
        ))}
      </Box>

      {/* --- BOTTOM SECTION --- */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '6fr 4fr' }, 
        gap: 3, 
        flexGrow: 1, 
        minHeight: 0,
        width: '100%',
        paddingBottom: '24px'
      }}>
        
        {/* --- COMMUNICATION HUB --- */}
        <SurfaceCard 
          title="Communication Hub"
          style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
          headerAction={
            <Button 
              variant="contained" 
              onClick={() => setAnnouncementModal(true)} 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600, 
                borderRadius: '8px', 
                gap: 1, 
                whiteSpace: 'nowrap',
                width: 'auto !important', 
                height: 'auto !important', 
                px: 2,
                py: 1
              }}
            >
              <Plus size={18} /> Create Announcement
            </Button>
          }
        >
          <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2, pr: 1 }}>
            {announcements.length > 0 ? announcements.map((msg) => (
              <div key={msg.id} style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={msg.targetRole} size="small" color={msg.targetRole === 'Manager' ? 'secondary' : 'primary'} sx={{ fontSize: '10px', height: 20 }} />
                    {msg.schedule && <Chip icon={<Calendar size={12}/>} label={`Scheduled: ${msg.schedule}`} size="small" variant="outlined" sx={{ fontSize: '10px', height: 20, color: '#94a3b8' }} />}
                  </Box>
                  <IconButton size="small" onClick={() => dispatch(deleteAnnouncement(msg.id))}>
                    <Trash2 size={16} color="#f44336"/>
                  </IconButton>
                </div>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{msg.title}</Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>{msg.content}</Typography>
              </div>
            )) : (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                 <Megaphone size={80} style={{ marginBottom: 20 }} />
                 <Typography variant="h5">Communication Hub is empty</Typography>
                 <Typography variant="body1">Create an announcement to update your staff.</Typography>
              </Box>
            )}
          </Box>
        </SurfaceCard>

        {/* --- EMPLOYEE DIRECTORY --- */}
        <SurfaceCard 
          title="Employee Directory"
          style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
          headerAction={
            <Button 
              onClick={() => navigate('/employees')} 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600, 
                color: '#60a5fa', 
                gap: 0.5, 
                px: 1, 
                whiteSpace: 'nowrap',
                width: 'auto !important', 
                height: 'auto !important'  
              }}
            >
              View Full List <ArrowRight size={16}/>
            </Button>
          }
        >
          <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 1.5, pr: 1 }}>
            {allEmployees.slice(0, 10).map((emp) => (
              <div key={emp.id} onClick={() => handleOpenDrawer(emp)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', cursor: 'pointer', border: '1px solid transparent', transition: '0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.borderColor = '#334155'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#3b82f6', width: 42, height: 42, fontSize: '15px' }}>{emp.name[0]}</Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: '600' }}>{emp.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>{emp.dept} • {emp.role}</Typography>
                  </Box>
                </Box>
                <Chip 
                  label={emp.status} 
                  size="small" 
                  sx={{ height: 22, fontSize: '10px', bgcolor: emp.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: emp.status === 'Active' ? '#4ade80' : '#fbbf24' }} 
                />
              </div>
            ))}
          </Box>
        </SurfaceCard>

      </Box>

      {/* --- QUICK EDIT DRAWER --- */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 450, bgcolor: '#0f172a', borderLeft: '1px solid #334155', color: '#fff' } }}>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 5 }}>
            <Typography variant="h5" fontWeight="bold">Employee Context</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#94a3b8' }}><X /></IconButton>
          </Box>

          {selectedEmp && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#3b82f6', fontSize: 40 }}>{selectedEmp.name[0]}</Avatar>
                <Typography variant="h5">{selectedEmp.name}</Typography>
                <Typography variant="body1" color="#94a3b8">{selectedEmp.email}</Typography>
              </Box>

              <Divider sx={{ borderColor: '#334155' }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField label="Job Title" fullWidth variant="filled" value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
                <TextField label="Organization Unit" fullWidth variant="filled" value={editForm.dept} onChange={(e) => setEditForm({...editForm, dept: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
                <TextField label="Employment Status" select fullWidth variant="filled" value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})} InputProps={{ sx: { color: '#fff' } }}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                  <MenuItem value="Medical Leave">Medical Leave</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" fullWidth onClick={handleUpdateEmployee} sx={{ py: 2, textTransform: 'none', fontWeight: 600 }}>Update Employee Data</Button>
                <Button variant="outlined" fullWidth onClick={() => navigate(`/employees/${selectedEmp.id}`)} sx={{ py: 2, borderColor: '#334155', color: '#94a3b8', textTransform: 'none', fontWeight: 600, gap: 1 }}>
                  <User size={18}/> Access Full Profile
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* --- ANNOUNCEMENT MODAL --- */}
      <Dialog open={announcementModal} onClose={() => setAnnouncementModal(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: '#fff', width: 600, borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', pt: 3 }}>Broadcast Announcement</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField select label="Visibility / Role Targeting" fullWidth variant="filled" value={annForm.targetRole} onChange={(e) => setAnnForm({...annForm, targetRole: e.target.value})} InputProps={{ sx: { color: '#fff' } }}>
              <MenuItem value="All">Global Staff (All)</MenuItem>
              <MenuItem value="Manager">Leadership (Managers Only)</MenuItem>
              <MenuItem value="Employee">Staff Level (Employees Only)</MenuItem>
            </TextField>
            <TextField label="Headline" fullWidth variant="filled" placeholder="Enter title..." onChange={(e) => setAnnForm({...annForm, title: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
            <TextField label="Detailed Message" fullWidth multiline rows={5} variant="filled" placeholder="Type message..." onChange={(e) => setAnnForm({...annForm, content: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
            <TextField label="Scheduled Release (Optional)" type="date" fullWidth variant="filled" InputLabelProps={{ shrink: true }} onChange={(e) => setAnnForm({...annForm, schedule: e.target.value})} InputProps={{ sx: { color: '#fff' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button onClick={() => setAnnouncementModal(false)} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 600 }}>Discard</Button>
          <Button variant="contained" onClick={handlePostAnnouncement} sx={{ px: 5, py: 1.5, textTransform: 'none', fontWeight: 600 }}>Post Broadcast</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default AdminDashboard;