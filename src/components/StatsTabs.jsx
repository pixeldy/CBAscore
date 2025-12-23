import React from 'react';
import { TeamStats } from './TeamStats';
import { PlayerBox } from './PlayerBox';

/**
 * 数据切换Tab组件
 */
export function StatsTabs({ 
  stats, 
  activeTab, 
  onTabChange,
  activePlayerTeamTab,
  onPlayerTeamTabChange 
}) {
  if (!stats) {
    return (
      <div className="p-8 text-center text-cba-text-secondary">
        请选择比赛以查看统计数据
      </div>
    );
  }

  return (
    <div>
      {/* Tab切换 */}
      <div className="flex border-b border-cba-border">
        <button
          onClick={() => onTabChange('team')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'team'
              ? 'text-cba-orange border-b-2 border-cba-orange'
              : 'text-cba-text-secondary hover:text-cba-text'
          }`}
        >
          球队对比
        </button>
        <button
          onClick={() => onTabChange('player')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'player'
              ? 'text-cba-orange border-b-2 border-cba-orange'
              : 'text-cba-text-secondary hover:text-cba-text'
          }`}
        >
          球员统计
        </button>
      </div>

      {/* Tab内容 */}
      <div className="mt-4">
        {activeTab === 'team' && (
          <TeamStats homeTeam={stats.homeTeam} awayTeam={stats.awayTeam} />
        )}
        {activeTab === 'player' && (
          <PlayerBox 
            homeTeam={stats.homeTeam} 
            awayTeam={stats.awayTeam}
            activeTab={activePlayerTeamTab}
            onTabChange={onPlayerTeamTabChange}
          />
        )}
      </div>
    </div>
  );
}
