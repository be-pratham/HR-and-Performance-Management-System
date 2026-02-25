import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { issueWeightedBonus } from '../../store/reducers/payrollSlice';
import { Box, Typography, Slider, Button, Paper, MenuItem, TextField, Divider, Alert } from '@mui/material';
import { TrendingUp, DollarSign, Award } from 'lucide-react';

const BonusManagement = () => {
  const dispatch = useDispatch();
  const employees = useSelector(state => state.employees.list);
  
  const [selectedId, setSelectedId] = useState('');
  const [ratings, setRatings] = useState({ manager: 3, peer: 3, self: 3 });

  const emp = employees.find(e => e.id === selectedId);
  
  // LIVE CALCULATIONS
  const weightedAvg = (ratings.manager * 0.5) + (ratings.peer * 0.3) + (ratings.self * 0.2);
  const bonusPct = (3 * weightedAvg).toFixed(2);
  const salary = { employee: 5000, admin: 6000, manager: 8000 }[emp?.role?.toLowerCase()] || 5000;
  const finalBonus = (salary * (bonusPct / 100)).toFixed(2);

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>Performance Bonus Engine</Typography>
      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 4 }}>Calculate weighted payouts based on 360° feedback loops.</Typography>

      <div className="dashboard-split-layout">
        <Paper className="dashboard-surface">
          <TextField select fullWidth label="Select Employee" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} sx={{ mb: 4 }}>
            {employees.map(e => <MenuItem key={e.id} value={e.id}>{e.name} ({e.role})</MenuItem>)}
          </TextField>

          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Manager Review (50%)</Typography>
            <Slider value={ratings.manager} min={1} max={5} step={0.1} onChange={(e, v) => setRatings({...ratings, manager: v})} valueLabelDisplay="auto" />

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>Peer Feedback (30%)</Typography>
            <Slider value={ratings.peer} min={1} max={5} step={0.1} onChange={(e, v) => setRatings({...ratings, peer: v})} valueLabelDisplay="auto" />
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>Self Assessment (20%)</Typography>
            <Slider value={ratings.self} min={1} max={5} step={0.1} onChange={(e, v) => setRatings({...ratings, self: v})} valueLabelDisplay="auto" />
          </Box>
        </Paper>

        {/* PREVIEW PANEL */}
        <Paper className="dashboard-surface" sx={{ textAlign: 'center', justifyContent: 'center' }}>
          <Award size={48} color="var(--brand-blue)" style={{ margin: '0 auto 16px' }} />
          <Typography variant="h6">Calculated Weighted Average</Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--brand-blue)' }}>{weightedAvg.toFixed(2)}</Typography>
          
          <Divider sx={{ my: 3, borderColor: 'var(--border-subtle)' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography color="var(--text-secondary)">Base Tier Salary:</Typography>
            <Typography color="white" fontWeight={600}>${salary}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography color="var(--text-secondary)">Bonus Multiplier:</Typography>
            <Typography color="var(--brand-green)" fontWeight={600}>{bonusPct}%</Typography>
          </Box>

          <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 800 }}>+ ${finalBonus}</Typography>
          
          <Button 
            variant="contained" 
            fullWidth 
            disabled={!selectedId}
            onClick={() => dispatch(issueWeightedBonus({ empId: selectedId, empName: emp.name, role: emp.role, scores: ratings }))}
          >
            Disburse Bonus
          </Button>
        </Paper>
      </div>
    </Box>
  );
};

export default BonusManagement;