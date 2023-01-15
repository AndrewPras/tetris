// Set the dimensions of each tetris block
const boxWidth = 20;
const boxHeight = 20;
// Set the dimensions of the board
const width = 10;
const height = 20;

// Set arrays of active and frozen block objects, these will be drawn by the draw() function
let activeShape = [];
let frozenBlocks = [];

// Set score related arrays
const shapeCounts = {blockO:0, blockI:0, blockT:0, blockJ:0, blockL:0, blockS:0, blockZ:0};
let lines = 0;

const shapeCountOutput = document.querySelectorAll('.shapeCount');
const linesOutput = document.querySelector('#lines');
const userInput = document.querySelector('#userInput');
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// Set colours of the blocks
let yellow = "#FFFF00";
let purple = "#CC8899";
let orange = "#FFA500";
let lightBlue = "#ADD8E6";
let blue = "#0000FF";
let red = "#FF0000";
let green = "#00FF00";

function drawO() {
    activeShape.push({x:4, y:0, colour:yellow}); // Pivot block
    activeShape.push({x:5, y:0, colour:yellow}); 
    activeShape.push({x:4, y:1, colour:yellow});
    activeShape.push({x:5, y:1, colour:yellow});
    shapeCounts['blockO'] += 1;
}

function drawT() {
    activeShape.push({x:4, y:0, colour:purple}); // Pivot block
    activeShape.push({x:3, y:0, colour:purple});
    activeShape.push({x:4, y:1, colour:purple});
    activeShape.push({x:5, y:0, colour:purple});
    shapeCounts['blockT'] += 1;
}

function drawL() {
    activeShape.push({x:4, y:0, colour:orange}); // Pivot block
    activeShape.push({x:3, y:0, colour:orange});
    activeShape.push({x:5, y:0, colour:orange});
    activeShape.push({x:3, y:1, colour:orange});
    shapeCounts['blockL'] += 1;
}

function drawJ() {
    activeShape.push({x:4, y:0, colour:blue}); // Pivot block
    activeShape.push({x:3, y:0, colour:blue});
    activeShape.push({x:5, y:0, colour:blue});
    activeShape.push({x:5, y:1, colour:blue});
    shapeCounts['blockJ'] += 1;
}

function drawI() {
    activeShape.push({x:5, y:0, colour:lightBlue}); // Pivot block
    activeShape.push({x:3, y:0, colour:lightBlue});
    activeShape.push({x:4, y:0, colour:lightBlue});
    activeShape.push({x:6, y:0, colour:lightBlue});
    shapeCounts['blockI'] += 1;
}

function drawS() {
    activeShape.push({x:4, y:1, colour:green}); // Pivot block
    activeShape.push({x:3, y:1, colour:green});
    activeShape.push({x:4, y:0, colour:green});
    activeShape.push({x:5, y:0, colour:green});
    shapeCounts['blockS'] += 1;
}

function drawZ() {
    activeShape.push({x:4, y:1, colour:red}); // Pivot block
    activeShape.push({x:5, y:1, colour:red});
    activeShape.push({x:4, y:0, colour:red});
    activeShape.push({x:3, y:0, colour:red});
    shapeCounts['blockZ'] += 1;
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
                lines += 1;
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
        } else if (direction === 'down') {
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
    else if (name === 'ArrowUp' || name === 'f') { 
        let rotatingShape = [];
        rotatingShape.push(activeShape[0]);
   
        for (let i = 1; i < activeShape.length; i++) {
            console.log(`Orig Active X:${activeShape[i].x} Y:${activeShape[i].y}`);
            console.log(`Orig Pivot  X:${activeShape[0].x} Y:${activeShape[0].y}`);
            // Rotate up - If current shape is immediately left of pivot shape, then move current shape to the same x-axis, 
            // and move the current shape to the same y-axis distance above as the previous x-axis distance was to the left. 
            if (activeShape[i].x < activeShape[0].x && activeShape[i].y ===activeShape[0].y) {
                // Change shape was y-axis to the same distance that the shape was to the left of the pivot shape. 
                rotatingShape.push({x:activeShape[0].x, y:activeShape[0].y - (activeShape[0].x - activeShape[i].x), colour:activeShape[i].colour})
            } 
            // Rotate right - If the current shape is immediate above the pivot shape, then move current shape to the same y-axis,
            // and move the current shape to the same x-axis distance to the right as the previous y-axis distnace was above.
            else if (activeShape[i].x === activeShape[0].x && activeShape[i].y > activeShape[0].y) {
                // 
                rotatingShape.push({x:activeShape[0].x - (activeShape[i].y - activeShape[0].y), y:activeShape[0].y, colour:activeShape[i].colour});
            } 
            else if (activeShape[i].x > activeShape[0].x && activeShape[i].y ===activeShape[0].y) {
                rotatingShape.push({x:activeShape[0].x, y:activeShape[0].y + (activeShape[i].x - activeShape[0].x), colour:activeShape[i].colour});
            }
            else if (activeShape[i].x === activeShape[0].x && activeShape[i].y < activeShape[0].y) {
                // 
                rotatingShape.push({x:activeShape[0].x + (activeShape[0].y - activeShape[i].y), y:activeShape[0].y, colour:activeShape[i].colour});
            }
            // current block x and y is less than pivot block
            else if (activeShape[i].x < activeShape[0].x && activeShape[i].y < activeShape[0].y) {
                rotatingShape.push({x:activeShape[0].x + (activeShape[0].x -  activeShape[i].x), y:activeShape[i].y, colour:activeShape[i].colour});
            } 
            // Current block x > than pivot and current block y < pivot
            else if (activeShape[i].x > activeShape[0].x && activeShape[i].y < activeShape[0].y) {
                rotatingShape.push({x:activeShape[i].x, y:activeShape[0].y + (activeShape[0].y - activeShape[i].y), colour:activeShape[i].colour});
            }
            // current block x and y is greater than pivot block
            else if (activeShape[i].x > activeShape[0].x && activeShape[i].y > activeShape[0].y) {
                rotatingShape.push({x:activeShape[0].x - (activeShape[i].x - activeShape[0].x), y:activeShape[i].y, colour:activeShape[i].colour});
            }
            // Current block x < than pivot and current block y > pivot
            else if (activeShape[i].x < activeShape[0].x && activeShape[i].y > activeShape[0].y) {
                rotatingShape.push({x:activeShape[i].x, y:activeShape[0].y - (activeShape[i].y - activeShape[0].y), colour:activeShape[i].colour});
            }

            console.log(`New Active X:${activeShape[i].x} Y:${activeShape[i].y}`);
            console.log(`New Pivot  X:${activeShape[0].x} Y:${activeShape[0].y}`);
               
        }
        //debugger;
        for (const block of rotatingShape) {
            if (block.x < 0 || block.x >= width || block.y < 0 || block.y >= height) {
                rotatingShape = [];
                return;
            }
        }
        activeShape =  rotatingShape;
        rotatingShape = [];
    }  
    draw();
}, false);

// Randomly generate a number from 0 to 7, and draw a new shape accordingly
function drawShape() {
    const randomNumber = Math.floor(Math.random() * 7)
    if (randomNumber === 0) { drawJ(); }
    else if (randomNumber === 1) { drawT(); }
    else if (randomNumber === 2) { drawL(); }
    else if (randomNumber === 3) { drawI(); }
    else if (randomNumber === 4) { drawS(); } 
    else if (randomNumber === 5) { drawZ(); }  
    else { drawO(); }
    draw();
    updateShapeCountTable();
    
}

function updateShapeCountTable() {
    linesOutput.innerHTML = `Lines: ${lines}`;
    //debugger;
    for (const counter of shapeCountOutput) {
        counter.innerHTML = shapeCounts[counter.id];
    }
    //shapeCountOutput[id='#Block-S'].innerHTML = shapeCounts['s'];
}


// Draw a random shape on page load
drawShape();
