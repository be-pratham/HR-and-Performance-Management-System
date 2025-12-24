import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid, Divider } from '@mui/material';
import '../../components/ui/modal.css'; 
import GoalCard from '../goals/components/GoalCard'; 

const EmployeeReview = () => {
  const { employeeId } = useParams();
  
  // Mock fetching employee data based on ID
  const employeeData = { name: "Alice Johnson", goals: ["Fix Header Bug", "Optimize DB"] };
  
  const [managerComment, setManagerComment] = useState("");

  const handleApprove = () => {
    console.log(`Goals for ${employeeId} approved.`);
    // API Call to update status to 'Approved'
  };

  const handleReject = () => {
    console.log(`Goals for ${employeeId} rejected.`);
    // API Call to send back to employee
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{employeeData.name}'s Goals</Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Reviewing Q4 Objectives
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {/* LEFT: The Goals (Read Only mode) */}
        <Grid item xs={12} md={8}>
            {/* Reuse your GoalCard here! 
               Pass a prop like `readOnly={true}` to disable editing inputs 
            */}
            <Box sx={{ border: '1px solid #ddd', p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="h6">Goal 1: {employeeData.goals[0]}</Typography>
                <Typography variant="body2">Status: Pending Approval</Typography>
            </Box>
            
             <Box sx={{ border: '1px solid #ddd', p: 2, mb: 2, borderRadius: 2 }}>
                <Typography variant="h6">Goal 2: {employeeData.goals[1]}</Typography>
                <Typography variant="body2">Status: Pending Approval</Typography>
            </Box>
        </Grid>

        {/* RIGHT: Manager Controls */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#f9f9f9' }}>
            <Typography variant="h6" gutterBottom>Manager Actions</Typography>
            
            <TextField 
              fullWidth 
              multiline 
              rows={4} 
              label="Feedback / Comments" 
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
              sx={{ mb: 2, bgcolor: 'white' }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="success" 
                fullWidth 
                onClick={handleApprove}
              >
                Approve Goals
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                fullWidth
                onClick={handleReject}
              >
                Request Changes
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeReview;