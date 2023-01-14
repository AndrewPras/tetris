const boxWidth = 20;
const boxHeight = 20;
const width = 10;
const height = 24;
let activeShape = [];
let frozenBlocks = [];

const userInput = document.querySelector('#userInput');
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let yellow = "#FFFF00";
let purple = "#CC8899";
let orange = "#FFA500";

function drawBlock() {
    activeShape.push({x:4, y:0, colour:yellow});
    activeShape.push({x:5, y:0, colour:yellow});
    activeShape.push({x:4, y:1, colour:yellow});
    activeShape.push({x:5, y:1, colour:yellow});
}

function drawT() {
    activeShape.push({x:4, y:0, colour:purple});
    activeShape.push({x:3, y:0, colour:purple});
    activeShape.push({x:5, y:0, colour:purple});
    activeShape.push({x:4, y:1, colour:purple});
}

function drawL() {
    activeShape.push({x:3, y:0, colour:orange});
    activeShape.push({x:4, y:0, colour:orange});
    activeShape.push({x:5, y:0, colour:orange});
    activeShape.push({x:3, y:1, colour:orange});
}

function draw() {
   ctx.clearRect(0,0,canvas.width, canvas.height)
    if (frozenBlocks.length > 0) {
        for (const block of frozenBlocks) {
            ctx.fillStyle = block.colour;
            ctx.fillRect((boxWidth * block.x), (boxHeight * block.y), boxWidth, boxHeight);
            ctx.strokeRect((boxWidth * block.x), (boxHeight * block.y), boxWidth, boxHeight);
        }
    }
    if (activeShape.length > 0) {
        for (const shape of activeShape) {
            ctx.fillStyle = shape.colour;
            ctx.fillRect((boxWidth * shape.x), (boxHeight * shape.y), boxWidth, boxHeight);
            ctx.strokeRect((boxWidth * shape.x), (boxHeight * shape.y), boxWidth, boxHeight);
        }
    }
}


function freezeShape(activeShape) {
    while (activeShape.length) {
        frozenBlocks.push(activeShape.pop());
    }
    draw();

    let deletedRows = [];
    let rows = [];
    let newFrozenBlocks = [];
    for (const block of frozenBlocks) {
        if (rows[block.y]) {
            rows[block.y] += 1;
            if (rows[block.y] === 10) {
                deletedRows.push(block.y)
            }
        }
        else {
            rows[block.y] = 1;
        }
    }

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < frozenBlocks.length; j++) {
            if (rows[i] != 10 && i === frozenBlocks[j].y) {
                newFrozenBlocks.push(frozenBlocks[j]);
            }
        }
    }

    frozenBlocks = newFrozenBlocks;
    
    // Sort then Reverse the deleted rows Array so that the highest row numbers come first
    deletedRows.sort();
    deletedRows.reverse();
    console.log(deletedRows);    
    
    // Iterate from highest to lowest delete row number
    for (let i = 0; i < deletedRows.length; i++) {
        // If a frozen (non-deleted) block is a lower y than the current (highest active) delete row
        // then add y+1 to the block in order to drop it by 1 row on screen.
        for (block of frozenBlocks) {
            if (block.y < deletedRows[i]) {
                block.y += 1;
            }
        }
        // If there are more that one row to delete, add 1 to each of the remaining delete rows,
        // this is necessary because it will keep the "to be delete row" Y consistent with the
        // blocks that we have just lowered by y+1 in the loop that is immediately above.
        for (let j = i + 1; j < deletedRows.length; j++) {
            deletedRows[j] += 1;
        }
    }

    // Empty deleted rows, so that old deletes don't impact future deletes
    deletedRows = [];
    
    drawShape();
}

function moveShape(direction) {
        if (direction === 'left') {
            for (let i = 0; i < activeShape.length; i++) { activeShape[i].x -= 1; }   
        } else if (direction === 'right') {
            for (let i = 0; i < activeShape.length; i++) { activeShape[i].x += 1; }   
        } else {
            for (let i = 0; i < activeShape.length; i++) { activeShape[i].y += 1; }   
        }
        
}

document.addEventListener('keydown', (e) => {
    let name = e.key;
            console.log(`'${name}'`);
    if (name === 'ArrowDown') { 
        for (let i = 0; i < activeShape.length; i++) {  
            if (frozenBlocks.length > 0) {
                for (let j = 0; j < frozenBlocks.length; j++) {
                    if ((activeShape[i].x === frozenBlocks[j].x && activeShape[i].y+1 === frozenBlocks[j].y) || activeShape[i].y == height - 1)  {
                        freezeShape(activeShape);
                        return;
                    }
                }
            }  
            else {
                if (activeShape[i].y == height - 1)  {
                freezeShape(activeShape);
                return;
                }
            } 
        }
        moveShape('down');
    }          
    else if (name === 'ArrowLeft') { 
        for (let i = 0; i < activeShape.length; i++) {  
            if (frozenBlocks.length > 0) {
                for (let j = 0; j < frozenBlocks.length; j++) {
                    if ((activeShape[i].x - 1 === frozenBlocks[j].x && activeShape[i].y === frozenBlocks[j].y) || activeShape[i].x == 0)  {
                        return;
                    }
                }
            }  
            else {
                if (activeShape[i].x ==  0)  {
                return;
                }
            }   
        }
        moveShape('left');
    }      
    else if (name === 'ArrowRight') { 
        for (let i = 0; i < activeShape.length; i++) {  
            if (frozenBlocks.length > 0) {
                for (let j = 0; j < frozenBlocks.length; j++) {
                    if ((activeShape[i].x + 1 === frozenBlocks[j].x && activeShape[i].y === frozenBlocks[j].y) || activeShape[i].x == width - 1)  {
                        return;
                    }
                }
            }  
            else {
                if (activeShape[i].x ==  width - 1)  {
                return;
                }
            }   
        }
        moveShape('right');
    }  
    else if (name === 'ArrowUp') { 
    /*
    activeShape.push({x:4, y:0, colour:purple});
    activeShape.push({x:3, y:0, colour:purple});
    activeShape.push({x:5, y:0, colour:purple});
    activeShape.push({x:4, y:1, colour:purple});
    */
   debugger;
        for (let i = 1; i < activeShape.length; i++) {
            if (activeShape[i].x < activeShape[0] && activeShape[i].y === activeShape[0].y) {
                activeShape[i].y = activeShape[0].y - (activeShape[i].x - activeShape[0].x);
                activeShape[i].x = activeShape[0].x;
                
            }    
        }
    }  
    draw();
}, false);

function drawShape() {
    const randomNumber = Math.floor(Math.random() * 3)
    if (randomNumber === 0) {
        drawBlock();
    } 
    else if (randomNumber === 1) {
        drawT();
    } 
    else {
        drawL();
    }
}

drawShape();
