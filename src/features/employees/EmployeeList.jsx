import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, X, User, Mail, Briefcase, Building, Trash2 } from 'lucide-react';
import { addEmployee, deleteEmployee, setSearchTerm, selectFilteredEmployees} from '../../store/reducers/employeeSlice';

const EmployeesPage = () => {
  const dispatch = useDispatch();
  
  // 1. Get data from Redux instead of local state
  const filteredEmployees = useSelector(selectFilteredEmployees);
  const { searchTerm } = useSelector((state) => state.employees);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Employee Form State (Keep this local as it's only for the form)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    dept: '', // Changed to 'dept' to match your slice
    status: 'Active'
  });

  // 2. Handlers using Dispatch
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addEmployee(formData));
    setIsModalOpen(false); 
    setFormData({ name: '', email: '', role: 'Employee', dept: '', status: 'Active' }); 
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      dispatch(deleteEmployee(id));
    }
  };

  // 3. Styles (Preserved your style objects)
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
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* --- Search Bar --- */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
        <input 
          type="text" 
          placeholder="Search employees..." 
          value={searchTerm}
          // Dispatch search to Redux so it filters everywhere
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
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
                {/* Changed from emp.department to emp.dept to match slice */}
                <td style={{ padding: '16px' }}>{emp.dept}</td>
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
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Register New Employee</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={24} />
              </button>
            </div>

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
                      name="dept" required // Changed from department to dept
                      style={{ ...inputStyle, paddingLeft: '35px' }} 
                      placeholder="Engineering"
                      value={formData.dept} onChange={handleInputChange}
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