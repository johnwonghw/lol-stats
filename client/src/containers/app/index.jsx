import React, { Component } from 'react';
import SearchBar from '../../components/search-bar';
import MatchCell from '../../components/match-cell';
import ReactLoading from 'react-loading';
import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summonerInput: '',
      matchList: [],
      errMsg: '',
      isLoading: false,
    }
  }

  handleInputChange = (e) => {
    let { errMsg } = this.state;
    if (errMsg) {
      this.setState({
        errMsg: ''
      })
    }
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleOnSearch = async () => {
    this.setState({
      isLoading: true
    })
    try {
      let { summonerInput } = this.state;

      if (/^[0-9A-Za-z _.]+$/.test(summonerInput)) {
        let url = `/api/summoner-match-list/${summonerInput}`;

        let searchRes = await fetch(url);
        let jsonSearchRes = await searchRes.json();

        if (jsonSearchRes && jsonSearchRes.length) {
          this.setState({
            matchList: jsonSearchRes,
            errMsg: ''
          })
        } else if (jsonSearchRes.status && jsonSearchRes.status.message) {
          this.setState({
            matchList: [],
            errMsg: jsonSearchRes.status.message
          })
        }
      } else {
        this.setState({
          matchList: [],
          errMsg: 'Please enter a valid summoner name'
        })
      }
    } catch (err) {
      this.setState({
        matchList: [],
        errMsg: 'An error occured, please try searching again'
      })
    }
    this.setState({
      isLoading: false
    })
  }

  handleContent = () => {
    let { matchList, errMsg, isLoading } = this.state;
    if (isLoading) {
      return (
        <div className="loading-wrapper">
          <ReactLoading type={'bars'} color={'grey'} height={'80px'} width={'80px'} />
        </div>
      )
    } else if (errMsg) {
      return (
        <span>{errMsg}</span>
      )
    } else if (matchList && matchList.length) {
      return matchList.map((match) => {
        return (
          <MatchCell
            key={match.gameId}
            championId={match.championId}
            gameDuration={match.gameDuration}
            win={match.win}
            gameId={match.gameId}
            platformId={match.platformId}
            spell1Id={match.spell1Id}
            spell2Id={match.spell2Id}
            rune1Id={match.rune1Id}
            rune2Id={match.rune2Id}
            stats={match.stats}
            summonerName={match.summonerName}
            teams={match.teams}
          />
        )
      })
    }
  }

  render() {
    let {
      summonerInput
    } = this.state

    let content = this.handleContent();
    return (
      <div className="app-container">
        <div className="summoner-search-bar">
          <SearchBar
            value={summonerInput}
            name="summonerInput"
            onChange={this.handleInputChange}
            onSubmit={this.handleOnSearch}
            placeholder="Search for a summoner!"
          />
        </div>
        <div className="content-wrapper">
          {content}
        </div>
      </div>
    );
  }
}

export default App;
