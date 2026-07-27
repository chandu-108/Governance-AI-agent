import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './Card';
import { ChevronRight } from 'lucide-react';

const QuickActionCard = ({ title, icon: Icon, to, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white',
    green: 'bg-green-50 text-green-600 border-green-100 group-hover:bg-green-600 group-hover:text-white',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white',
    orange: 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-600 group-hover:text-white',
    red: 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 group-hover:text-white',
  };

  return (
    <Link to={to} className="block group">
      <Card className="p-4 transition-all hover:shadow-md border border-gray-100 hover:border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors duration-200 ${colorMap[color].split(' group-hover')[0]} group-hover:bg-opacity-100`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="font-medium text-gray-900">{title}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
};

export default QuickActionCard;
