import React from 'react';
import Icon from './Icon';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof dynamicIconImports;
  color: 'blue' | 'green' | 'orange' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isDarkMode?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  color, 
  trend,
  isDarkMode
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const trendClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600'
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 ${isDarkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>{value}</p>
          {subtitle && (
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium mt-2 ${
              trend.isPositive ? trendClasses.positive : trendClasses.negative
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
