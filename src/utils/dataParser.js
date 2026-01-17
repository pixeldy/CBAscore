/**
 * 数据解析工具函数
 * 解析接口返回的原始数据，转换为组件所需格式
 */

/**
 * 将时间戳转换为日期Key (YYYYMMDD)
 */
function timestampToDateKey(timestamp) {
  const date = new Date(parseInt(timestamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 解析比赛列表数据
 */
export function parseMatchList(data) {
  if (!data || !data.body) {
    return [];
  }

  try {
    // 获取服务器时间戳并转换为日期Key
    const sysdate = data.timeStamp;
    const todayKey = timestampToDateKey(sysdate);

    // 获取当日比赛列表
    const dailyMatches = data.body.matchList?.[todayKey] || [];

    // 格式化数据
    return dailyMatches.map((match) => {
      const homeTeam = match.confrontTeams?.find((t) => t.isHome === '1');
      const awayTeam = match.confrontTeams?.find((t) => t.isHome === '0');

      return {
        id: match.mgdbId,
        label: match.pkInfoTitle || '', // 只显示球队信息，不包含时间日期
        status: match.matchStatus, // "0"=未开始, "2"=进行中/完赛
        time: match.keyword,
        title: match.pkInfoTitle,
        homeTeam: homeTeam
          ? {
              id: homeTeam.id,
              name: homeTeam.name,
              logo: homeTeam.image,
              score: homeTeam.score !== undefined ? homeTeam.score : -1,
            }
          : null,
        awayTeam: awayTeam
          ? {
              id: awayTeam.id,
              name: awayTeam.name,
              logo: awayTeam.image,
              score: awayTeam.score !== undefined ? awayTeam.score : -1,
            }
          : null,
      };
    });
  } catch (error) {
    console.error('Failed to parse match list:', error);
    return [];
  }
}

/**
 * 解析统计数据
 */
export function parseMatchStats(data) {
  if (!data || !data.body || !data.body.statisticInfoList) {
    return null;
  }

  try {
    const statisticInfoList = data.body.statisticInfoList;
    
    // 分离主客队数据
    const homeTeamData = statisticInfoList.find((item) => item.teamInfo?.isHome === '1');
    const awayTeamData = statisticInfoList.find((item) => item.teamInfo?.isHome === '0');

    const parseTeamStats = (teamData) => {
      if (!teamData) return null;

      const teamInfo = teamData.teamInfo || {};
      const teamStatisticList = teamData.teamStatisticList || [];
      const playerStatisticList = teamData.playerStatisticList || [];

      // 解析球队统计数据
      const stats = {};
      teamStatisticList.forEach((stat) => {
        if (stat.dataKey) {
          stats[stat.dataKey] = {
            value: stat.value,
            itemName: stat.itemName,
            rate: stat.rate,
          };
        }
      });

      // 解析球员统计数据
      const players = playerStatisticList.map((player) => {
        const playerInfo = player.playerInfo || {};
        const playDataList = player.playDataList || [];

        // 将playDataList转换为对象
        const playerData = {};
        playDataList.forEach((data) => {
          if (data.dataKey) {
            playerData[data.dataKey] = data.value;
          }
        });

        // 解析时间（秒转换为分:秒格式的辅助函数）
        const formatTime = (seconds) => {
          if (!seconds) return '0:00';
          const totalSeconds = parseInt(seconds);
          const mins = Math.floor(totalSeconds / 60);
          const secs = totalSeconds % 60;
          return `${mins}:${String(secs).padStart(2, '0')}`;
        };

        return {
          id: playerInfo.playerId,
          name: playerInfo.playerName,
          number: playerInfo.playerNumber,
          avatar: playerInfo.playerImage,
          positionDescription: playerData.positionDescription || '',
          primaryPosition: playerData.primaryPosition || '',
          points: parseInt(playerData.points || 0),
          rebounds: parseInt(playerData.rebounds || 0),
          assists: parseInt(playerData.assists || 0),
          blocked: parseInt(playerData.blocked || 0),
          steals: parseInt(playerData.steals || 0),
          gameStart: playerData.gameStart === '1',
          seconds: parseInt(playerData.seconds || 0),
          timeFormatted: formatTime(playerData.seconds),
          fieldGoals: parseInt(playerData.fieldGoals || 0),
          fieldGoalsAttempted: parseInt(playerData.fieldGoalsAttempted || 0),
          fieldGoalsPercentage: parseFloat(playerData.fieldGoalsPercentage || 0),
          threePointGoals: parseInt(playerData.threePointGoals || 0),
          threePointAttempted: parseInt(playerData.threePointAttempted || 0),
          threePointPercentage: parseFloat(playerData.threePointPercentage || 0),
          freeThrows: parseInt(playerData.freeThrows || 0),
          freeThrowsAttempted: parseInt(playerData.freeThrowsAttempted || 0),
          freeThrowsPercentage: parseFloat(playerData.freeThrowsPercentage || 0),
          reboundsOffensive: parseInt(playerData.reboundsOffensive || 0),
          reboundsDefensive: parseInt(playerData.reboundsDefensive || 0),
          turnovers: parseInt(playerData.turnovers || 0),
          personalFouls: parseInt(playerData.personalFouls || 0),
          plusMinus: parseInt(playerData.plusMinus || 0),
          onCourt: playerData.onCourt === '1',
          onePointGoals: parseInt(playerData.onePointGoals || 0),
          onePointAttempted: parseInt(playerData.onePointAttempted || 0),
          onePointPercentage: parseFloat(playerData.onePointPercentage || 0),
          twoPointGoals: parseInt(playerData.twoPointGoals || 0),
          twoPointAttempted: parseInt(playerData.twoPointAttempted || 0),
          twoPointPercentage: parseFloat(playerData.twoPointPercentage || 0),
        };
      });

      return {
        teamInfo: {
          id: teamInfo.teamId,
          name: teamInfo.teamName,
          logo: teamInfo.teamLogo,
          isHome: teamInfo.isHome === '1',
        },
        stats,
        players,
      };
    };

    return {
      homeTeam: parseTeamStats(homeTeamData),
      awayTeam: parseTeamStats(awayTeamData),
    };
  } catch (error) {
    console.error('Failed to parse match stats:', error);
    return null;
  }
}
