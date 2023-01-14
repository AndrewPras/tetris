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
let purple = "#CC8899"

function drawBlock() {
    activeShape.push({x:4, y:0, colour:yellow});
    activeShape.push({x:5, y:0, colour:yellow});
    activeShape.push({x:4, y:1, colour:yellow});
    activeShape.push({x:5, y:1, colour:yellow});
    draw();
}

function drawT() {
    activeShape.push({x:3, y:0, colour:purple});
    activeShape.push({x:4, y:0, colour:purple});
    activeShape.push({x:5, y:0, colour:purple});
    activeShape.push({x:4, y:1, colour:purple});
    draw();
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
    let sortedRows = [];
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

    for (const row of deletedRows) {
        for (const block of frozenBlocks) {
            if (block.y < row) {
                block.y += 1;
            }
        }
    }
    
    drawShape();
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
        for (let i = 0; i < activeShape.length; i++) {
            activeShape[i].y += 1;   
        }
        draw();
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
        for (let i = 0; i < activeShape.length; i++) {
            activeShape[i].x -= 1;   
        }
        draw();
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
        for (let i = 0; i < activeShape.length; i++) {
            activeShape[i].x += 1;   
        }

        draw();
    }  

}, false);

function drawShape() {
    if (Math.round(Math.random())) {
        drawBlock();
    } 
    else {
        drawT();
    }

}

drawShape();
