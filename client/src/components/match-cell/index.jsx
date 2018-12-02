import React, { Component } from 'react';
import classnames from 'classnames';
import fullChampionData from '../../utils/data/lol-static/8.20.1/data/en_US/championFull.json'
import summonerData from '../../utils/data/lol-static/8.20.1/data/en_US/summoner.json'
import runeData from '../../utils/data/lol-static/8.20.1/data/en_US/runesReforged.json'
import itemData from '../../utils/data/lol-static/8.20.1/data/en_US/item.json'

import './_match-cell.scss'

class MatchCell extends Component {

  getChampDetails = (championId) => {
    let name = fullChampionData.keys[championId];
    let iconName = fullChampionData.data[name].image.full;

    return {
      name,
      iconName,
    }
  }

  getSpellsDetail = () => {
    let { spell1Id, spell2Id } = this.props;
    let spellsDetail = {};

    Object.keys(summonerData.data).forEach((spellKey) => {
      if (parseInt(summonerData.data[spellKey].key) === spell1Id) {
        spellsDetail.spell1 = {
          name: summonerData.data[spellKey].name,
          iconName: summonerData.data[spellKey].image.full
        }
      } else if (parseInt(summonerData.data[spellKey].key) === spell2Id) {
        spellsDetail.spell2 = {
          name: summonerData.data[spellKey].name,
          iconName: summonerData.data[spellKey].image.full
        }
      }
    })
    return spellsDetail;
  }

  getRunesDetail = () => {
    let { rune1Id, rune2Id } = this.props;
    let runesDetail = {};

    runeData.forEach((rune) => {
      if (rune.id === rune1Id) {
        runesDetail.rune1 = {
          name: rune.name,
          iconName: rune.icon
        }
      } else if (rune.id === rune2Id) {
        runesDetail.rune2 = {
          name: rune.name,
          iconName: rune.icon
        }
      }
    })

    return runesDetail;
  }

  calcDuration = () => {
    let { gameDuration } = this.props;
    var minutes = Math.floor(gameDuration / 60);
    var seconds = gameDuration % 60;

    return `${minutes}m${seconds ? ` ${seconds}s` : '0s'}`
  }

  getKdaRatio = () => {
    let { kills, deaths, assists } = this.props.stats
    if (deaths === 0) {
      return 'Perfect KDA'
    } else {
      let ratio = (kills + assists) / deaths
      return `${ratio.toFixed(2)}:1 KDA`
    }
  }

  getItemImgs = () => {
    let { gameId } = this.props;
    let { item0, item1, item2, item3, item4, item5, item6 } = this.props.stats;

    let itemImages = [item0, item1, item2, item3, item4, item5, item6].map((itemId, i) => {
      if (itemData.data[itemId]) {
        let itemName = itemData.data[itemId].name;
        let iconName = itemData.data[itemId].image.full;
        return (
          <img
            className="item-icon"
            key={`${gameId}-${itemId}-${i}`}
            src={`http://ddragon.leagueoflegends.com/cdn/8.20.1/img/item/${iconName}`}
            alt={itemName}
          />
        )
      }
      return false;
    })

    return itemImages;
  }

  getTeamDetail = () => {
    let { teams, summonerName, gameId } = this.props;

    let teamsDetail = teams.map((team) => {
      return (
        <div className="team-summoners-wrapper" key={`${gameId}-${team.teamId}`}>
          {team.summoners.map((summoner) => {
            let champName = fullChampionData.keys[summoner.championId];
            let champIcon = fullChampionData.data[champName].image.full;
            return (
              <div 
              key={`${gameId}-${team.teamId}-${summoner.summonerName}`}
              className={classnames({
                "summoner": true,
                "current-summoner": summoner.summonerName === summonerName
              })}>
                <img
                  className="champion-icon"
                  src={`http://ddragon.leagueoflegends.com/cdn/8.20.1/img/champion/${champIcon}`}
                  alt={champName}
                />
                <span className="summoner-name">{summoner.summonerName}</span>
              </div>
            )
          })}
        </div>
      )
    })

    return teamsDetail;
  }

  render() {
    let {
      championId,
      win,
      stats,
      summonerName,
    } = this.props;

    let champDetails = this.getChampDetails(championId);
    let spellsDetail = this.getSpellsDetail();
    let runesDetail = this.getRunesDetail();
    let revGameDuration = this.calcDuration();
    let kdaRatio = this.getKdaRatio();
    let itemImages = this.getItemImgs();
    let teamsDetail = this.getTeamDetail();

    return (
      <div className={classnames({
        "match-cell-container": true,
        "win": win,
      })}>
        <div className="general-details-wrapper">
          <div className="summoner-name">{summonerName}</div>
          <div>
            {win ? <span className="win outcome">Victory</span> : <span className="lose outcome">Defeat</span>}
          </div>
          <div>
            {revGameDuration}
          </div>
        </div>
        <div className="champion-details-wrapper">
          <div className="champion-images">
            <div className="champion-icon-wrapper">
              <img
                className="champion-icon"
                src={`http://ddragon.leagueoflegends.com/cdn/8.20.1/img/champion/${champDetails.iconName}`}
                alt={champDetails.name}
              />
            </div>
            <div className="spells">
              <img
                className="spell-icon"
                src={`http://ddragon.leagueoflegends.com/cdn/8.20.1/img/spell/${spellsDetail.spell1.iconName}`}
                alt={spellsDetail.spell1.name}
              />
              <img
                className="spell-icon"
                src={`http://ddragon.leagueoflegends.com/cdn/8.20.1/img/spell/${spellsDetail.spell2.iconName}`}
                alt={spellsDetail.spell2.name}
              />
            </div>
            <div className="runes">
              <img
                className="rune-icon"
                src={require(`../../utils/data/lol-static/img/${runesDetail.rune1.iconName}`)}
                alt={runesDetail.rune1.name}
              />
              <img
                className="rune-icon"
                src={require(`../../utils/data/lol-static/img/${runesDetail.rune2.iconName}`)}
                alt={runesDetail.rune2.name}
              />
            </div>
          </div>
          <div className="champion-name">{champDetails.name}</div>
        </div>
        <div className="kda-wrapper">
          <div>
            <span className="kills">{stats.kills}</span>
            <span className="seperator">/</span>
            <span className="deaths">{stats.deaths}</span>
            <span className="seperator">/</span>
            <span className="assists">{stats.assists}</span>
          </div>
          <div className="kda-ratio">
            {kdaRatio}
          </div>
        </div>
        <div className="stats-wrapper">
          <div>Level {stats.champLevel}</div>
          <div>{stats.totalMinionsKilled} ({stats.minionsPerMinute.toFixed(1)}) CS</div>
        </div>
        <div className="items-wrapper">
          <div className="item-icon-wrapper">
            {itemImages}
          </div>
        </div>
        <div className="teams-wrapper">
          {teamsDetail}
        </div>
      </div>
    );
  }
}

export default MatchCell;
