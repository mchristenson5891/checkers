var gameBoard = [ 
  [  0,  1,  0,  1,  0,  1,  0,  1 ],
  [  1,  0,  1,  0,  1,  0,  1,  0 ],
  [  0,  1,  0,  1,  0,  1,  0,  1 ],
  [  0,  0,  1,  0,  0,  0,  0,  0 ],
  [  0,  0,  0,  0,  0,  0,  0,  0 ],
  [  2,  0,  2,  0,  2,  0,  2,  0 ],
  [  0,  2,  0,  2,  0,  2,  0,  2 ],
  [  2,  0,  2,  0,  2,  0,  2,  0 ]
];

const pieces = [];
let isPlayerRed = true;

class Piece {
  constructor(element, position) {
    this.element = element
    this.position = position
  }



}


const board = {
  board: gameBoard,

  initalize: function() {
    $('.row').remove();
    $('.square').removeClass("selected").removeAttr("coor");

    let count = 0;
    this.board.forEach(function(row,index) {
      $(".container").append(`<div class="row" id=${index}></div>`)
      // append the row to the board
        row.forEach(function(column, colInx) {
          // append the square to the row
          $(`#${index}`).append(`<div class="col" data-type=${colInx}></div>`);
          let xOrO;
          // if the number in the gameBoard array its a 1 insert an X
          if(column === 1) {
            xOrO = "X";
          }
          else if(column === 2){
            xOrO = "O"
          }
          if(xOrO === "X" || xOrO ==="O") {
            $(`div#${index}>[data-type=${colInx}]`).addClass(`piece ${xOrO}`).attr("piece-num", `${count}`).text(xOrO);
            pieces[count] = new Piece($(`#${index}>[data-type=${colInx}]`),[index, colInx])
            count++
          }
        })
    })
    return;
  }

}


function add () {

  $(`.container`).on(`click`, `.piece`, function() {
    let xOrO = isPlayerRed ? "X" : "O";
    $(`.col`).removeClass(`selected`).unbind();
    if($(this).hasClass(`${xOrO}`)) {
      checkLegalMove(pieces[$(this).attr('piece-num')].position)
    }
  })
}

function checkLegalMove(positions) {
  var [row, column] = positions;
  console.log(row,column)

  var newRow = isPlayerRed ? row + 1 : row - 1;
  var newMove1 = column + 1;
  var newMove2 = column - 1;
  console.log(`old row: ${row} -- new ${newRow} -- n1= ${newMove1} n2=${newMove2} --- old ${column}`)
  if(gameBoard[newRow][newMove1] === 0) {
    $(`#${newRow}>[data-type=${newMove1}]`).addClass("selected").attr("coor", `${newRow} ${newMove1}`)
  }if (gameBoard[newRow][newMove2] === 0) {
    $(`#${newRow}>[data-type=${newMove2}]`).addClass("selected").attr("coor", `${newRow} ${newMove2}`)
  }

  $(".selected").on("click", function() {
    var t = $(this).attr("coor");
    var pieceCoor = t.split(" ");
    gameBoard[parseInt(pieceCoor[0])][parseInt(pieceCoor[1])] = isPlayerRed ? 1 : 2;
    gameBoard[row][column] = 0
    isPlayerRed = isPlayerRed ? false : true;
    board.initalize();
  })
}


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
 
