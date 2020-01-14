import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Square is a react 'component'
/**
 * We want the square component to remember that it was clicked and fill with
 * an 'X'. To 'remember' things components use state
 * 
 * In JS classes we need to call super when defining the constructor of
 * a subclass, react component classes with constructor should start with super(props)
 */
class Square extends React.Component {
  // render a single button
  render() {
    {/*by calling this.setState from the onclick handler, react
    rerenders that Square whenever its button is clicked.
    After the update, Square's this.state.value will be 'X'*/}
    return (
      <button 
        className="square" 
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

/**
 * To determine winner we need to know the game's state, we should store
 * the game's state in the parent Board component instead of in each square
 * 
 * To collect data from children we need to declare the shared state in their parent
 * component. the parent can pass the state back down using props
 */
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  // handleClick(): fills the square i in the array defined in the constructor with 'X'
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  /**
   * Since state is private to a component that defines it we cannot update Board from Square
   * Instead, pass down function from Board and have Square call that function when square is cliked
   * 
   * onClick prop is a function that Square can call when clicked
   */
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  // the squares are buttons
  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);