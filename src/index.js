/**
 * REACT DEMO
 * Under the guidance of react docs (https://zh-hans.reactjs.org/tutorial/tutorial.html#function-components)
 * @date 2021/9/6
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 函数式组件
function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>); //@tips: 使用箭头函数而非直接写函数 不然会在初始时渲染一次
  }

  render() {
    return (
      <div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  /**
   * 走步操作
   * @param {number} i 落字方格的索引
   * @returns 
   */
  handelClick(i) {
    const stepNumber = this.state.stepNumber;
    const history = this.state.history.slice(0, stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ history: this.state.history.concat([{squares : squares}]), xIsNext: !this.state.xIsNext, stepNumber: history.length });
  }

  /**
   * 悔步操作
   * @params {number} index 回到历史记录的第几步
   */
  jumpTo(index) {
    this.setState({
      stepNumber : index,
      xIsNext : (index % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner is ' + winner;
    } else {
      status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, index) => {
      const desc = index ? "Go to move #" + index : "Go to game start";
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      )
    })

    return (
      <div className='game'>
        <div className='game-board'>
          <Board squares={current.squares} onClick={(i)=>this.handelClick(i)}/>
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// 判断胜者
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let item of lines) {
    const [a, b, c] = item;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
