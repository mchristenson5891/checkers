const board = {
  board: null,
  isPlayerRed: true,
  playComputer: false,

  initalize: function () {
    let pieceCount = 0;
    let squareCount = 0;
    this.isPlayerRed = true;
    this.playComputer = false;
    this.board = [
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0]
    ];

    $(".row").remove();
    this.board.forEach((row, y) => {
      $(".container").append(`<div class="row" id=${y}></div>`)
      row.forEach((column, x) => {
        $(`#${y}`).append(`<div class="col" data-column=${x} square-number=${squareCount++}></div>`);
        this.board[y][x] = new Square($(`#${y}>[data-column=${x}]`), [y, x]);
        let xOrO = this.oneOrTwo(column);
        if (xOrO === "X" || xOrO === "O") {
          $(`div#${y}>[data-column=${x}]`).addClass(`piece ${xOrO}`).attr("piece-num", `${pieceCount++}`);
          this.board[y][x] = new Piece($(`#${y}>[data-column=${x}]`), [y, x], xOrO);
        }
      });
    });
    showOverlay();
    return findMoves()
  },

  oneOrTwo: function (num) {
    if (num === 0) return
    return num === 1 ? "X" : "O"
  },

  update: function () {
    this.board.forEach((row) => {
      row.forEach((element) => {
        if (element instanceof Piece) {
          if (element.canJump) {
            $(element.element).addClass("can-jump");
          } else if (element.hasMove) {
            element.element.addClass("move");
          }
        }
      })
    })
    if ($(".can-jump").length > 0) {
      $(".move").removeClass("move");
    }
    if (checkForWin()) return;
    addClickToPieces();
    if (!board.isPlayerRed && this.playComputer) {
      setTimeout("computerMove()", 2000);
    }
    return;
  },

  activateSquare: function (piece) {
    piece.moves.forEach((ele) => {
      if (ele.isAJump) {
        $(ele.element).addClass("legal-move jump");
      } else {
        $(ele.element).addClass("legal-move");
      }
    })
    if ($(".jump").length > 0) {
      $(".col").not(".jump").removeClass("legal-move");
    }
  },

  clearMoves: function () {
    this.board.forEach((row) => {
      row.forEach((element) => {
        if (element instanceof Piece) {
          element.moves = [];
          element.canJump = false;
          element.hasMove = false
        } else {
          element.isAJump = false;
        }
      })
    })
  }
}

class Piece {
  constructor(element, position, player) {
    this.element = element,
      this.x = position[1],
      this.y = position[0],
      this.player = player,
      this.isKing = false,
      this.canJump = false,
      this.hasMove = false,
      this.moves = [];
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
      this.y = position[0],
      this.isAJump = false;
  }

  isSquareEmpty() {
    return board.board[this.y][this.x] instanceof Square;
  }

  isOpponentPiece() {
    return board.board[this.y][this.x] === (board.isPlayerRed ? 2 : 1);
  }

  middlePiece(piece) {
    return board.board[this.y + (piece.y - this.y) / 2][this.x + (piece.x - this.x) / 2];
  }

  inRange(piece) {
    if (isDiagonalSquareEmpty(this, piece)) {
      piece.moves.push(this);
      piece.hasMove = true;
    } else if (isNextSpaceEmpty(this, piece) && this.middlePiece(piece).player && this.middlePiece(piece).player !== piece.player) {
      this.isAJump = true;
      piece.canJump = true;
      return piece.moves.push(this);
    }
  }
}

function isDiagonalSquareEmpty(square, piece) {
  return Math.getDistance(square.x, square.y, piece.x, piece.y) === Math.sqrt(2);
}

function isNextSpaceEmpty(square, piece) {
  return Math.getDistance(square.x, square.y, piece.x, piece.y) === Math.sqrt(2) * 2;
}



Math.getDistance = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function hideOverlay() {
  $("#overlay").hide();
  $("#play-computer").hide();
  $("#two-player").hide();
  return;
}

function showOverlay() {
  $("#overlay").show();
  $("#play-computer").show();
  $("#two-player").show();
  $("#play-again").hide();
  $("#message-box>h3").remove();
  return;
}

function checkForLegelMoves(currentPiece) {
  let pieceSquareNumber = parseInt($(currentPiece.element).attr("square-number"));
  board.board.forEach((row, y) => {
    row.forEach((element) => {
      if (element instanceof Square) {
        let square = element;
        let squareNumber = parseInt($(square.element).attr("square-number"));
        if (currentPiece.isKing) {
          square.inRange(currentPiece);
        } else if (currentPiece.player === "X") {
          if (pieceSquareNumber > squareNumber) {
            square.inRange(currentPiece);
          }
        } else {
          if (pieceSquareNumber < squareNumber) {
            square.inRange(currentPiece);
          }
        }
      }
    })
  })
}

function getElement(piece) {
  return board.board[$(piece).parent().attr("id")][$(piece).attr("data-column")];
}

function addClickToPieces() {
  var pieces = $(".can-jump").length > 0 ? ".can-jump" : ".move";
  $(pieces).on(`click`, function () {
    let currentPiece = getElement(this);
    removeLegelMove();
    board.activateSquare(currentPiece);
    addEventListeners(currentPiece);
  })
}

function isThereAJump() {
  let isItAJump = false;
  board.board.forEach((row) => {
    row.forEach((element) => {
      element instanceof Square && element.isAJump ? isItAJump = true : null;
    })
  })
  return isItAJump;
}

function removeLegelMove() {
  return $(".legal-move").unbind().removeClass("legal-move jump");
}

function removePiecesClick() {
  return $(".col").unbind().removeClass("turn can-jump move");
}

function takeMiddlePiece(selectedSquare, piece) {
  return updateToSpace(selectedSquare.middlePiece(piece));
}

function updateToSpace(piece) {
  return board.board[piece.y][piece.x] = new Square(piece.element, [piece.y, piece.x], piece.player);
}

function updateToPiece(piece, selectedSquare) {
  let newPiece = $(`#${selectedSquare.y}>[data-column=${selectedSquare.x}]`)
    .addClass(`${board.isPlayerRed ? "X" : "O"} piece`)
    .attr("piece-num", $(selectedSquare.element).attr("piece-num"));
  piece.element = newPiece;
  piece.y = selectedSquare.y;
  piece.x = selectedSquare.x;
  piece.moves = [];
  if (piece.isKing) {
    $(piece.element).addClass("king");
  }
  return board.board[selectedSquare.y][selectedSquare.x] = piece
}

function addEventListeners(piece) {
  $(".legal-move").on("click", function () {
    let selectedSquare = getElement(this);
    if (selectedSquare.isAJump) {
      takeMiddlePiece(selectedSquare, piece); removePiecesClick();
      updateToSpace(piece);
      updateToPiece(piece, selectedSquare);
      removeLegelMove();
      board.clearMoves();
      checkForLegelMoves(piece);
      if (isThereAJump()) {
        board.activateSquare(piece)
        addEventListeners(piece)
        if (!board.isPlayerRed) {
          return setTimeout("computerMove()", 500);
        }
      }
    }
    updateToSpace(piece);
    updateToPiece(piece, selectedSquare);
    makeKing(selectedSquare, piece);
    removePiecesClick();
    removeLegelMove();
    board.isPlayerRed = board.isPlayerRed ? false : true;
    board.clearMoves();
    findMoves();
  })
}

function makeKing(selectedSquare, piece) {
  if (selectedSquare.y === 7 || selectedSquare.y === 0) {
    piece.isKing = true;
    $(piece.element).addClass("king");
  }
}


function findMoves() {
  board.board.forEach((row) => {
    row.forEach((element) => {
      removeLegelMove();
      if (element instanceof Piece && element.player === (board.isPlayerRed ? "X" : "O")) {
        checkForLegelMoves(element);
      }
    })
  })
  board.update();
}

function computerMove() {
  let pieces = $(".can-jump").length > 0 ? ".can-jump" : ".move";
  let randomPieceNumber = getRandomInt(0, $(pieces).length - 1);
  $($(pieces)[randomPieceNumber]).click();
  let randomLegelMoveNumber = getRandomInt(0, $(".legal-move").length - 1);

  $($(".legal-move")[randomLegelMoveNumber]).click();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkForWin() {
  if ($(".X").length === 0) {
    $("#play-again").show();
    $("#overlay").show();
    $("#message-box").append("<h3>O WINS!</h3>")
    return true
  } else if ($(".O").length === 0) {
    $("#play-again").show();
    $("#overlay").show();
    $("#message-box").append("<h3>X WINS!</h3>")
    return true
  }
  return false;
}

$("#play-computer").on("click", () => {
  board.playComputer = true;
  hideOverlay();
})

$("#two-player").on("click", () => {
  board.playComputer = false;
  hideOverlay();
})

$("#play-again").on("click", () => {
  board.initalize();
})

$("#demo").on("click", () => {
  demoJump ? demoJump = false : demoJump = true;
  board.initalize();
})

board.initalize();

