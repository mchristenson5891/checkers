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
let isPlayerRed = true;

Math.getDistance = function( x1, y1, x2, y2 ) {
  return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
};

class Piece {
  constructor(element, position) {
    this.element = element,
    this.position = position,
    this.x = position[0],
    this.y = position[1]

  }
}

class Square {
  constructor(element,position) {
    this.element = element,
    this.x = position[0], 
    this.y =position[1]
  }



  inRange (piece, diffPostions) {
    if(Math.getDistance(this.x, this.y, piece.x, piece.y) === Math.sqrt(2)) {
      $(this.element).addClass("legel-move");
    }
  };

  checkForJump () {
    console.log(this)
  }
}



function checkForLegelMoves(currentSquare, currentPiece) {
  console.log(currentPiece, currentSquare)
  let pieceSquareNumber = parseInt($(currentSquare).attr("square-number"));
  for (let index = 0; index < squares.length; index++) {
    let blankSquare = squares[index]

    // if(blankSquare.x === diffX && blankSquare.y === diffY) {
    //   blankSquare.element.addClass("legel-move")
    // }

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
            $(`div#${index}>[data-type=${colInx}]`).addClass(`piece ${xOrO}`).attr("piece-num", `${pieceCount}`).text(xOrO);
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
    $(`.piece`).removeClass("diff"); // takes of the color of the piece selected
    $(this).addClass("diff");

    checkForLegelMoves($(this), currentPiece);// this give a class of diff which turns the color of the piece a different color
    addEventListeners(pieces[$(this).attr('piece-num')]) //this function will display the squares with the legel moves. it passes the the postion of the piece.
  })
}

function addEventListeners(positions, turn) {

  let [row, column] = positions.position; // destructuring the arr 


  $(".legel-move").on("click", function() {
    var selectedSquare = squares[$(this).attr("square-Number")];
    gameBoard[selectedSquare.x][selectedSquare.y] = isPlayerRed ? 1 : 2;
    gameBoard[row][column] = 0
    isPlayerRed = isPlayerRed ? false : true;
    board.initalize();
  })


}

 //find what the displacement is
      // var dx = newPosition[1] - this.position[1];
      // var dy = newPosition[0] - this.position[0];
      // this.canJumpAny = function () {
      //   if(this.canOpponentJump([this.position[0]+2, this.position[1]+2]) ||
      //      this.canOpponentJump([this.position[0]+2, this.position[1]-2]) ||
      //      this.canOpponentJump([this.position[0]-2, this.position[1]+2]) ||
      //      this.canOpponentJump([this.position[0]-2, this.position[1]-2])) {
      //     return true;
      //   } return false;
      // };
      

add()


// function seePiece(event) {
//   if($(event.target).hasClass("piece")){
//     let row = parseInt($(event.target).parent().attr("id"));
//     let column = parseInt($(event.target).attr("data-type"));
//     movePiece(row, column,event)
//   }
// }

// function movePiece(row,column,event) {
//   let moves;
//   currentRow = column;
//   if(board.turn === 1) {
//     if(gameBoard[row+1][column+1] === 0) {
//       $(`div#${row+1} > div[data-type = ${column+1}]`).addClass(`selected`)
//     }
//     if(gameBoard[row+1][column-1] === 0) {
//       $(`div#${row+1} > div[data-type = ${column-1}]`).addClass(`selected`)
//     }
//   }else {
//     if(gameBoard[row-1][column-1] === 0) {
//       $(`div#${row-1} > div[data-type = ${column+1}]`).addClass(`selected`)
//     }
//     if(gameBoard[row-1][column+1] === 0) {
//       $(`div#${row-1} > div[data-type = ${column-1}]`).addClass(`selected`)
//     }
//   }


//   $(`.selected`).on(`click`, function() {
//   let checkersRow = row;
//   let column = currentRow
//   gameBoard[checkersRow][column] = 0;
//    let row1 = parseInt($(this).parent().attr("id"));
//    let column1 = parseInt($(this).attr("data-type"));
//     gameBoard[row1][column1] = board.turn;
//     board.initalize();
//   })

//   }

//   $('.container').on("click", Piece.handleClick)


board.initalize();
 
