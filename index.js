#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import {createSpinner} from 'nanospinner';
import {table} from 'table';
import figlet from 'figlet';

let playerName
var gameState = ["", "", "", "", "", "", "", "", ""];



const sleep = (ms = 2000) => new Promise((r) => setTimeout(r,ms))

async function welcome(){
    const rainbowTitle=chalkAnimation.rainbow(
        'Welcome to CLI tictactoe \n'
    );

    await sleep();
    rainbowTitle.stop();

    console.log(`
    ${chalk.bgBlue('HOW TO PLAY')}
    This is a tic-tac-toe game on your cli  
    You have to choose a position to fill ⭕️ or ❌  
    ${chalk.bgGreen('All the best')}
    `);

}

async function askName(){
    const answer = await inquirer.prompt({
        name : 'player_name',
        type : 'input',
        message : 'What is your name?',
        default(){
            return 'Player';
        }
    });

    playerName = answer.player_name;
};

async function AITurn(){
    let num = 0;
    while(gameState[num] != ""){
        num =  Math.floor(Math.random() * 8);
    }
    gameState[num] = "o";
}
async function playerTurn(gameState){
    let validChoices = [];
    for(let i=0;i<9;i++){
        if(gameState[i] == "")
            validChoices.push(i);
    }
    let pos = 5;
    pos =  await inquirer.prompt({
        name : 'position',
        type :'list',
        message:'Choose position to fill \n',
        choices:validChoices,
    });
    // console.log(`${gameState[pos]}`, pos);
    gameState[pos.position] = "x";
    // console.log(`${gameState[pos]}`, pos);
}

async function displayGame(){
    const data = [
        [`${gameState[0]}`, `${gameState[1]}`, `${gameState[2]}`],
        [`${gameState[3]}`, `${gameState[4]}`, `${gameState[5]}`],
        [`${gameState[6]}`, `${gameState[7]}`, `${gameState[8]}`]
    ];

    console.log(chalk.magenta(table(data)));
}

async function startGame(){
    for(let i=0;i<9;i++){
        await AITurn();
        await displayGame();
        await handleResultValidation(i);
        await checkGame();
        await playerTurn(gameState);
        await displayGame();
        await handleResultValidation(i);
        await checkGame();
    }
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
async function handleResultValidation(i) {
    let roundWon = false;
    let winningPlayer;
    let a,b,c;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        a = gameState[winCondition[0]];
        b = gameState[winCondition[1]];
        c = gameState[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningPlayer = a;
            break
        }
    }
    if (roundWon) {
        if(a == "x"){

            console.log(`Congrats, You won ${playerName}!! 🎉`);
            //await winner();
        }else{
            console.log('💀You lose!');
        }
        process.exit(1);
        return;
    }
};


async function checkGame(){
    for(let i=0;i<9;i++){
        if(gameState[i] == ""){ 
            return;
        }
    }
    await gameOver();
}

async function gameOver(){
    console.log('game over! Thanks for playing. ');
    process.exit(1);
}




await welcome();
await askName();
await startGame();
