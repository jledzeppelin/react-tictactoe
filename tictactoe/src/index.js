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
  /**
   * Since state is private to a component that defines it we cannot update Board from Square
   * Instead, pass down function from Board and have Square call that function when square is cliked
   * 
   * onClick prop is a function that Square can call when clicked
   */
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} // get squares from Game
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // the squares are buttons
  // call calculateWinner() to determine the game's status
  render() {
    return (
      <div>
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


/**
 * we want the top-level Game component to display a list of past moves
 * here we store the history state
 * by having the history state in Game we can remove the squares state in Board
 * 
 * 
 * 
 * To render multiple items in React we can use an array of React elements
 */
class Game extends React.Component {
  //set up initial state
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0, // to indicate which step we're currently viewing
      xIsNext: true,
    };
  }


  // move handleClick from Board

  // slice() creates a copy of the squares array to modify instead of modifying existing array
  // why copy? avoiding direct mutation lets us keep previous versions of the game's history intact
  // and reuse them later
  handleClick(i) {
    // to ensure that if we go back in time and then make a new move we throw away the "future" history
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // we use concat() because it does not mutate the original array
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // jumpTo() updates the stepNumber
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, // since x always starts we know that x is next if the step number is even
    });
  }


  //use the most recent history entry to determine and display the game's status
  render() {
    const history = this.state.history; // history struct: array
    const current = history[this.state.stepNumber]; // the current selected move according to stepNumber
    const winner = calculateWinner(current.squares);


    // map the history of moves to react elements
    // in the history, each move has a unique id and since the moves are sequential it is
    // safe to use the move index as a key
    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move :
        'Go to game start';

      // for each move in the game's history we create a list item with a button
      // with onclick handler to call jumpTo()
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    // pass squares and onClick to Board component
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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