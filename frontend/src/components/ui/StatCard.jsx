import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TREND_CONFIG = {
  up:   { icon: TrendingUp,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
  down: { icon: TrendingDown, color: 'text-red-600',     bg: 'bg-red-50' },
  flat: { icon: Minus,        color: 'text-gray-500',    bg: 'bg-gray-50' },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  accent,
  className = '',
}) => {
  const trendCfg = trend ? TREND_CONFIG[trend] : null;
  const TrendIcon = trendCfg?.icon;

  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none">
          {title}
        </p>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              accent
                ? `bg-${accent}-100`
                : 'bg-gray-100'
            }`}
          >
            <Icon
              size={15}
              className={accent ? `text-${accent}-600` : 'text-gray-500'}
              strokeWidth={1.8}
            />
          </div>
        )}
      </div>

      <div className="text-[26px] font-bold text-gray-900 leading-none tracking-tight tabular-nums mb-1">
        {value}
      </div>

      {(description || trendCfg) && (
        <div className="flex items-center gap-2 mt-2">
          {trendCfg && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded ${trendCfg.bg} ${trendCfg.color}`}>
              <TrendIcon size={11} />
              {trendValue}
            </span>
          )}
          {description && (
            <span className="text-[12px] text-gray-400">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
