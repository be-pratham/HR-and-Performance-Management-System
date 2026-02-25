const RatingSelector = ({ value, onChange, label, disabled }) => (
  <div className="rating-group">
    <label>{label}</label>
    <div className="rating-options">
      {[1, 2, 3, 4, 5].map(num => (
        <button 
          key={num}
          disabled={disabled}
          className={`rating-btn ${value === num ? 'selected' : ''}`}
          onClick={() => onChange(num)}
        >
          {num}
        </button>
      ))}
    </div>
  </div>
);