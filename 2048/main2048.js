var board = new Array();
var score = 0;
var hasConflicted = new Array();

$(document).ready(function(){
    newgame();
});

function newgame(){
    init();
    
    generateOneNumber();
    generateOneNumber();

}

function init(){
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 4; j++){
      var gridCell = $("#grid-cell-" + i +"-" + j);

      //计算定位坐标值
      gridCell.css('top', getPosTop(i, j));
      gridCell.css('left', getPosLeft(i, j));

    }
    for (var i=0; i<4; i++){
      board[i] = new Array();
      hasConflicted[i] = new Array();
      for (var j=0; j<4; j++){
        board[i][j] = 0;
        hasConflicted[i][j] = false;
      }
    }
    score = 0;
    updateBoardView();

}

function updateBoardView(){
  $(".number-cell").remove();
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 4; j++){
      $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j+'"></div>');
      var theNumberCell = $('#number-cell-' + i + '-' + j);

      if (board[i][j] == 0){
        theNumberCell.css('width', '0px');
        theNumberCell.css('height', '0px');
        theNumberCell.css('top', getPosTop(i, j) + 50);
        theNumberCell.css('left', getPosLeft(i, j) + 50);
      }
      else{
        theNumberCell.css('width', '100px');
        theNumberCell.css('height', '100px');
        theNumberCell.css('top', getPosTop(i, j));
        theNumberCell.css('left', getPosLeft(i, j));
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color', getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
      }
      hasConflicted[i][j] = false;
    } 

}

function generateOneNumber(){
  if(nospace(board))  
    return false;

  //随机位置
  var randx = parseInt( Math.floor(Math.random() *4));
  var randy = parseInt( Math.floor(Math.random() *4));
  //尝试随机生成位置，超过50次手动找
  var times = 0;
  while ( s < 50 ){
    if(board[randx][randy] == 0)
      break;
    randx = parseInt( Math.floor(Math.random() *4));
    randy = parseInt( Math.floor(Math.random() *4));
    times++;
  }

  if (times == 50){
    for (var i=0; i<4; i++)
      for (var j=0; j<4; j++)
        if (board[i][j] == 0){
          randx = i;
          randy = j;
        }

  }

  //随机数字
  var randNumber = Math.random() < 0.5 ? 2:4;

  //显示
  board[randx][randy] = randNumber;
  showNumberWithAnimation(randx, randy, randNumber);

  return true;
}

$(document).keydown( function(event){
  switch(event.keyCode){
    case 37://left
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    case 38://up
    if (moveUp()) {
      setTimeout("generateOneNumber()", 210);
      setTimeout("isGameOver()", 300);
      }
      break;
    case 39://right
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    case 40://down
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isGameOver()", 300);
      }
      break;
    default:
      break;
  }

});

function isGameOver(){
  if ( nospace(board) && noMove(board))
    gameOver();
}

function gameOver(){
  alert("GameOver!");
}

function moveLeft(){
  if (!canMoveLeft(board))
    return false;
  for (var i=0; i < 4; i++)
    for (var j=1; j < 4; j++)
    if (board[i][j] !=0){

      for (var k=0; k < j; k++)
        if (board[i][k] == 0 && noBlockHorizontal(i, k, j)){
          //move
          showMoveAnimation(i, j, i, k);
          board[i][k] = board[i][j];
          board[i][j] = 0;
          continue;
        }
        else if(board[i][j] == board[i][k] && noBlockHorizontal(i, k, j) && !hasConflicted[i][k]){
          //move
          showMoveAnimation(i, j, i, k);
          //add
          board[i][k] += board[i][j];
          board[i][j] = 0;
          //add score
          score+=board[i][k];
          updateScore(score);
          
          //crash
          hasConflicted[i][k] = true;
          continue;
        }

    }

  setTimeout("updateBoardView()", 200);
  return true;
}

function moveUp(){
  if (!canMoveUp(board))
    return false;
  for (var j=0; j < 4; j++)
    for (var i=1; i < 4; i++)
    if (board[i][j] !=0){

      for (var k=0; k < i; k++)
        if (board[k][j] == 0 && noBlockVertical(k, i, j)){
          //move
          showMoveAnimation(i, j, k, j);
          board[k][j] = board[i][j];
          board[i][j] = 0;
          continue;
        }
        else if(board[i][j] == board[k][j] && noBlockVertical(k, i, j) && !hasConflicted[i][k]){
          //move
          showMoveAnimation(i, j, k, j);
          //add
          board[k][j] += board[i][j];
          board[i][j] = 0;
          //add score
          score+=board[i][k];
          updateScore(score);
          
          //crash
          hasConflicted[i][k] = true;
          continue;
        }

    }

  setTimeout("updateBoardView()", 200);
  return true;
}


function moveRight(){
  if (!canMoveRight(board))
    return false;
  for (var i=0; i < 4; i++)
    for (var j=2; j >=0; j--)
    if (board[i][j] !=0){

      for (var k=3; k > j; k--)
        if (board[i][k] == 0 && noBlockHorizontal(i, j, k)){
          //move
          showMoveAnimation(i, j, i, k);
          board[i][k] = board[i][j];
          board[i][j] = 0;
          continue;
        }
        else if(board[i][j] == board[i][k] && noBlockHorizontal(i, j, k) && !hasConflicted[i][k]){
          //move
          showMoveAnimation(i, j, i, k);
          //add
          board[i][k] += board[i][j];
          board[i][j] = 0;
          //add score
          score+=board[i][k];
          updateScore(score);
                    
          //crash
          hasConflicted[i][k] = true;
          continue;
        }

    }

  setTimeout("updateBoardView()", 200);
  return true;
}

function moveDown(){
  if (!canMoveDown(board))
    return false;
  for (var j=0; j < 4; j++)
    for (var i=2; i >=0; i--)
    if (board[i][j] !=0){

      for (var k=3; k >i; k--)
        if (board[k][j] == 0 && noBlockVertical(i, k, j)){
          //move
          showMoveAnimation(i, j, k, j);
          board[k][j] = board[i][j];
          board[i][j] = 0;
          continue;
        }
        else if(board[i][j] == board[k][j] && noBlockVertical(i, k, j) && !hasConflicted[i][k]){
          //move
          showMoveAnimation(i, j, k, j);
          //add
          board[k][j] += board[i][j];
          board[i][j] = 0;
          //add score
          score+=board[i][k];
          updateScore(score);
          
          //crash
          hasConflicted[i][k] = true;
          continue;
        }

    }

  setTimeout("updateBoardView()", 200);
  return true;
}