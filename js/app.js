// $(function(){
$(".btn").on("click", function() {
  playComputer = true
  $(this).css({display: "none"})
})

let playComputer = false;

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
      this.isKing = false,
      this.canJump = false,
      this.hasMove = false
  }

  makeMove() {
    this.hasMove = this.hasMove ? false : true;
  }

  makeJump() {
    this.canJump = this.canJump ? false : true;
  }

}

class Square {
  constructor(element, position) {
    this.element = $(element).removeClass("O X piece king"),
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
    return [this.y + (piece.y - this.y) / 2, this.x + (piece.x - this.x) / 2];
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
    return findMoves()
  },

  update: function () {
    gameBoard.forEach((row, y) => {
      row.forEach((column, x) => {
        if (column instanceof Piece) {
          if (column.canJump) {
            $(column.element).addClass("can-jump")
          } else if (column.hasMove) {
            column.element.addClass("move")
          }
        }
      })
    })
    if ($(".can-jump").length > 0) {
      $(".move").removeClass("move")
    }
    addClickToPieces();
    if (!isPlayerRed && playComputer) {
      setTimeout("computerMove()", 2000)
    } else {
      return;
    }

  }
}

function addClickToPieces() {
  var pieces = $(".can-jump").length > 0 ? ".can-jump" : ".move";
  $(pieces).on(`click`, function () {
    let currentPiece = getElement(this)
    removeLegelMove()
    checkForLegelMoves(currentPiece);
    if (isThereAJump()) {
      $(".col").not(".jump").removeClass("legel-move")
    }
    addEventListeners(currentPiece)
  })
}

function isThereAJump() {
  return ($(".jump").length > 0)
}

function removeLegelMove() {
  return $(`.legel-move`).unbind().removeClass(`legel-move jump`);
}

function removePiecesClick() {
  return $(`.col`).unbind().removeClass("turn can-jump move");
}

function jump(selectedSquare, piece) {
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
  if (piece.isKing) {
    $(piece.element).addClass("king")
  }
  return gameBoard[selectedSquare.y][selectedSquare.x] = piece;
}

function addEventListeners(piece) {
  $(".legel-move").on("click", function () {
    let selectedSquare = getElement(this);
    if ($(selectedSquare.element).hasClass("jump")) {
      jump(selectedSquare, piece)
    }

    updateToSpace(piece)
    updateToPiece(piece, selectedSquare)
    if ($(selectedSquare.element).hasClass("jump")) {
      removePiecesClick();
      removeLegelMove();
      checkForLegelMoves(piece)
      if (isThereAJump()) {
        $(".col").not(".jump").removeClass("legel-move")
        addEventListeners(piece)
        if (!isPlayerRed) {
          return setTimeout("computerMove()", 500)
        } else {
          return;
        }

      }
    }
    if (selectedSquare.y === 7 || selectedSquare.y === 0) {
      piece.isKing = true;
      $(piece.element).addClass("king");
    }
    removePiecesClick();
    removeLegelMove();
    isPlayerRed = isPlayerRed ? false : true;
    findMoves();
    checkForWin();
  })
}


function findMoves() {
  gameBoard.forEach((row, y) => {
    row.forEach((column, x) => {
      removeLegelMove()
      if (column instanceof Piece && $(column.element).hasClass(isPlayerRed ? "X" : "O")) {
        checkForLegelMoves(column)
        if (isThereAJump()) {
          column.makeJump();
        }
        else if ($(".legel-move").length > 0) {
          column.makeMove();
        }
      } else if (column instanceof Piece) {
        if (column.canJump) {
          column.makeJump()
        } else if (column.hasMove) {
          column.makeMove();
        }
      }
    })
  })
  board.update();
}

function computerMove() {
  let pieces = $(".can-jump").length > 0 ? ".can-jump" : ".move";
  let randomPieceNumber = getRandomInt(0, $(pieces).length - 1);
  $($(pieces)[randomPieceNumber]).click()
  let randomLegelMoveNumber = getRandomInt(0, $(".legel-move").length - 1);

  $($(".legel-move")[randomLegelMoveNumber]).click();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkForWin() {
  if ($(".X").length === 0) {
    alert("O WINS!");
  } else if ($(".O").length === 0) {
    alert("X WINS!")
  }
  return;
}





board.initalize();

// })
