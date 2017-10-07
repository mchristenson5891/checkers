var gameBoard = [ 
  [  0,  1,  0,  1,  0,  1,  0,  1 ],
  [  1,  0,  1,  0,  1,  0,  1,  0 ],
  [  0,  1,  0,  1,  0,  1,  0,  1 ],
  [  0,  0,  0,  0,  0,  0,  0,  0 ],
  [  0,  0,  0,  0,  0,  0,  0,  0 ],
  [  2,  0,  2,  0,  2,  0,  2,  0 ],
  [  0,  2,  0,  2,  0,  2,  0,  2 ],
  [  2,  0,  2,  0,  2,  0,  2,  0 ]
];

const pieces = [];
const squares = [];
let isPlayerRed = false;

Math.getDistance = function( x1, y1, x2, y2 ) {
  return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
};

class Piece {
  constructor(element, position) {
    this.element = element,
    // this.position = position,
    this.x = position[0],
    this.y = position[1],
    this.isKing = false
  }

  makeKing() {
    this.king = true;
  }
}

class Square {
  constructor(element,position) {
    this.element = element,
    this.x = position[0], 
    this.y =position[1]
  }

  inRange (piece, diffPostions) {
    if(Math.getDistance(this.x, this.y, piece.x, piece.y) === Math.sqrt(2) && gameBoard[this.x][this.y] === (isPlayerRed ? 2 : 1)) {
      let diff;
      if(isPlayerRed) {
        if(piece.y > this.y) {
          diff = [this.x+1, this.y-1]
        }else {
          diff = [this.x+1, this.y+1]
        }
      }else {
        if(piece.y > this.y) {
          diff = [this.x-1, this.y-1]
        }else {
          diff = [this.x-1, this.y+1]
        }
      }

      if(this.checkForJump(diff)) {
        $(`#${diff[0]}>[data-type=${diff[1]}]`).addClass("legel-move jump");
      }
    }else if (Math.getDistance(this.x, this.y, piece.x, piece.y) === Math.sqrt(2) && !$(this.element).hasClass("piece")) {
      $(this.element).addClass("legel-move");
    }
  };

  checkForJump (diff) {
    if(Math.getDistance(this.x, this.y, diff[0], diff[1]) === Math.sqrt(2) && !$(`#${diff[0]}>[data-type=${diff[1]}]`).hasClass("piece")){
      return true;
    }
  }
}



function checkForLegelMoves(currentSquare, currentPiece) {
  console.log(currentPiece, currentSquare)
  let pieceSquareNumber = parseInt($(currentSquare).attr("square-number"));
  for (let index = 0; index < squares.length; index++) {
    let blankSquare = squares[index]
    let blankSquareNumber = parseInt($(blankSquare.element).attr("square-number"));
    let distance = Math.getDistance(currentPiece.x, currentPiece.y, blankSquare.x, blankSquare.y);
    if(isPlayerRed) {
      if(pieceSquareNumber < blankSquareNumber && !$(blankSquare.element).hasClass(`piece ${isPlayerRed ? "X" : "O" }`)){
        blankSquare.inRange(currentPiece);
      }
    }else {
      if(pieceSquareNumber > blankSquareNumber && !$(blankSquare.element).hasClass(`piece ${isPlayerRed ? "X" : "O" }`)){
        blankSquare.inRange(currentPiece);
      }
    }
  }
}

const board = {
  board: gameBoard,

  initalize: function() {
    $('.row').remove();
    $('.square').removeClass("selected").removeAttr("coor");
    let pieceCount = 0;
    let squareCount = 0;
    this.board.forEach(function(row,index) {
      $(".container").append(`<div class="row" id=${index}></div>`)
      // append the row to the board
        row.forEach(function(column, colInx) {
          // append the square to the row
          $(`#${index}`).append(`<div class="col" data-type=${colInx}></div>`)
          $(`#${index}>[data-type = ${colInx}]`).attr("square-number", `${squareCount}`);
          squares[squareCount] = new Square($(`#${index}>[data-type=${colInx}]`),[index, colInx])
          squareCount++;
          let xOrO;
          // if the number in the gameBoard array its a 1 insert an X
          if(column === 1) {
            xOrO = "X";
          }
          else if(column === 2){
            xOrO = "O"
          }
          if(xOrO === "X" || xOrO ==="O") {
            $(`div#${index}>[data-type=${colInx}]`).addClass(`piece ${xOrO}`).attr("piece-num", `${pieceCount}`);
            pieces[pieceCount] = new Piece($(`#${index}>[data-type=${colInx}]`),[index, colInx]);
            pieceCount++
          }
        })
    })
    return;
  }

}


function add () {

  $(`.container`).on(`click`, `.piece`, function() {
    let currentPiece = pieces[$(this).attr('piece-num')];
    if(!$(this).hasClass(`${isPlayerRed ? "X" : "O"}`)) return; // if its not the right players move it returns
    $(`.col`).removeClass(`legel-move`).unbind(); // this takes off all the squares with the class of selected and unbinds the onclick
    checkForLegelMoves($(this), currentPiece);// this give a class of diff which turns the color of the piece a different color
    if($(".jump").length > 0) {
      $(".col").not(".jump").removeClass("legel-move")
    }
    addEventListeners(pieces[$(this).attr('piece-num')]) //this function will display the squares with the legel moves. it passes the the postion of the piece.
  })
}

function addEventListeners(positions, turn) {
  let row = positions.x;
  let column = positions.y;
  $(".legel-move").on("click", function() {
    var selectedSquare = squares[$(this).attr("square-Number")];
    if($(selectedSquare.element).hasClass("jump")) {
      if(!isPlayerRed) {
        if(column < selectedSquare.y) {
          diff = [selectedSquare.x+1, selectedSquare.y-1]
        }else {
          diff = [selectedSquare.x+1, selectedSquare.y+1]
        }
      }else {
        if(column < selectedSquare.y) {
          diff = [selectedSquare.x-1, selectedSquare.y-1]
        }else {
          diff = [selectedSquare.x-1, selectedSquare.y+1]
        }
      }

      gameBoard[selectedSquare.x][selectedSquare.y] = isPlayerRed ? 1 : 2;
      gameBoard[diff[0]][diff[1]] = 0
      gameBoard[row][column] = 0
      isPlayerRed = isPlayerRed ? false : true;
      board.initalize();
      return 
    }
    var selectedSquare = squares[$(this).attr("square-Number")];
    gameBoard[selectedSquare.x][selectedSquare.y] = isPlayerRed ? 1 : 2;
    gameBoard[row][column] = 0
    isPlayerRed = isPlayerRed ? false : true;
    board.initalize();
  })


}


add()
board.initalize();
 
