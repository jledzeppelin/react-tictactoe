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

 
 // make the Square component into a function component because Square doesnt have its own state
 function Square(props) {
   return (
     <button className="square" onClick={props.onClick}>
       {props.value}
     </button>
   );
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
      xIsNext: true, // boolean flips to determine which player goes next
    };
  }

  // handleClick(): fills the square i in the array defined in the constructor with 'X'
  // slice() creates a copy of the squares array to modify instead of modifying existing array
  // why copy? avoiding direct mutation lets us keep previous versions of the game's history intact
  // and reuse them late
  handleClick(i) {
    const squares = this.state.squares.slice();

    // if there is a winner already or the square is already filled ignore the click
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'; // check if X is next or not
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext, // simple flip boolean
    });
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
  // call calculateWinner() to determine the game's status
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

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

// helper function to know when there is a winner
function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] =  lines[i]; // copy current line

    // check if there is a line with the same square values and return that value (either X or O)
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  //return null if no winner
  return null;
}