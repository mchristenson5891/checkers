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
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    $(".row").remove();
    this.board.forEach((row, y) => {
      $(".container").append(`<div class="row" id=${y}></div>`)
      row.forEach((column, x) => {
        $(`#${y}`).append(`<div class="col" data-column=${x}></div>`);
        $(`#${y}>[data-column = ${x}]`).attr("square-number", `${squareCount}`);
        this.board[y][x] = new Square($(`#${y}>[data-column=${x}]`), [y, x]);
        squareCount++;
        let xOrO;
        if (column === 1) {
          xOrO = "X";
        }
        else if (column === 2) {
          xOrO = "O";
        }
        if (xOrO === "X" || xOrO === "O") {
          $(`div#${y}>[data-column=${x}]`).addClass(`piece ${xOrO}`).attr("piece-num", `${pieceCount}`);
          this.board[y][x] = new Piece($(`#${y}>[data-column=${x}]`), [y, x]);
          pieceCount++;
        }
      });
    });
    showOverlay();
    return findMoves()
  },

  update: function () {
    this.board.forEach((row, y) => {
      row.forEach((column, x) => {
        if (column instanceof Piece) {
          if (column.canJump) {
            $(column.element).addClass("can-jump");
          } else if (column.hasMove) {
            column.element.addClass("move");
          }
        }
      })
    })
    if ($(".can-jump").length > 0) {
      $(".move").removeClass("move");
    }
    if(checkForWin()) return;
    addClickToPieces();
    if (!board.isPlayerRed && this.playComputer) {
      setTimeout("computerMove()", 2000);
    }
    return;
  },

  activateSquare: function (piece) {
    piece.moves.forEach((ele) => {
      if (ele.isAJump) {
        return $(ele.element).addClass("legal-move jump");
      } else {
        return $(ele.element).addClass("legal-move");
      }
    })
  },

  clearMoves: function () {
    this.board.forEach((row) => {
      row.forEach((column) => {
        if (column instanceof Piece) {
          column.moves = [];
        } else {
          column.isAJump = false;
        }
      })
    })
  }
}

class Piece {
  constructor(element, position) {
    this.element = element,
      this.x = position[1],
      this.y = position[0],
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
    return [this.y + (piece.y - this.y) / 2, this.x + (piece.x - this.x) / 2];
  }

  inRange(piece) {
    if (Math.getDistance(this.x, this.y, piece.x, piece.y) === Math.sqrt(2) && this.isSquareEmpty()) {
      piece.moves.push(this);
      return $(this.element).addClass("legal-move");
    } else if (Math.getDistance(this.x, this.y, piece.x, piece.y) === Math.sqrt(2) * 2 && this.isSquareEmpty()) {
      let difference = this.middlePiece(piece);
      if ($(board.board[difference[0]][difference[1]].element).hasClass(board.isPlayerRed ? "O" : "X")) {
        $(this.element).addClass("legal-move jump");
        this.isAJump = true;
        return piece.moves.push(this);
      }
    }
  }
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
    row.forEach((column, x) => {
      if (board.board[y][x] instanceof Square) {
        let square = board.board[y][x];
        let squareNumber = parseInt($(square.element).attr("square-number"));
        if (currentPiece.isKing) {
          square.inRange(currentPiece);
        } else if (board.isPlayerRed) {
          if (pieceSquareNumber < squareNumber && !$(square.element).hasClass(`piece ${board.isPlayerRed ? "X" : "O"}`)) {
            square.inRange(currentPiece);
          }
        } else {
          if (pieceSquareNumber > squareNumber && !$(square.element).hasClass(`piece ${board.isPlayerRed ? "X" : "O"}`)) {
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
    if (isThereAJump()) {
      $(".col").not(".jump").removeClass("legal-move");
    }
    addEventListeners(currentPiece);
  })
}

function isThereAJump() {
  return ($(".jump").length > 0);
}

function removeLegelMove() {
  return $(".legal-move").unbind().removeClass("legal-move jump");
}

function removePiecesClick() {
  return $(".col").unbind().removeClass("turn can-jump move");
}

function jump(selectedSquare, piece) {
  let middlePiece = board.board[selectedSquare.middlePiece(piece)[0]][selectedSquare.middlePiece(piece)[1]];
  updateToSpace(middlePiece);
  return;
}

function updateToSpace(piece) {
  return board.board[piece.y][piece.x] = new Square(piece.element, [piece.y, piece.x]);
}

function updateToPiece(piece, selectedSquare) {
  let newPiece = $(`#${selectedSquare.y}>[data-column=${selectedSquare.x}]`)
    .addClass(`${board.isPlayerRed ? "X" : "O"} piece`)
    .attr("piece-num", $(selectedSquare.element).attr("piece-num"));
  piece.element = newPiece;
  piece.y = selectedSquare.y;
  piece.x = selectedSquare.x;
  if (piece.isKing) {
    $(piece.element).addClass("king");
  }
  return board.board[selectedSquare.y][selectedSquare.x] = piece;
}

function addEventListeners(piece) {
  $(".legal-move").on("click", function () {
    let selectedSquare = getElement(this);
    if ($(selectedSquare.element).hasClass("jump")) {
      jump(selectedSquare, piece);
    }

    updateToSpace(piece);
    updateToPiece(piece, selectedSquare);
    if ($(selectedSquare.element).hasClass("jump")) {
      removePiecesClick();
      removeLegelMove();
      checkForLegelMoves(piece);
      if (isThereAJump()) {
        $(".col").not(".jump").removeClass("legal-move")
        addEventListeners(piece);
        if (!board.isPlayerRed) {
          return setTimeout("computerMove()", 500);
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
    board.isPlayerRed = board.isPlayerRed ? false : true;
    board.clearMoves();
    findMoves();
  })
}


function findMoves() {
  board.board.forEach((row, y) => {
    row.forEach((column, x) => {
      removeLegelMove();
      if (column instanceof Piece && $(column.element).hasClass(board.isPlayerRed ? "X" : "O")) {
        checkForLegelMoves(column);
        if (isThereAJump()) {
          column.makeJump();
        }
        else if ($(".legal-move").length > 0) {
          column.makeMove();
        }
      } else if (column instanceof Piece) {
        if (column.canJump) {
          column.makeJump();
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
  $($(pieces)[randomPieceNumber]).click();
  let randomLegelMoveNumber = getRandomInt(0, $(".legal-move").length - 1);

  $($(".legal-move")[randomLegelMoveNumber]).click();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkForWin() {
  if ($(".X").length === 0) {
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

board.initalize();

