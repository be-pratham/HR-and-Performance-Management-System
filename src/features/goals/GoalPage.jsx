import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Lock, AlertCircle } from 'lucide-react';
import GoalCard from './components/GoalCard'; 
import ProgressWidget from '../../components/ui/ProgressWidget'; 
import { useAuth } from '../../context/AuthContext'; 
import '../../components/ui/modal.css'; 
import './GoalPage.css';

// --- INITIAL DATA (Updated with 'status') ---
const INITIAL_GOALS = [
  // --- MY GOALS (PERSONAL) ---
  {
    id: 1,
    category: "My Goals",
    title: "Enhance Technical Skill Set",
    description: "Acquire necessary certifications for AWS migration.",
    priority: "High",
    status: "Draft", 
    dueDate: "2025-12-15",
    progress: 0,
    tasks: [
      { id: 101, text: "Complete AWS Solutions Architect Course", completed: false },
      { id: 102, text: "Pass Practice Exam", completed: false }
    ],
    history: []
  },
  {
    id: 2,
    category: "My Goals",
    title: "Improve Public Speaking",
    description: "Prepare to present the Q4 architecture review to the board.",
    priority: "Medium",
    status: "Approved",
    dueDate: "2026-12-01",
    progress: 50,
    tasks: [
      { id: 201, text: "Join local Toastmasters club", completed: true },
      { id: 202, text: "Draft presentation slides", completed: false }
    ],
    history: [{ action: "Marked 'Join Toastmasters' as done", timestamp: "10:00 AM, Aug 1, 2025" }]
  },
  // --- TEAM GOALS ---
  {
    id: 3,
    category: "Team Goals",
    title: "Improve Cross-Functional Collaboration",
    description: "Organize weekly syncs with Design and QA teams.",
    priority: "Medium",
    status: "Pending Review", // <--- Locked Goal
    dueDate: "2025-12-30",
    progress: 0,
    tasks: [
      { id: 301, text: "Set up bi-weekly sync calendar invite", completed: false },
    ],
    history: []
  },
  {
    id: 4,
    category: "Team Goals",
    title: "Reduce Technical Debt",
    description: "Refactor legacy authentication module.",
    priority: "High",
    status: "Approved",
    dueDate: "2025-12-20",
    progress: 33,
    tasks: [
      { id: 401, text: "Audit current authentication codebase", completed: true },
      { id: 402, text: "Write new unit tests for login flow", completed: false },
    ],
    history: [{ action: "Audit completed", timestamp: "2:30 PM, Dec 5, 2025" }]
  },
];

const GoalsPage = () => {
  // --- 1. STATE MANAGEMENT ---
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState("My Goals");
  const [activeModal, setActiveModal] = useState(null); 
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Initialize Goals from LocalStorage
  const [goals, setGoals] = useState(() => {
    try {
      const savedGoals = localStorage.getItem('goals');
      return savedGoals ? JSON.parse(savedGoals) : INITIAL_GOALS;
    } catch (error) {
      console.error("Error parsing localstorage", error);
      return INITIAL_GOALS;
    }
  });

  // Form States
  const [formData, setFormData] = useState({ tasks: [] }); 
  const [taskInput, setTaskInput] = useState(""); 

  // --- 2. LOCAL STORAGE EFFECT ---
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  // --- 3. HELPER: LOCK CHECKER ---
  // If status is Approved or Pending Review, the goal details are LOCKED.
  const isGoalLocked = (goal) => {
    if (!goal) return false;
    // Allow editing only if Draft or Rejected (or undefined)
    return ['Approved', 'Pending Review'].includes(goal.status);
  };

  // --- 4. WIDGET STATS ---
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => Math.round(g.progress) === 100).length;
  const notStartedGoals = goals.filter(g => Math.round(g.progress) === 0).length;
  const inProgressGoals = totalGoals - completedGoals - notStartedGoals;
  
  const totalProgressSum = goals.reduce((acc, curr) => acc + curr.progress, 0);
  const overallPercentage = totalGoals > 0 ? (totalProgressSum / totalGoals) : 0;

  const widgetStats = {
      total: totalGoals,
      completed: completedGoals,
      inProgress: inProgressGoals,
      notStarted: notStartedGoals,
      overallPercentage
  };

  // --- 5. HISTORY FORMATTER ---
  const addToHistory = (goalId, action) => {
    const now = new Date();
    const timestamp = `${now.toLocaleTimeString()}, ${now.toLocaleDateString()}`;
    
    setGoals(prevGoals => prevGoals.map(g => {
      if (g.id === goalId) {
        return { ...g, history: [{ action, timestamp }, ...g.history] };
      }
      return g;
    }));
  };

  // --- 6. HANDLERS ---

  const handleCreateClick = () => {
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'Medium', 
      dueDate: '', 
      category: activeTab,
      status: 'Draft',
      tasks: []
    });
    setTaskInput("");
    setActiveModal('create');
  };

  const submitCreateGoal = () => {
    const newGoal = {
      id: Date.now(),
      ...formData,
      progress: 0,
      tasks: formData.tasks || [], 
      history: [{ action: "Goal Created", timestamp: new Date().toLocaleDateString() }]
    };
    setGoals([newGoal, ...goals]);
    setActiveModal(null);
  };

  const handleEditClick = (goal) => {
    setSelectedGoal(goal);
    setFormData({ ...goal, tasks: goal.tasks || [] }); 
    setTaskInput("");
    setActiveModal('edit');
  };

  const submitEditGoal = () => {
    // Determine new status: If it was Draft, maybe user is submitting it? 
    // For now, we keep status same unless explicitly changed, or reset to Pending if modified.
    
    const totalTasks = formData.tasks.length;
    const completedTasks = formData.tasks.filter(t => t.completed).length;
    const newProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    setGoals(prev => prev.map(g => g.id === selectedGoal.id ? { 
        ...g, 
        ...formData,
        progress: newProgress,
        history: [{ action: `Goal details updated`, timestamp: new Date().toLocaleTimeString() }, ...g.history] 
    } : g));
    addToHistory(selectedGoal.id, "Goal details modified");
    setActiveModal(null);
  };

  const handleFormTaskAdd = () => {
    if (!taskInput.trim()) return;
    const newTask = { id: Date.now(), text: taskInput, completed: false };
    setFormData({
      ...formData,
      tasks: [...(formData.tasks || []), newTask]
    });
    setTaskInput("");
  };

  const handleFormTaskRemove = (taskId) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter(t => t.id !== taskId)
    });
  };

  // PROGRESS & HISTORY HANDLERS
  const handleProgressClick = (goal) => {
    setSelectedGoal(goal);
    setTaskInput("");
    setActiveModal('progress');
  };

  const toggleTask = (taskId) => {
    const updatedGoals = goals.map(g => {
      if (g.id === selectedGoal.id) {
        const updatedTasks = g.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const completedCount = updatedTasks.filter(t => t.completed).length;
        const newProgress = updatedTasks.length > 0 ? (completedCount / updatedTasks.length) * 100 : 0;
        const updatedGoal = { ...g, tasks: updatedTasks, progress: newProgress };
        setSelectedGoal(updatedGoal); 
        return updatedGoal;
      }
      return g;
    });

    setGoals(updatedGoals);
    const taskName = selectedGoal.tasks.find(t => t.id === taskId).text;
    addToHistory(selectedGoal.id, `Task "${taskName}" status changed`);
  };

  const addActiveTask = () => {
    if (!taskInput.trim()) return;
    // NOTE: Usually you can update progress on Approved goals, but maybe not ADD new scope.
    // We will allow adding tasks in Progress view for now.
    const newTask = { id: Date.now(), text: taskInput, completed: false };
    
    const updatedGoals = goals.map(g => {
        if (g.id === selectedGoal.id) {
            const newTasks = [...g.tasks, newTask];
            const completedCount = newTasks.filter(t => t.completed).length;
            const newProgress = (completedCount / newTasks.length) * 100;
            const updatedGoal = { ...g, tasks: newTasks, progress: newProgress };
            setSelectedGoal(updatedGoal);
            return updatedGoal;
        }
        return g;
    });
    setGoals(updatedGoals);
    addToHistory(selectedGoal.id, `Added new task: "${taskInput}"`);
    setTaskInput("");
  };

  const handleHistoryClick = (goal) => {
    setSelectedGoal(goal);
    setActiveModal('history');
  };

  // --- 7. RENDER HELPERS ---
  const filteredGoals = goals.filter(g => g.category === activeTab);

  const modalContentStyle = {
    maxHeight: '90vh',      
    display: 'flex',        
    flexDirection: 'column' 
  };

  const modalBodyStyle = {
    overflowY: 'auto',      
    flex: 1,                
    paddingRight: '4px'     
  };

  // Status Badge Helper
  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#dcfce7'; // green-100
      case 'Pending Review': return '#fef9c3'; // yellow-100
      case 'Rejected': return '#fee2e2'; // red-100
      default: return '#f1f5f9'; // gray-100
    }
  };
  
  const getStatusTextColor = (status) => {
    switch(status) {
      case 'Approved': return '#166534'; 
      case 'Pending Review': return '#854d0e'; 
      case 'Rejected': return '#991b1b'; 
      default: return '#475569'; 
    }
  };

  return (
    <div className="goals-page">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-text">
            <h1>Goal Management</h1>
            <p>Welcome, {user?.name || 'Employee'}</p> 
        </div>
        <button className="btn-primary" onClick={handleCreateClick}>
            <Plus size={16} /> Create New Goal
        </button>
      </div>

      {/* TABS */}
      <div className="page-tabs">
        {["My Goals", "Team Goals", "Organization"].map(tab => (
            <span 
                key={tab} 
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
            >
                {tab}
            </span>
        ))}
      </div>

      {/* GRID */}
      <div className="goals-grid">
        <div className="goals-list">
            {filteredGoals.length > 0 ? (
                filteredGoals.map(goal => (
                    <div key={goal.id} className="goal-wrapper" style={{position: 'relative'}}>
                        {goal.status && (
                          <div style={{
                              position: 'absolute', top: -10, right: 10, zIndex: 10,
                              backgroundColor: getStatusColor(goal.status),
                              color: getStatusTextColor(goal.status),
                              padding: '4px 12px', borderRadius: '12px',
                              fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                              {goal.status}
                        </div>
                        )}
                        <GoalCard 
                            data={goal} 
                            onEdit={handleEditClick}
                            onUpdateProgress={handleProgressClick}
                            onHistory={handleHistoryClick}
                        />
                    </div>
                ))
            ) : (
                <p style={{color: '#64748b'}}>No goals found in {activeTab}</p>
            )}
        </div>
        
        {/* Right Column: Widgets */}
        <div className="goals-widgets">
           <ProgressWidget stats={widgetStats} />
           
           <div className="widget-card">
               <h3>Upcoming Deadlines</h3>
               {goals
                 .filter(g => g.dueDate) 
                 .sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)) 
                 .slice(0, 3) 
                 .map(g => (
                    <div key={g.id} className="deadline-item" style={{display:'flex', justifyContent:'space-between', marginTop:16, fontSize:'0.9rem'}}>
                        <span>{g.title}</span>
                        <span style={{background:'rgba(239, 68, 68, 0.2)', color:'#ef4444', padding:'2px 8px', borderRadius:12, fontSize:'0.75rem'}}>
                            {new Date(g.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                        </span>
                    </div>
               ))}
           </div>
        </div>
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 1. CREATE / EDIT MODAL */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <div className="modal-overlay">
            <div className="modal-content" style={modalContentStyle}>
                <div className="modal-header">
                    <h2>
                        {activeModal === 'create' ? 'Create Goal' : 'Edit Goal'}
                        {/* Show Lock Icon if locked */}
                        {activeModal === 'edit' && isGoalLocked(selectedGoal) && (
                            <span style={{fontSize:'0.8rem', marginLeft:'10px', color:'#ef4444', display:'inline-flex', alignItems:'center'}}>
                                <Lock size={14} style={{marginRight:4}}/> Locked
                            </span>
                        )}
                    </h2>
                    <X className="icon-btn" onClick={() => setActiveModal(null)} />
                </div>
                
                <div className="modal-body" style={modalBodyStyle}>
                    
                    {/* Locked Warning */}
                    {activeModal === 'edit' && isGoalLocked(selectedGoal) && (
                        <div style={{backgroundColor:'#fee2e2', color:'#991b1b', padding:'10px', borderRadius:'6px', marginBottom:'15px', display:'flex', alignItems:'center', fontSize:'0.9rem'}}>
                            <AlertCircle size={16} style={{marginRight:'8px'}}/>
                            This goal is {selectedGoal.status}. Details cannot be edited.
                        </div>
                    )}

                    <div className="form-group">
                        <label>Title</label>
                        <input 
                            className="form-input" 
                            disabled={activeModal === 'edit' && isGoalLocked(selectedGoal)}
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                        />
                    </div>
                    
                    {/* Status Dropdown (Only visible to create/edit) - usually auto-set, but kept for demo */}
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                             className="form-select"
                             disabled // Generally users shouldn't change status manually here, they "Submit"
                             value={formData.status || 'Draft'}
                        >
                             <option value="Draft">Draft</option>
                             <option value="Pending Review">Pending Review</option>
                             <option value="Approved">Approved</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select 
                            className="form-select" 
                            disabled={activeModal === 'edit' && isGoalLocked(selectedGoal)}
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option>My Goals</option>
                            <option>Team Goals</option>
                            <option>Organization</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Priority</label>
                        <select 
                            className="form-select" 
                            disabled={activeModal === 'edit' && isGoalLocked(selectedGoal)}
                            value={formData.priority} 
                            onChange={e => setFormData({...formData, priority: e.target.value})}
                        >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input 
                            type="date" 
                            className="form-input" 
                            disabled={activeModal === 'edit' && isGoalLocked(selectedGoal)}
                            value={formData.dueDate} 
                            onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            className="form-textarea" 
                            disabled={activeModal === 'edit' && isGoalLocked(selectedGoal)}
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                        />
                    </div>

                    {/* Tasks Section */}
                    <div className="form-group" style={{marginTop: '20px', borderTop:'1px solid #334155', paddingTop:'15px'}}>
                        <label>Success Criteria / Tasks</label>
                        
                        {/* Only show Add input if NOT locked */}
                        {!(activeModal === 'edit' && isGoalLocked(selectedGoal)) && (
                            <div style={{display:'flex', gap:'8px', marginBottom:'10px'}}>
                                <input 
                                    className="form-input" 
                                    style={{flex:1}} 
                                    placeholder="Add task..." 
                                    value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)}
                                />
                                <button className="btn-save" type="button" onClick={handleFormTaskAdd}>Add</button>
                            </div>
                        )}

                        <div className="history-list">
                            {formData.tasks && formData.tasks.length > 0 ? (
                                formData.tasks.map(task => (
                                    <div key={task.id} className="task-row" style={{justifyContent:'space-between'}}>
                                        <span>{task.text}</span>
                                        {/* Only show delete if NOT locked */}
                                        {!(activeModal === 'edit' && isGoalLocked(selectedGoal)) && (
                                            <Trash2 
                                                size={14} 
                                                style={{cursor:'pointer', color:'#ef4444'}} 
                                                onClick={() => handleFormTaskRemove(task.id)}
                                            />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <span style={{fontSize:'0.8rem', color:'#64748b'}}>No tasks added yet.</span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setActiveModal(null)}>
                        {isGoalLocked(selectedGoal) && activeModal === 'edit' ? 'Close' : 'Cancel'}
                    </button>
                    
                    {/* Hide Save button if Locked */}
                    {!(activeModal === 'edit' && isGoalLocked(selectedGoal)) && (
                        <button className="btn-save" onClick={activeModal === 'create' ? submitCreateGoal : submitEditGoal}>
                            {activeModal === 'create' ? 'Create Goal' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* 2. PROGRESS MODAL (Remains mostly same, allows updating progress on active goals) */}
      {activeModal === 'progress' && selectedGoal && (
        <div className="modal-overlay">
            <div className="modal-content" style={modalContentStyle}>
                <div className="modal-header">
                    <h2>Update Progress</h2>
                    <X className="icon-btn" onClick={() => setActiveModal(null)} />
                </div>
                
                <div className="modal-body" style={modalBodyStyle}>
                    <p style={{fontSize:'0.9rem', color:'#94a3b8'}}>Check tasks to update percentage automatically.</p>
                    
                    <div style={{display:'flex', gap:'8px'}}>
                        <input 
                            className="form-input" 
                            style={{flex:1}} 
                            placeholder="Add new task..."
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                        />
                        <button className="btn-save" onClick={addActiveTask}>Add</button>
                    </div>

                    <div className="history-list">
                        {selectedGoal.tasks.length === 0 && <p>No tasks yet.</p>}
                        {selectedGoal.tasks.map(task => (
                            <div key={task.id} className="task-row">
                                <input 
                                    type="checkbox" 
                                    className="task-checkbox"
                                    checked={task.completed} 
                                    onChange={() => toggleTask(task.id)}
                                />
                                <span style={{textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#64748b' : 'white'}}>
                                    {task.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{marginTop: '20px', textAlign:'right'}}>
                        <strong>Current Progress: {Math.round(selectedGoal.progress)}%</strong>
                    </div>
                </div>
                
                <div className="modal-actions">
                    <button className="btn-save" onClick={() => setActiveModal(null)}>Done</button>
                </div>
            </div>
        </div>
      )}

      {/* 3. HISTORY MODAL (No changes needed) */}
      {activeModal === 'history' && selectedGoal && (
        <div className="modal-overlay">
            <div className="modal-content" style={modalContentStyle}>
                <div className="modal-header">
                    <h2>History Log</h2>
                    <X className="icon-btn" onClick={() => setActiveModal(null)} />
                </div>
                <div className="modal-body" style={modalBodyStyle}>
                    <div className="history-list">
                        {selectedGoal.history.length === 0 ? (
                            <p style={{color: '#64748b'}}>No history recorded yet.</p>
                        ) : (
                            selectedGoal.history.map((record, idx) => (
                                <div key={idx} className="history-item">
                                    <span>{record.action}</span>
                                    <span className="history-date">on {record.timestamp}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default GoalsPage;