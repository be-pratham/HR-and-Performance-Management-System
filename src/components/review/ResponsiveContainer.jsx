import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PerformanceRadar = ({ scores }) => {
  return (
    <div className="w-full h-[400px] bg-[#1e293b] p-6 rounded-xl border border-slate-800 shadow-lg">
      <h3 className="text-slate-100 font-semibold mb-4 text-lg">360° Competency Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scores}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
          
          <Radar
            name="Self"
            dataKey="self"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
          />
          
          <Radar
            name="Peer Avg"
            dataKey="peer"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          
          <Radar
            name="Manager"
            dataKey="manager"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.3}
          />
          
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceRadar;