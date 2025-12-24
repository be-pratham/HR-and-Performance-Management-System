import React, { useState } from 'react';
import { Book, Search, X, FileText, ChevronRight, Download, Shield, Clock } from 'lucide-react';
import './policy.css';

const policiesData = [
  {
    id: 1,
    title: "Code of Conduct & Ethics",
    category: "General",
    updated: "Jan 10, 2025",
    content: "Our company is committed to maintaining the highest standards of professional and ethical conduct. All employees are expected to treat colleagues, clients, and partners with respect. This policy covers conflicts of interest, confidentiality, and workplace behavior. Zero tolerance is applied to harassment or discrimination of any kind."
  },
  {
    id: 2,
    title: "Leave & Time-Off Policy",
    category: "HR",
    updated: "Jan 10, 2025",
    content: "Employees are entitled to 20 days of paid leave annually. Leave requests must be submitted at least 3 days in advance via the HRMS portal. Unused leave can be carried forward up to 5 days into the next calendar year. Sick leave requires a medical certificate if exceeding 2 consecutive days."
  },
  {
    id: 3,
    title: "Remote Work Guidelines",
    category: "Operations",
    updated: "Jan 15, 2025",
    content: "Employees may work remotely up to 2 days a week with manager approval. Core hours (10 AM - 4 PM) must be maintained regardless of location. Ensure you have a stable internet connection and a secure workspace. All company data guidelines apply strictly to remote environments."
  },
  {
    id: 4,
    title: "Data Security & IT Acceptable Use",
    category: "IT Security",
    updated: "Jan 20, 2025",
    content: "Company devices are for business use only. Do not install unauthorized software. Passwords must be changed every 90 days. Phishing attempts should be reported immediately to the IT helpdesk. Do not access sensitive company data on public Wi-Fi without VPN."
  },
  {
    id: 5,
    title: "Health & Safety Protocol",
    category: "General",
    updated: "Feb 05, 2025",
    content: "Your safety is our priority. Report any workplace hazards immediately. In case of fire, use the designated emergency exits. First aid kits are available on every floor near the pantry. Regular drills will be conducted twice a year."
  },
  {
    id: 6,
    title: "Expense Reimbursement",
    category: "Finance",
    updated: "Feb 12, 2025",
    content: "Business-related expenses including travel, client dining, and office supplies will be reimbursed. Receipts must be uploaded to the portal within 30 days of the expense. Expenses over $500 require prior approval from a department head."
  }
];

const PolicyPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const filteredPolicies = policiesData.filter(policy => 
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      
      {/* Header Section */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Company Policies</h1>
          <div className="dashboard-subtitle">Read and understand our organizational guidelines</div>
        </div>
        <div className="policy-search-wrapper">
            <Search className="search-icon" size={20} />
            <input 
                type="text" 
                placeholder="Search policies..." 
                className="policy-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Policy List Surface */}
      <div className="dashboard-surface policy-surface">
        <div className="surface-title">
            <h3>Directory ({filteredPolicies.length})</h3>
            <Book size={20} color="var(--text-secondary)" />
        </div>

        <div className="policy-list">
            {filteredPolicies.length > 0 ? (
                filteredPolicies.map((policy, index) => (
                    <div key={policy.id} className="policy-row" onClick={() => setSelectedPolicy(policy)}>
                        <div className="policy-number-col">
                            <span className="policy-number">{index + 1}</span>
                        </div>
                        <div className="policy-info-col">
                            <h4 className="policy-row-title">{policy.title}</h4>
                            <div className="policy-meta">
                                <span className={`category-badge ${policy.category.toLowerCase().replace(/\s/g, '-')}`}>
                                    {policy.category}
                                </span>
                                <span className="update-date">Updated: {policy.updated}</span>
                            </div>
                        </div>
                        <div className="policy-action-col">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-results">
                    <FileText size={48} />
                    <p>No policies found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
      </div>

      {/* Modal View */}
      {selectedPolicy && (
        <div className="modal-overlay">
          <div className="modal-content policy-modal">
            <div className="modal-header">
              <div className="modal-title-group">
                  <Shield size={24} className="modal-icon-shield"/>
                  <div>
                    <h2>{selectedPolicy.title}</h2>
                    <span className="modal-subtitle">{selectedPolicy.category} Policy</span>
                  </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedPolicy(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body policy-body">
               <div className="policy-meta-bar">
                   <div className="meta-item">
                       <Clock size={16} />
                       <span>Last Updated: {selectedPolicy.updated}</span>
                   </div>
                   <div className="meta-item">
                       <FileText size={16} />
                       <span>Ref: POL-{selectedPolicy.id}0{selectedPolicy.id}</span>
                   </div>
               </div>
               <div className="policy-text-content">
                   <p>{selectedPolicy.content}</p>
                   <br/>
                   <p>If you have questions regarding this policy, please contact the {selectedPolicy.category === 'IT Security' ? 'IT Dept' : 'HR Department'}.</p>
               </div>
            </div>

            <div className="modal-footer">
              <button className="submit-btn" onClick={() => setSelectedPolicy(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PolicyPage;