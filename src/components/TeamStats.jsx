import React from 'react';

/**
 * 球队对比统计组件
 * 使用双向进度条展示数据对比
 * 主队显示在左边，客队显示在右边
 */
export function TeamStats({ homeTeam, awayTeam }) {
  if (!homeTeam || !awayTeam) {
    return (
      <div className="p-8 text-center text-cba-text-secondary">
        暂无数据
      </div>
    );
  }

  // 根据模板html.team顺序配置所有统计数据
  const statsConfig = [
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
      key: 'steals',
      label: '抢断',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.steals?.value || 0),
    },
    {
      key: 'blocked',
      label: '盖帽',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.blocked?.value || 0),
    },
    {
      key: 'turnovers',
      label: '失误',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.turnovers?.value || 0),
    },
    {
      key: 'freeThrows',
      label: '罚球',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.freeThrows?.value || 0),
    },
    {
      key: 'threePointGoals',
      label: '三分命中数',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.threePointGoals?.value || 0),
    },
    {
      key: 'personalFouls',
      label: '犯规',
      format: (value) => value,
      getValue: (stats) => parseInt(stats?.personalFouls?.value || 0),
    },
    {
      key: 'fieldGoalsPercentage',
      label: '投篮命中率',
      format: (value) => `${value}%`,
      getValue: (stats) => parseFloat(stats?.fieldGoalsPercentage?.value || 0),
    },
    {
      key: 'freeThrowsPercentage',
      label: '罚球命中率',
      format: (value) => `${value}%`,
      getValue: (stats) => parseFloat(stats?.freeThrowsPercentage?.value || 0),
    },
    {
      key: 'threePointPercentage',
      label: '三分命中率',
      format: (value) => `${value}%`,
      getValue: (stats) => parseFloat(stats?.threePointPercentage?.value || 0),
    },
  ];

  const StatBar = ({ config, homeValue, awayValue }) => {
    const clamp = (n) => Math.max(0, Math.min(100, n));
    const homePercent = clamp(homeValue);
    const awayPercent = clamp(awayValue);

    return (
      <div className="py-3 border-b border-cba-border last:border-b-0">
        <div className="flex items-center gap-4">
          {/* 主队显示在左边 */}
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
          <span className="text-xs text-cba-text-secondary min-w-[100px] text-center">
            {config.label}
          </span>
          {/* 客队显示在右边 */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <span className="text-sm text-cba-text font-medium">
              {config.format(awayValue)}
            </span>
            <div className="flex-1 h-2 bg-blue-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${awayPercent}%` }}
              />
            </div>
            
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
