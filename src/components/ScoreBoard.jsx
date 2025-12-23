import React, { useEffect, useState } from 'react';

/**
 * 记分牌组件
 */
export function ScoreBoard({ homeTeam, awayTeam, homeTeamStats, awayTeamStats, status }) {
  const getScore = (team, teamStats) => {
    // 优先使用详细统计中的分数，因为它更新更及时
    if (teamStats) {
      if (teamStats.points?.value !== undefined) return parseInt(teamStats.points.value);
      if (teamStats.score?.value !== undefined) return parseInt(teamStats.score.value);
    }
    // 降级使用列表中的分数
    return team?.score !== undefined ? team.score : 0;
  };

  const [homeScore, setHomeScore] = useState(getScore(homeTeam, homeTeamStats));
  const [awayScore, setAwayScore] = useState(getScore(awayTeam, awayTeamStats));
  const [homeScoreChanged, setHomeScoreChanged] = useState(false);
  const [awayScoreChanged, setAwayScoreChanged] = useState(false);

  useEffect(() => {
    const newScore = getScore(homeTeam, homeTeamStats);
    if (newScore !== homeScore) {
      setHomeScoreChanged(true);
      setHomeScore(newScore);
      setTimeout(() => setHomeScoreChanged(false), 500);
    }
  }, [homeTeam?.score, homeTeamStats]);

  useEffect(() => {
    const newScore = getScore(awayTeam, awayTeamStats);
    if (newScore !== awayScore) {
      setAwayScoreChanged(true);
      setAwayScore(newScore);
      setTimeout(() => setAwayScoreChanged(false), 500);
    }
  }, [awayTeam?.score, awayTeamStats]);

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
        {/* 主队显示在左边 */}
        <div className="flex items-center gap-3 flex-1">
          {homeTeam?.logo && (
            <img
              src={homeTeam.logo}
              alt={homeTeam.name}
              className="w-10 h-10 object-contain"
            />
          )}
          <span className="text-sm text-cba-text font-medium flex-1 truncate">
            {homeTeam?.name || '主队'}
          </span>
        </div>
        {/* 比分显示：主队 : 客队 */}
        <div className="flex items-center gap-2 mx-4">
          <span
            className={`text-2xl font-bold transition-all duration-300 ${
              homeScoreChanged
                ? 'text-cba-success scale-125'
                : 'text-cba-text'
            }`}
          >
            {homeScore >= 0 ? homeScore : '-'}
          </span>
          <span className="text-xl text-cba-text-secondary">:</span>
          <span
            className={`text-2xl font-bold transition-all duration-300 ${
              awayScoreChanged
                ? 'text-cba-success scale-125'
                : 'text-cba-text'
            }`}
          >
            {awayScore >= 0 ? awayScore : '-'}
          </span>
        </div>
        {/* 客队显示在右边 */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-sm text-cba-text font-medium flex-1 truncate text-right">
            {awayTeam?.name || '客队'}
          </span>
          {awayTeam?.logo && (
            <img
              src={awayTeam.logo}
              alt={awayTeam.name}
              className="w-10 h-10 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
