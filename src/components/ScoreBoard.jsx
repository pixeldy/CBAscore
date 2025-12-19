import React, { useEffect, useState } from 'react';

/**
 * 记分牌组件
 */
export function ScoreBoard({ homeTeam, awayTeam, status }) {
  const [homeScore, setHomeScore] = useState(homeTeam?.score || 0);
  const [awayScore, setAwayScore] = useState(awayTeam?.score || 0);
  const [homeScoreChanged, setHomeScoreChanged] = useState(false);
  const [awayScoreChanged, setAwayScoreChanged] = useState(false);

  useEffect(() => {
    if (homeTeam?.score !== undefined && homeTeam.score !== homeScore) {
      setHomeScoreChanged(true);
      setHomeScore(homeTeam.score);
      setTimeout(() => setHomeScoreChanged(false), 500);
    }
  }, [homeTeam?.score]);

  useEffect(() => {
    if (awayTeam?.score !== undefined && awayTeam.score !== awayScore) {
      setAwayScoreChanged(true);
      setAwayScore(awayTeam.score);
      setTimeout(() => setAwayScoreChanged(false), 500);
    }
  }, [awayTeam?.score]);

  const getStatusText = () => {
    if (status === '2') return 'Live';
    if (status === '0') return '未开始';
    return '已结束';
  };

  const getStatusColor = () => {
    if (status === '2') return 'text-cba-success';
    return 'text-cba-text-secondary';
  };

  return (
    <div className="p-4 bg-cba-bg/30 backdrop-blur-sm rounded-lg border border-cba-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          {awayTeam?.logo && (
            <img
              src={awayTeam.logo}
              alt={awayTeam.name}
              className="w-10 h-10 object-contain"
            />
          )}
          <span className="text-sm text-cba-text font-medium flex-1 truncate">
            {awayTeam?.name || '客队'}
          </span>
        </div>
        <div className="flex items-center gap-2 mx-4">
          <span
            className={`text-2xl font-bold transition-all duration-300 ${
              awayScoreChanged
                ? 'text-cba-success scale-125'
                : 'text-cba-text'
            }`}
          >
            {awayScore >= 0 ? awayScore : '-'}
          </span>
          <span className="text-xl text-cba-text-secondary">:</span>
          <span
            className={`text-2xl font-bold transition-all duration-300 ${
              homeScoreChanged
                ? 'text-cba-success scale-125'
                : 'text-cba-text'
            }`}
          >
            {homeScore >= 0 ? homeScore : '-'}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-sm text-cba-text font-medium flex-1 truncate text-right">
            {homeTeam?.name || '主队'}
          </span>
          {homeTeam?.logo && (
            <img
              src={homeTeam.logo}
              alt={homeTeam.name}
              className="w-10 h-10 object-contain"
            />
          )}
        </div>
      </div>
      <div className="text-center">
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
}
