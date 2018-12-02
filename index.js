import express from 'express';
import path from 'path';
import axios from 'axios';

require('dotenv').config();
let app = express();

app.get('/api/summoner-match-list/:summonerName', async (req, res) => {
  let matchListDetails;
  let summonerName = req.params.summonerName;
  try {
    let userInfo = await getUserInfo(summonerName)
    let matchList = await getMatchList(userInfo.accountId)

    if (matchList && matchList.matches.length) {
      let matchIds = matchList.matches.map((match) => {
        return match.gameId
      })

      try {
        matchListDetails = await getMatchDetails(matchIds)

        let returnBody = matchListDetails.map(function (match) {

          let partiDetail = match.participantIdentities.find(function (partiIden) {
            return partiIden.player.accountId === userInfo.accountId
          })

          let teams = match.teams.map((team) => {
            return {
              teamId: team.teamId,
              summoners: []
            }
          })

          let partiMatchDetail;
          match.participants.map(function (parti) {
            if (parti.participantId === partiDetail.participantId) {
              partiMatchDetail = parti
            }

            teams.map(function (team, i) {
              if (team.teamId === parti.teamId) {
                match.participantIdentities.map(function (partiIden) {
                  if (parti.participantId === partiIden.participantId) {
                    teams[i].summoners.push({
                      summonerName: partiIden.player.summonerName,
                      accountId: partiIden.player.accountId,
                      championId: parti.championId
                    })
                  }
                })
              }
            })
          })

          return {
            gameId: match.gameId,
            platformId: match.platformId,
            gameCreation: match.gameCreation,
            gameDuration: match.gameDuration,
            gameMode: match.gameMode,
            gameType: match.gameType,
            win: partiMatchDetail.stats.win,
            summonerName: partiDetail.player.summonerName,
            championId: partiMatchDetail.championId,
            spell1Id: partiMatchDetail.spell1Id,
            spell2Id: partiMatchDetail.spell2Id,
            rune1Id: partiMatchDetail.stats.perkPrimaryStyle,
            rune2Id: partiMatchDetail.stats.perkSubStyle,
            teams,
            stats: {
              item0: partiMatchDetail.stats.item0,
              item1: partiMatchDetail.stats.item1,
              item2: partiMatchDetail.stats.item2,
              item3: partiMatchDetail.stats.item3,
              item4: partiMatchDetail.stats.item4,
              item5: partiMatchDetail.stats.item5,
              item6: partiMatchDetail.stats.item6,
              kills: partiMatchDetail.stats.kills,
              deaths: partiMatchDetail.stats.deaths,
              assists: partiMatchDetail.stats.assists,
              largestKillingSpree: partiMatchDetail.stats.largestKillingSpree,
              largestMultiKill: partiMatchDetail.stats.largestMultiKill,
              killingSprees: partiMatchDetail.stats.killingSprees,
              longestTimeSpentLiving: partiMatchDetail.stats.longestTimeSpentLiving,
              doubleKills: partiMatchDetail.stats.doubleKills,
              tripleKills: partiMatchDetail.stats.tripleKills,
              quadraKills: partiMatchDetail.stats.quadraKills,
              pentaKills: partiMatchDetail.stats.pentaKills,
              unrealKills: partiMatchDetail.stats.unrealKills,
              totalDamageDealt: partiMatchDetail.stats.totalDamageDealt,
              goldEarned: partiMatchDetail.stats.goldEarned,
              goldSpent: partiMatchDetail.stats.goldSpent,
              turretKills: partiMatchDetail.stats.turretKills,
              inhibitorKills: partiMatchDetail.stats.inhibitorKills,
              totalMinionsKilled: partiMatchDetail.stats.totalMinionsKilled,
              minionsPerMinute: partiMatchDetail.stats.totalMinionsKilled / (match.gameDuration / 60),
              totalTimeCrowdControlDealt: partiMatchDetail.stats.totalTimeCrowdControlDealt,
              champLevel: partiMatchDetail.stats.champLevel,
              firstBloodKill: partiMatchDetail.stats.firstBloodKill,
              firstBloodAssist: partiMatchDetail.stats.firstBloodAssist,
              firstTowerKill: partiMatchDetail.stats.firstTowerKill,
              firstTowerAssist: partiMatchDetail.stats.firstTowerAssist,
              firstInhibitorKill: partiMatchDetail.stats.firstInhibitorKill,
              firstInhibitorAssist: partiMatchDetail.stats.firstInhibitorAssist,
              combatPlayerScore: partiMatchDetail.stats.combatPlayerScore,
              objectivePlayerScore: partiMatchDetail.stats.objectivePlayerScore,
              totalPlayerScore: partiMatchDetail.stats.totalPlayerScore,
              totalScoreRank: partiMatchDetail.stats.totalScoreRank,
            }
          }
        })
        res.json(returnBody)
      } catch (err) {
        if (err.response) {
          res.status(err.response.status).json(err.response.data)
        }
      }
    }
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json(err.response.data)
    }
  }
})

function getUserInfo(name) {
  let url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.LOL_KEY}`

  return axios.get(url)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      throw err
    })
}
function getMatchList(accountId) {
  let url = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginIndex=0&endIndex=10&api_key=${process.env.LOL_KEY}`

  return axios.get(url)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      throw err
    })
}
function getMatchDetails(gameIdList) {
  let axiosCallList = [];
  gameIdList.forEach((id) => {
    let url = `https://na1.api.riotgames.com/lol/match/v4/matches/${id}?api_key=${process.env.LOL_KEY}`
    axiosCallList.push(axios.get(url))
  })

  return axios.all(axiosCallList)
    .then(axios.spread((...args) => {
      return args.map(arg => arg.data)
    }))
    .catch((err) => {
      throw err
    })
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);
