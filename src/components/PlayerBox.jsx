import React, { useState } from 'react';

/**
 * 球员统计表格组件
 */
export function PlayerBox({ homeTeam, awayTeam }) {
  const [activeTab, setActiveTab] = useState('away'); // 'away' | 'home'

  if (!homeTeam || !awayTeam) {
    return (
      <div className="p-8 text-center text-cba-text-secondary">
        暂无数据
      </div>
    );
  }

  const activeTeam = activeTab === 'home' ? homeTeam : awayTeam;
  const players = activeTeam.players || [];

  // 根据表现动态显示Stat列
  const getStatText = (player) => {
    if (player.rebounds >= 10) return `${player.rebounds}板`;
    if (player.assists >= 8) return `${player.assists}助`;
    if (player.steals >= 3) return `${player.steals}断`;
    if (player.blocked >= 2) return `${player.blocked}帽`;
    return '-';
  };

  return (
    <div>
      {/* 子Tab切换 */}
      <div className="flex border-b border-cba-border">
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
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cba-border">
              <th className="px-3 py-2 text-left text-cba-text-secondary font-medium">
                Player
              </th>
              <th className="px-3 py-2 text-center text-cba-text-secondary font-medium">
                PTS
              </th>
              <th className="px-3 py-2 text-center text-cba-text-secondary font-medium">
                +/-
              </th>
              <th className="px-3 py-2 text-center text-cba-text-secondary font-medium">
                Stat
              </th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-3 py-8 text-center text-cba-text-secondary">
                  暂无球员数据
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr
                  key={player.id}
                  className="border-b border-cba-border/50 hover:bg-cba-bg/30 transition-colors"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {player.onCourt && (
                        <span className="w-2 h-2 rounded-full bg-cba-success" />
                      )}
                      <span className="text-xs text-cba-text-secondary">
                        {player.number || '-'}
                      </span>
                      <span className="text-cba-text">{player.name || '-'}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-cba-text font-medium">
                    {player.points}
                  </td>
                  <td
                    className={`px-3 py-2 text-center ${
                      player.plusMinus > 0
                        ? 'text-cba-success'
                        : player.plusMinus < 0
                        ? 'text-cba-error'
                        : 'text-cba-text'
                    }`}
                  >
                    {player.plusMinus > 0 ? '+' : ''}
                    {player.plusMinus}
                  </td>
                  <td className="px-3 py-2 text-center text-cba-text-secondary">
                    {getStatText(player)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
