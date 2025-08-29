let rows = 9;
let columns = 9;
let score = 0;

let candies = ["Blue", "Green", "Orange", "Purple", "Red", "Yellow"];
let board = [];
let currTile;
let otherTile;

window.onload = function () {
    startGame();

    window.setInterval(function () {
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
};

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "Assets/imgs/" + randomCandy() + ".png";

            // Drag events
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // Touch support for mobile
            addTouchSupport(tile);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function addTouchSupport(tile) {
    tile.addEventListener("touchstart", (e) => {
        currTile = e.target;
    });

    tile.addEventListener("touchmove", (e) => {
        e.preventDefault();
        let touch = e.touches[0];
        let target = document.elementFromPoint(touch.clientX, touch.clientY);

        if (target && target.tagName === "IMG") {
            otherTile = target;
        }
    });

    tile.addEventListener("touchend", () => {
        if (currTile && otherTile) {
            swapTiles(currTile, otherTile);
        }
    });
}

// ---------- Drag & Drop Functions ----------
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile && otherTile) {
        swapTiles(currTile, otherTile);
    }
}

// ---------- Swap Logic ----------
function swapTiles(tile1, tile2) {
    if (!tile1 || !tile2) return;

    let coords1 = tile1.id.split("-");
    let r1 = parseInt(coords1[0]);
    let c1 = parseInt(coords1[1]);

    let coords2 = tile2.id.split("-");
    let r2 = parseInt(coords2[0]);
    let c2 = parseInt(coords2[1]);

    let moveLeft = c2 == c1 - 1 && r1 == r2;
    let moveRight = c2 == c1 + 1 && r1 == r2;
    let moveUp = r2 == r1 - 1 && c1 == c2;
    let moveDown = r2 == r1 + 1 && c1 == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = tile1.src;
        let otherImg = tile2.src;
        tile1.src = otherImg;
        tile2.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            // Revert back if no match
            tile1.src = currImg;
            tile2.src = otherImg;
        }
    }
}

// ---------- Crush, Slide, Generate ----------
function crushCandy() {
    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (
                candy1.src === candy2.src &&
                candy2.src === candy3.src &&
                !candy1.src.includes("blank")
            ) {
                candy1.src = "Assets/imgs/blank.png";
                candy2.src = "Assets/imgs/blank.png";
                candy3.src = "Assets/imgs/blank.png";
                score += 30;
                document.getElementById("score").innerText = score;
            }
        }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (
                candy1.src === candy2.src &&
                candy2.src === candy3.src &&
                !candy1.src.includes("blank")
            ) {
                candy1.src = "Assets/imgs/blank.png";
                candy2.src = "Assets/imgs/blank.png";
                candy3.src = "Assets/imgs/blank.png";
                score += 30;
                document.getElementById("score").innerText = score;
            }
        }
    }
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "Assets/imgs/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "Assets/imgs/" + randomCandy() + ".png";
        }
    }
}

// ---------- Check Valid Move ----------
function checkValid() {
    // Horizontal check
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            if (
                board[r][c].src === board[r][c + 1].src &&
                board[r][c + 1].src === board[r][c + 2].src &&
                !board[r][c].src.includes("blank")
            ) {
                return true;
            }
        }
    }

    // Vertical check
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            if (
                board[r][c].src === board[r + 1][c].src &&
                board[r + 1][c].src === board[r + 2][c].src &&
                !board[r][c].src.includes("blank")
            ) {
                return true;
            }
        }
    }

    return false;
}
