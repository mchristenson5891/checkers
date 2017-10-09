var gameBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0]
];

const pieces = [];
const squares = [];
let isPlayerRed = true;

Math.getDistance = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
};

class Piece {
  constructor(element, position) {
    this.element = element,
    this.x = position[1],
    this.y = position[0],
    this.isKing = false
  }

  makeKing() {
    this.king = true;
  }
}

class Square {
  constructor(element, position) {
    this.element = element,
      this.x = position[1],
      this.y = position[0]
  }

  isSquareEmpty() {
    return gameBoard[this.y][this.x] === 0;
  }

  isOpponentPiece() {
    return gameBoard[this.y][this.x] === (isPlayerRed ? 2 : 1);
  }

  middlePiece(piece) {
    let newY = piece.y - this.y;
    let newX = piece.x - this.x
    let middleSquareY = this.y + newY / 2;
    let middleSquareX = this.x + newX / 2;

    return [middleSquareY, middleSquareX];
  }

  inRange(piece) {

    if (Math.getDistance(this.x, this.y, piece.x, piece.y) === Math.sqrt(2) && this.isSquareEmpty()) {
      return $(this.element).addClass("legel-move");
    } else if (Math.getDistance(this.x, this.y, piece.x, piece.y) === Math.sqrt(2) * 2 && this.isSquareEmpty()) {
      let difference = this.middlePiece(piece);
      if (gameBoard[difference[0]][difference[1]] === (isPlayerRed ? 2 : 1)) {
        return $(this.element).addClass("legel-move jump");
      }
    }
  };

  checkForJump(square) {
    if (Math.getDistance(this.x, this.y, square[0], square[1]) === Math.sqrt(2) && !$(`#${square[0]}>[data-column=${square[1]}]`).hasClass("piece")) {
      return true;
    }
  }
}

function checkForLegelMoves(currentPiece) {
  let pieceSquareNumber = parseInt($(currentPiece.element).attr("square-number"));
  let index = isPlayerRed ? pieceSquareNumber : 0;
  for (var i = 0; index < squares.length; index++) {
    let blankSquare = squares[index]
    let blankSquareNumber = parseInt($(blankSquare.element).attr("square-number"));
    if (isPlayerRed) {
      if (pieceSquareNumber < blankSquareNumber && !$(blankSquare.element).hasClass(`piece ${isPlayerRed ? "X" : "O"}`)) {
        blankSquare.inRange(currentPiece);
      }
    } else {
      if (pieceSquareNumber > blankSquareNumber && !$(blankSquare.element).hasClass(`piece ${isPlayerRed ? "X" : "O"}`)) {
        blankSquare.inRange(currentPiece);
      }
    }
  }
}

const board = {
  board: gameBoard,

  initalize: function () {
    $('.row').remove();
    $('.square').removeClass("selected").removeAttr("coor");
    let pieceCount = 0;
    let squareCount = 0;
    this.board.forEach(function (row, y) {
      $(".container").append(`<div class="row" id=${y}></div>`)
      // append the row to the board
      row.forEach(function (column, x) {
        // append the square to the row
        $(`#${y}`).append(`<div class="col" data-column=${x}></div>`)
        $(`#${y}>[data-column = ${x}]`).attr("square-number", `${squareCount}`);
        squares[squareCount] = new Square($(`#${y}>[data-column=${x}]`), [y, x])
        squareCount++;
        let xOrO;
        // if the number in the gameBoard array its a 1 insert an X
        if (column === 1) {
          xOrO = "X";
        }
        else if (column === 2) {
          xOrO = "O"
        }
        if (xOrO === "X" || xOrO === "O") {
          $(`div#${y}>[data-column=${x}]`).addClass(`piece ${xOrO}`).attr("piece-num", `${pieceCount}`);
          pieces[pieceCount] = new Piece($(`#${y}>[data-column=${x}]`), [y, x]);
          pieceCount++
        }
      })
    })
    return;
  }

}


function add() {



  $(`.container`).on(`click`, `.piece`, function () {
    let currentPiece = pieces[$(this).attr('piece-num')];
    if (!$(currentPiece.element).hasClass(`${isPlayerRed ? "X" : "O"}`)) return; // if its not the right players move it returns
    unbindClick() // this takes off all the squares with the class of selected and unbinds the onclick
    checkForLegelMoves(currentPiece);// this give a class of diff which turns the color of the piece a different color
    if ($(".jump").length > 0) {
      $(".col").not(".jump").removeClass("legel-move")
    }
    addEventListeners(pieces[$(this).attr('piece-num')]) //this function will display the squares with the legel moves. it passes the the postion of the piece.
  })
}

function unbindClick() {
  return $(`.col`).removeClass(`legel-move`).unbind();
}

function addEventListeners(piece, turn) {
  let row = piece.y;
  let column = piece.x;
  $(".legel-move").on("click", function () {
    var selectedSquare = squares[$(this).attr("square-Number")];
    if ($(selectedSquare.element).hasClass("jump")) {
      var middlePieceYX = selectedSquare.middlePiece(piece);
      gameBoard[selectedSquare.y][selectedSquare.x] = isPlayerRed ? 1 : 2;
      gameBoard[middlePieceYX[0]][middlePieceYX[1]] = 0
      gameBoard[row][column] = 0
      isPlayerRed = isPlayerRed ? false : true;
      board.initalize();
      return
    }
    gameBoard[selectedSquare.y][selectedSquare.x] = isPlayerRed ? 1 : 2;
    gameBoard[row][column] = 0
    isPlayerRed = isPlayerRed ? false : true;
    board.initalize();
  })
}
add()
board.initalize();

