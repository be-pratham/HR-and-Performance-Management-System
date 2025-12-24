import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Shield, Check, Mail, Smartphone, Save } from 'lucide-react';
import './SettingsPage.css';
import '../../components/ui/modal.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [snackbar, setSnackbar] = useState({ show: false, message: '' });

  // 1. Profile State
  const [profile, setProfile] = useState({
    fullName: 'Pratham Bhardwaj',
    title: 'Senior Architect',
    email: 'pratham.b@navajna.com',
    bio: 'Passionate about cloud architecture and scalable systems.'
  });

  // 2. Notification State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifs: true,
    weeklyDigest: false,
    reviewUpdates: true
  });

  // 3. Security State
  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: false
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleToggle = (category, field) => {
    if (category === 'notif') {
      setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
    } else {
      setSecurity(prev => ({ ...prev, [field]: !prev[field] }));
    }
  };

  const handleSave = () => {
    setTimeout(() => {
        triggerSnackbar("Settings saved successfully!");
    }, 500);
  };

  const triggerSnackbar = (msg) => {
    setSnackbar({ show: true, message: msg });
    setTimeout(() => setSnackbar({ show: false, message: '' }), 3000);
  };

  return (
    <div className="settings-container">
      <div className="page-header">
         <div className="header-text">
            <h1>Settings</h1>
            <p>Manage your account preferences and security.</p>
         </div>
      </div>

      <div className="settings-layout">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="settings-sidebar">
            <div 
                className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
            >
                <User size={18} /> Profile
            </div>
            <div 
                className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
            >
                <Bell size={18} /> Notifications
            </div>
            <div 
                className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
            >
                <Lock size={18} /> Security
            </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="settings-content">
            
            {/* --- PROFILE TAB --- */}
            {activeTab === 'profile' && (
                <div>
                    <div className="section-title">
                        <h2>Public Profile</h2>
                        <p>Manage your personal information.</p>
                    </div>

                    <div className="profile-header">
                        <div className="profile-avatar-large">PB</div>
                        <div>
                            <button className="btn-upload">Change Avatar</button>
                            <p style={{fontSize:'0.75rem', color:'#64748b', marginTop:'8px'}}>JPG, GIF or PNG. 1MB Max.</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                className="form-input" 
                                name="fullName"
                                value={profile.fullName} 
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Job Title</label>
                            <input 
                                className="form-input" 
                                name="title"
                                value={profile.title} 
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Email Address</label>
                            <input 
                                className="form-input" 
                                name="email"
                                value={profile.email} 
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Bio</label>
                            <textarea 
                                className="form-textarea" 
                                name="bio"
                                style={{minHeight: '100px'}}
                                value={profile.bio} 
                                onChange={handleProfileChange}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- NOTIFICATIONS TAB --- */}
            {activeTab === 'notifications' && (
                <div>
                    <div className="section-title">
                        <h2>Notifications</h2>
                        <p>Choose how you want to be notified.</p>
                    </div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <h4>Email Alerts</h4>
                            <p>Receive emails about your goal progress and reviews.</p>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={notifications.emailAlerts}
                                onChange={() => handleToggle('notif', 'emailAlerts')} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <h4>Push Notifications</h4>
                            <p>Receive push notifications on your mobile device.</p>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={notifications.pushNotifs}
                                onChange={() => handleToggle('notif', 'pushNotifs')} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <h4>Weekly Digest</h4>
                            <p>Get a summary of your team's activity every Monday.</p>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={notifications.weeklyDigest}
                                onChange={() => handleToggle('notif', 'weeklyDigest')} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            )}

            {/* --- SECURITY TAB --- */}
            {activeTab === 'security' && (
                <div>
                    <div className="section-title">
                        <h2>Security</h2>
                        <p>Update your password and security settings.</p>
                    </div>

                    <div className="toggle-row">
                        <div className="toggle-info">
                            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                <h4>Two-Factor Authentication</h4>
                                <span className="badge-green">Enabled</span>
                            </div>
                            <p>Add an extra layer of security to your account.</p>
                        </div>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={security.twoFactor}
                                onChange={() => handleToggle('sec', 'twoFactor')} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div style={{marginTop: '32px'}}>
                        <h4 style={{marginBottom: '16px'}}>Change Password</h4>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Current Password</label>
                                <input className="form-input" type="password" placeholder="••••••••" />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input className="form-input" type="password" />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input className="form-input" type="password" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SAVE BUTTON (Visible on all tabs) */}
            <div className="settings-actions">
                <button className="btn-save" onClick={handleSave}>
                    <Save size={16} style={{marginRight: '8px'}}/> Save Changes
                </button>
            </div>

        </div>
      </div>

      {/* Snackbar */}
      <div className={`snackbar ${snackbar.show ? 'show' : ''}`}>
        <Check size={18} /> <span>{snackbar.message}</span>
      </div>

    </div>
  );
};

export default SettingsPage;