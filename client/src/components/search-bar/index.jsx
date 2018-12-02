import React, { Component } from 'react';
import { FaSearch } from 'react-icons/fa'
import './_search-bar.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',

    }
  }

  handleOnSubmit = (e) => {
    let { onSubmit } = this.props;
    e.preventDefault();

    onSubmit();
  }

  render() {
    let {
      value,
      name,
      onChange,
      placeholder
    } = this.props
    return (
      <div className="search-bar-container">
        <form onSubmit={this.handleOnSubmit}>
          <input
            className="search-input"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </form>
      </div>
    );
  }
}

export default App;
