import React, { useState } from 'react';

/**
 * 球员统计表格组件
 * 根据模板html.player顺序显示所有统计数据
 */
export function PlayerBox({ homeTeam, awayTeam }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'away' - 主队默认先显示

  if (!homeTeam || !awayTeam) {
    return (
      <div className="p-8 text-center text-cba-text-secondary">
        暂无数据
      </div>
    );
  }

  const activeTeam = activeTab === 'home' ? homeTeam : awayTeam;
  const players = activeTeam.players || [];

  // 根据模板html.player顺序定义表头
  const columns = [
    { key: 'positionDescription', label: '位置', width: '80px' },
    { key: 'primaryPosition', label: '首发位置', width: '80px' },
    { key: 'points', label: '得分', width: '60px' },
    { key: 'rebounds', label: '篮板', width: '60px' },
    { key: 'assists', label: '助攻', width: '60px' },
    { key: 'blocked', label: '盖帽', width: '60px' },
    { key: 'steals', label: '抢断', width: '60px' },
    { key: 'gameStart', label: '首发', width: '50px' },
    { key: 'seconds', label: '时间', width: '70px' },
    { key: 'fieldGoals', label: '投篮命中', width: '70px' },
    { key: 'fieldGoalsAttempted', label: '投篮出手', width: '70px' },
    { key: 'fieldGoalsPercentage', label: '投篮%', width: '70px' },
    { key: 'threePointGoals', label: '三分命中', width: '70px' },
    { key: 'threePointAttempted', label: '三分出手', width: '70px' },
    { key: 'threePointPercentage', label: '三分%', width: '70px' },
    { key: 'freeThrows', label: '罚球命中', width: '70px' },
    { key: 'freeThrowsAttempted', label: '罚球出手', width: '70px' },
    { key: 'freeThrowsPercentage', label: '罚球%', width: '70px' },
    { key: 'reboundsOffensive', label: '进攻篮板', width: '80px' },
    { key: 'reboundsDefensive', label: '防守篮板', width: '80px' },
    { key: 'turnovers', label: '失误', width: '60px' },
    { key: 'personalFouls', label: '犯规', width: '60px' },
    { key: 'plusMinus', label: '+/-', width: '70px' },
    { key: 'onCourt', label: '在场', width: '50px' },
    { key: 'onePointGoals', label: '一分命中', width: '70px' },
    { key: 'onePointAttempted', label: '一分出手', width: '70px' },
    { key: 'onePointPercentage', label: '一分%', width: '70px' },
    { key: 'twoPointGoals', label: '两分命中', width: '70px' },
    { key: 'twoPointAttempted', label: '两分出手', width: '70px' },
    { key: 'twoPointPercentage', label: '两分%', width: '70px' },
  ];

  // 获取单元格值
  const getCellValue = (player, key) => {
    switch (key) {
      case 'positionDescription':
        return player.positionDescription || '-';
      case 'primaryPosition':
        return player.primaryPosition || '-';
      case 'gameStart':
        return player.gameStart ? '是' : '否';
      case 'seconds':
        return player.timeFormatted || '0:00';
      case 'fieldGoalsPercentage':
      case 'threePointPercentage':
      case 'freeThrowsPercentage':
      case 'onePointPercentage':
      case 'twoPointPercentage':
        return player[key] !== undefined ? `${player[key]}%` : '-';
      case 'onCourt':
        return player.onCourt ? '是' : '否';
      case 'plusMinus':
        return player.plusMinus !== undefined 
          ? (player.plusMinus > 0 ? `+${player.plusMinus}` : String(player.plusMinus))
          : '-';
      default:
        return player[key] !== undefined ? player[key] : '-';
    }
  };

  // 获取单元格样式
  const getCellClassName = (key) => {
    const baseClass = 'px-2 py-2 text-center text-cba-text text-xs whitespace-nowrap';
    if (key === 'plusMinus') {
      return baseClass;
    }
    return baseClass;
  };

  return (
    <div>
      {/* 子Tab切换 - 主队在左边 */}
      <div className="flex border-b border-cba-border">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'home'
              ? 'text-cba-orange border-b-2 border-cba-orange'
              : 'text-cba-text-secondary hover:text-cba-text'
          }`}
        >
          {homeTeam.teamInfo?.name || '主队'}
        </button>
        <button
          onClick={() => setActiveTab('away')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'away'
              ? 'text-cba-orange border-b-2 border-cba-orange'
              : 'text-cba-text-secondary hover:text-cba-text'
          }`}
        >
          {awayTeam.teamInfo?.name || '客队'}
        </button>
      </div>

      {/* 表格 - 水平滚动 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cba-border bg-cba-bg/50 sticky top-0 z-10">
              <th className="px-3 py-2 text-left text-cba-text-secondary font-medium sticky left-0 bg-cba-bg/95 z-20">
                球员
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-2 py-2 text-center text-cba-text-secondary font-medium text-xs whitespace-nowrap"
                  style={{ minWidth: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-cba-text-secondary">
                  暂无球员数据
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr
                  key={player.id}
                  className={`border-b border-cba-border/50 hover:bg-cba-bg/30 transition-colors ${
                    player.onCourt ? 'bg-cba-success/10' : ''
                  }`}
                >
                  {/* 球员信息列 - 固定在左侧 */}
                  <td className="px-3 py-2 sticky left-0 bg-inherit z-10">
                    <div className="flex items-center gap-2">
                      {player.onCourt && (
                        <span className="w-2 h-2 rounded-full bg-cba-success flex-shrink-0" />
                      )}
                      <span className="text-xs text-cba-text-secondary">
                        {player.number || '-'}
                      </span>
                      <span className="text-cba-text font-medium">{player.name || '-'}</span>
                    </div>
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${getCellClassName(col.key)} ${
                        col.key === 'plusMinus' && player.plusMinus > 0
                          ? 'text-cba-success'
                          : col.key === 'plusMinus' && player.plusMinus < 0
                          ? 'text-cba-error'
                          : ''
                      }`}
                    >
                      {getCellValue(player, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
