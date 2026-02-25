import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PerformanceRadar = ({ data }) => {
  const chartData = [
    { 
      subject: 'Technical', 
      self: data.self?.technical || 0, 
      peer: data.peerAvg?.technical || 0, 
      manager: data.manager?.technical || 0 
    },
    { 
      subject: 'Delivery', 
      self: data.self?.delivery || 0, 
      peer: data.peerAvg?.delivery || 0, 
      manager: data.manager?.delivery || 0 
    },
    { 
      subject: 'Communication', 
      self: data.self?.communication || 0, 
      peer: data.peerAvg?.communication || 0, 
      manager: data.manager?.communication || 0 
    },
  ];

  return (
    <div className="w-full h-[350px] bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
          
          <Radar name="Self" dataKey="self" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
          <Radar name="Peers" dataKey="peer" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
          <Radar name="Manager" dataKey="manager" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
          
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px', color: '#f8fafc' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceRadar;