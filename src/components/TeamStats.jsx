import React from 'react';

/**
 * 球队对比统计组件
 * 使用双向进度条展示数据对比
 */
export function TeamStats({ homeTeam, awayTeam }) {
  if (!homeTeam || !awayTeam) {
    return (
      <div className="p-8 text-center text-cba-text-secondary">
        暂无数据
      </div>
    );
  }

  const statsConfig = [
    {
      key: 'fieldGoalsPercentage',
      label: '投篮命中率',
      format: (value) => `${value}%`,
      getValue: (stats) => parseFloat(stats?.fieldGoalsPercentage?.value || 0),
    },
    {
      key: 'threePointPercentage',
      label: '三分命中率',
      format: (value) => `${value}%`,
      getValue: (stats) => parseFloat(stats?.threePointPercentage?.value || 0),
    },
    {
      key: 'freeThrowsPercentage',
      label: '罚球命中率',
      format: (value) => `${value}%`,
      getValue: (stats) => parseFloat(stats?.freeThrowsPercentage?.value || 0),
    },
    {
      key: 'rebounds',
      label: '篮板',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.rebounds?.value || 0),
    },
    {
      key: 'assists',
      label: '助攻',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.assists?.value || 0),
    },
    {
      key: 'turnovers',
      label: '失误',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.turnovers?.value || 0),
    },
  ];

  const StatBar = ({ config, homeValue, awayValue }) => {
    const maxValue = Math.max(homeValue, awayValue, 1);
    const homePercent = (homeValue / maxValue) * 100;
    const awayPercent = (awayValue / maxValue) * 100;

    return (
      <div className="py-3 border-b border-cba-border last:border-b-0">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center justify-end gap-2">
            <span className="text-sm text-cba-text font-medium">
              {config.format(awayValue)}
            </span>
            <div className="flex-1 h-2 bg-cba-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-cba-orange transition-all duration-500"
                style={{ width: `${awayPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-cba-text-secondary min-w-[80px] text-center">
            {config.label}
          </span>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-cba-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-cba-orange transition-all duration-500 ml-auto"
                style={{ width: `${homePercent}%` }}
              />
            </div>
            <span className="text-sm text-cba-text font-medium">
              {config.format(homeValue)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {statsConfig.map((config) => {
        const homeValue = config.getValue(homeTeam.stats);
        const awayValue = config.getValue(awayTeam.stats);
        return (
          <StatBar
            key={config.key}
            config={config}
            homeValue={homeValue}
            awayValue={awayValue}
          />
        );
      })}
    </div>
  );
}
