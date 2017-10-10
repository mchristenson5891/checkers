// $(function(){
let gameBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0]
];
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
    this.isKing = true;
  }
}

class Square {
  constructor(element, position) {
    this.element = $(element).removeClass("O X piece"),
      this.x = position[1],
      this.y = position[0]
  }

  isSquareEmpty() {
    return gameBoard[this.y][this.x] instanceof Square;
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
      if ($(gameBoard[difference[0]][difference[1]].element).hasClass(isPlayerRed ? "O" : "X")) {
        return $(this.element).addClass("legel-move jump");
      }
    }
  }
}
function checkForLegelMoves(currentPiece) {
  let pieceSquareNumber = parseInt($(currentPiece.element).attr("square-number"));

  gameBoard.forEach((row, y) => {
    row.forEach((column, x) => {
      if (gameBoard[y][x] instanceof Square) {
        let square = gameBoard[y][x];
        let squareNumber = parseInt($(square.element).attr("square-number"))
        if (currentPiece.isKing) {
          square.inRange(currentPiece)
        } else if (isPlayerRed) {
          if (pieceSquareNumber < squareNumber && !$(square.element).hasClass(`piece ${isPlayerRed ? "X" : "O"}`)) {
            square.inRange(currentPiece)
          }
        } else {
          if (pieceSquareNumber > squareNumber && !$(square.element).hasClass(`piece ${isPlayerRed ? "X" : "O"}`)) {
            square.inRange(currentPiece);
          }
        }
      }
    })
  })
}

function getElement(piece) {
  return gameBoard[$(piece).parent().attr("id")][$(piece).attr("data-column")];
}

const board = {
  board: gameBoard,

  initalize: function () {
    let pieceCount = 0;
    let squareCount = 0;
    this.board.forEach((row, y) => {
      $(".container").append(`<div class="row" id=${y}></div>`)
      row.forEach((column, x) => {
        $(`#${y}`).append(`<div class="col" data-column=${x}></div>`)
        $(`#${y}>[data-column = ${x}]`).attr("square-number", `${squareCount}`);
        gameBoard[y][x] = new Square($(`#${y}>[data-column=${x}]`), [y, x])
        squareCount++;
        let xOrO;
        if (column === 1) {
          xOrO = "X";
        }
        else if (column === 2) {
          xOrO = "O"
        }
        if (xOrO === "X" || xOrO === "O") {
          $(`div#${y}>[data-column=${x}]`).addClass(`piece ${xOrO}`).attr("piece-num", `${pieceCount}`);
          gameBoard[y][x] = new Piece($(`#${y}>[data-column=${x}]`), [y, x]);
          pieceCount++
        }
      })
    })
    return addClickToPieces()
  },
}

function addClickToPieces() {
  $(`.piece.${isPlayerRed ? "X" : "O"}`).on(`click`, function () {
    let currentPiece = getElement(this)
    removeLegelMove()
    checkForLegelMoves(currentPiece);
    if (isThereAJump()) {
      $(".col").not(".jump").removeClass("legel-move")
    }
    addEventListeners(currentPiece)
  }).addClass("turn")
}

function isThereAJump() {
  return ($(".jump").length > 0)
}

function removeLegelMove() {
  return $(`.legel-move`).unbind().removeClass(`legel-move jump`);
}

function removePiecesClick() {
  return $(`.col`).unbind().removeClass("turn");
}

function jump(selectedSquare,piece) {
  let middlePiece = gameBoard[selectedSquare.middlePiece(piece)[0]][selectedSquare.middlePiece(piece)[1]];
  updateToSpace(middlePiece)
  return;
}

function updateToSpace(piece) {
  return gameBoard[piece.y][piece.x] = new Square(piece.element, [piece.y, piece.x])
}

function updateToPiece(piece, selectedSquare) {
  let newPiece = $(`#${selectedSquare.y}>[data-column=${selectedSquare.x}]`)
    .addClass(`${isPlayerRed ? "X" : "O"} piece`)
    .attr("piece-num", $(selectedSquare.element).attr("piece-num"))
  piece.element = newPiece;
  piece.y = selectedSquare.y;
  piece.x = selectedSquare.x;
  return gameBoard[selectedSquare.y][selectedSquare.x]= piece;
}

function addEventListeners(piece) {
  $(".legel-move").on("click", function () {
    let selectedSquare = getElement(this);
    if ($(selectedSquare.element).hasClass("jump")) {
      jump(selectedSquare,piece)
    }
    if (selectedSquare.y === 7 || selectedSquare.y === 0) {
      piece.makeKing();
    }
    updateToSpace(piece)
    updateToPiece(piece, selectedSquare)
    if($(selectedSquare.element).hasClass("jump")) {
      removePiecesClick();
      removeLegelMove();
      checkForLegelMoves(piece)
      if(isThereAJump()) {
        $(".col").not(".jump").removeClass("legel-move")
        return addEventListeners(piece)
      }
    }
    removePiecesClick();
    removeLegelMove();
    isPlayerRed = isPlayerRed ? false : true;
    addClickToPieces();
  })
}
board.initalize();

// })
