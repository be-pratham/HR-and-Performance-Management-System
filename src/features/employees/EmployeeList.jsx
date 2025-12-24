import React, { useState } from 'react';
import { Plus, Search, X, User, Mail, Briefcase, Building, Trash2 } from 'lucide-react';

const MOCK_EMPLOYEES = [
  { id: 1, name: "Alice Johnson", email: "alice@navajna.com", role: "Manager", department: "Engineering", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@navajna.com", role: "Employee", department: "Design", status: "Active" },
  { id: 3, name: "Charlie Davis", email: "charlie@navajna.com", role: "Employee", department: "Marketing", status: "On Leave" },
  { id: 4, name: "Diana Prince", email: "diana@navajna.com", role: "Admin", department: "HR", status: "Active" },
  { id: 5, name: "Evan Wright", email: "evan@navajna.com", role: "Employee", department: "Engineering", status: "Inactive" },
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Employee Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: '',
    status: 'Active'
  });

  // Handle Search
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = {
      id: employees.length + 1,
      ...formData
    };
    setEmployees([...employees, newEmployee]);
    setIsModalOpen(false); // Close modal
    setFormData({ name: '', email: '', role: 'Employee', department: '', status: 'Active' }); // Reset form
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  // Styles
  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' };
  const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' };
  const labelStyle = { fontSize: '0.9rem', color: '#94a3b8' };

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      
      {/* --- Page Header --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Employee Directory</h1>
          <p style={{ color: '#94a3b8' }}>Manage your team members and permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* --- Search Bar --- */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
        <input 
          type="text" 
          placeholder="Search employees..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
        />
      </div>

      {/* --- Employee Table --- */}
      <div style={{ ...cardStyle, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155' }}>
            <tr>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{emp.name}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>{emp.role}</td>
                <td style={{ padding: '16px' }}>{emp.department}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '500',
                    backgroundColor: emp.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: emp.status === 'Active' ? '#34d399' : '#f87171'
                  }}>
                    {emp.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(emp.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    title="Remove Employee"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modal (Popup) --- */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        }}>
          <div style={{ ...cardStyle, width: '450px', padding: '24px', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Register New Employee</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', top: '15px', left: '10px', color: '#94a3b8' }} />
                  <input 
                    name="name" required
                    style={{ ...inputStyle, paddingLeft: '35px' }} 
                    placeholder="John Doe"
                    value={formData.name} onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', top: '15px', left: '10px', color: '#94a3b8' }} />
                  <input 
                    name="email" type="email" required
                    style={{ ...inputStyle, paddingLeft: '35px' }} 
                    placeholder="john@navajna.com"
                    value={formData.email} onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Department</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', top: '15px', left: '10px', color: '#94a3b8' }} />
                    <input 
                      name="department" required
                      style={{ ...inputStyle, paddingLeft: '35px' }} 
                      placeholder="Engineering"
                      value={formData.department} onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={16} style={{ position: 'absolute', top: '15px', left: '10px', color: '#94a3b8' }} />
                    <select 
                      name="role"
                      style={{ ...inputStyle, paddingLeft: '35px', appearance: 'none' }}
                      value={formData.role} onChange={handleInputChange}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', marginTop: '10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Create Account
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeesPage;