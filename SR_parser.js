
export var grid_actions = [["S5", "", "", "S4", "", ""],
            ["", "S6", "", "", "", "accept"],
            ["", "R2", "S7", "", "R2", "R2"],
            ["", "R4", "R4", "", "R4", "R4"],
            ["S5", "", "", "S4", "", ""],
            ["", "R6", "R6", "", "R6", "R6"],
            ["S5", "", "", "S4", "", ""],
            ["S5", "", "", "S4", "", ""],
            ["", "S6", "", "", "S11", ""],
            ["", "R1", "S7", "", "R1", "R1"],
            ["", "R3", "R3", "", "R3", "R3"],
            ["", "R5", "R5", "", "R5", "R5"]

];

export var grid_goto = [[ "1", "2", "3"],
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
                ["8", "2", "3"],
                ["", "", ""],
                ["", "9", "3"],
                ["", "", "10"],
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]];

export let action_headers = ["id", "+", "*", "(", ")", "$"];
export var goto_headers =  {"E": 0, "T": 1, "F": 2};

//var tokens = ["id", "+", "id", "*", "id", "$"];
var currentStep = 0;
var action = "";


let stepsContainer = document.getElementById("parsingSteps");

export class Production //reduction is the one token on the left and production is stream of tokens on the right
{
    constructor(reduction, protuction_rule)
    {
        this.reduction = reduction;
        this.production_rule = protuction_rule;
    }

    check_production(test_token_stream)
    {
        let production_index = this.production_rule.length - 1;
        console.log(test_token_stream)
        console.log(this.production_rule)
        for (let k = test_token_stream.length - 1; k >= 0; k--)
        {
            if (test_token_stream[k] == this.production_rule[production_index])
            {
                production_index -= 1;
                //console.log(test_token_stream[k])
            }
            if (production_index == -1)
            {
                return k;
            }
        }
        throw "Invalid production reduction.";
        return false;
        
    }

}

export let production_rules = 
[new Production("E", ["E", "+", "T"]),
new Production("E", ["T"]), 
new Production("T", ["T", "*", "F"]),
new Production("T", ["F"]),
new Production("F", ["(", "E", ")"]),
new Production("F", ["id"])];

let parsingButton = document.getElementById("startParse");
parsingButton.addEventListener("click", startParsing);

let parsingSteps = [];

function startParsing()
{
    console.log("starting");
    stepsContainer.innerHTML = "";

    let tokenInputs = document.getElementsByClassName("tokenInput"); //read token inputs
    let tokens = [];
    let finished = false;
    var stack = [0];
    parsingSteps = [];

    for (let i = 0; i < tokenInputs.length; i++)
    {
        tokens.push(tokenInputs[i].value)
    }
    let tokens_copy = [...tokens];
    console.log(tokens);

    let start = document.createElement("p");
    let str = stack + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + tokens;
    parsingSteps.push(str.replace(/,/g, ""));
    console.log(stack + "\t" + tokens);

    for (let i = 0; i < tokens_copy.length;)
    {
        //find the correct column
        let column = -1;
        for (let j = 0; j < action_headers.length; j++)
        {
            if(action_headers[j] == tokens_copy[i])
            {
                column = j;
            }
        }
        if (column == -1)
        {parsingSteps.push("Error: Unrecognized Token.")
            break;
        }

        let row = parseInt(stack[stack.length - 1]);
        action = grid_actions[row][column];

        parsingSteps.push(row.toString() + "/action" + column.toString())

        if (action == "")
        {
            parsingSteps.push("Error: Invalid Syntax.")
            break;
        }
        else if (action == "accept")
        {
            parsingSteps.push("Token Stream Accepted!");
            finished = true;
            break;
        }
        else if(action[0] == "S") //if shift operation
        {
            stack.push(tokens.shift())
            stack.push(action.slice(1, action.length))
            i++; //go to the next token ONLY if shifting

            let str = stack + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + tokens;
            parsingSteps.push(str.replace(/,/g, ""));
            console.log(stack + "\t" + tokens)
        }
        else if(action[0] == "R") //if reduce operation
        {
            let rule_num = parseInt(action.slice(1, action.length));
            parsingSteps.push(rule_num.toString() + "/production");
            let reduction_index = production_rules[rule_num - 1].check_production(stack);
            stack = stack.slice(0, reduction_index);
            let goto_rule = production_rules[rule_num - 1].reduction; //this sucks to read lol
            let goto_row = parseInt(stack[stack.length - 1]);
            parsingSteps.push(goto_row.toString() + "/goto" + goto_headers[goto_rule].toString())
            stack.push(goto_rule);
            stack.push(grid_goto[goto_row][goto_headers[goto_rule]])

            let str = stack + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + tokens;
            parsingSteps.push(str.replace(/,/g, ""));
            
        }
        
    }
    if (!finished)
    {
        parsingSteps.push("Error: abrupt stop.")
    }
    console.log("finished");
    console.log(parsingSteps);
    let delay = document.getElementById("delay").value;
    startParsingAnimation(delay);
}


function startParsingAnimation(delay)
{
    

    for (let i = 0; i < parsingSteps.length; i++)
    {
        setTimeout(function () {
            showStep(i);

        }
            ,delay * i)
    }
}

function showStep(stepNum)
{
    let step = parsingSteps[stepNum];
    if (step.includes("/action"))
    {
        let row = parseInt(step.split("/action")[0]);
        let col = parseInt(step.split("/action")[1]);

        let actionTable = document.getElementById("parseTable");
        let gotoTable = document.getElementById("gotoTable");

        let cells = actionTable.getElementsByTagName("td"); //reset the colors of the two tables
        for (let j = 0; j < cells.length; j++) {
            cells[j].style.backgroundColor = "lightgray";
        }
        cells = gotoTable.getElementsByTagName("td");
        for (let j = 0; j < cells.length; j++) {
            cells[j].style.backgroundColor = "lightgray";
        }

        let cell = actionTable.rows[row + 2].cells[col + 1];
        cell.style.backgroundColor = "red";

        let parent = document.getElementById("productionRules");

        // Get all the child elements of the parent element
        let children = parent.querySelectorAll("*");

        // Loop through the child elements and set their color to red
        for (let i = 0; i < children.length; i++) {
            children[i].style.backgroundColor = "white";
        }

    }
    else if (step.includes("/goto"))
    {
        let row = parseInt(step.split("/goto")[0]);
        let col = parseInt(step.split("/goto")[1]);

        let actionTable = document.getElementById("parseTable");
        let gotoTable = document.getElementById("gotoTable");

        let cells = actionTable.getElementsByTagName("td"); //reset the colors of the two tables
        for (let j = 0; j < cells.length; j++) {
            cells[j].style.backgroundColor = "lightgray";
        }
        cells = gotoTable.getElementsByTagName("td");
        for (let j = 0; j < cells.length; j++) {
            cells[j].style.backgroundColor = "lightgray";
        }

        let cell = gotoTable.rows[row + 2].cells[col];
        cell.style.backgroundColor = "red";


        let parent = document.getElementById("productionRules");

        // Get all the child elements of the parent element
        let children = parent.querySelectorAll("*");

        // Loop through the child elements and set their color to red
        for (let i = 0; i < children.length; i++) {
            children[i].style.backgroundColor = "white";
        }

    }
    else if (step.includes("/production"))
    {
        let productionNum = parseInt(step.split("/production")[0]);
        let production = document.getElementById("rule " + (productionNum - 1));
        
        let parent = document.getElementById("productionRules");

        // Get all the child elements of the parent element
        let children = parent.querySelectorAll("*");

        // Loop through the child elements and set their color to red
        for (let i = 0; i < children.length; i++) {
            children[i].style.backgroundColor = "white";
        }
        
        production.style.backgroundColor = "red";
    }
    else{
        let p = document.createElement("p");
        p.innerHTML = step;
        p.className = "step";
        stepsContainer.appendChild(p);
    }
}

function nextStep()
{
    stepsContainer.innerHTML = "";
    currentStep++;
    if (currentStep >= parsingSteps.length)
    {
        currentStep = parsingSteps.length - 1;
    }
    for (let i = 0; i <= currentStep; i++)
    {
        showStep(i);
    }
}
function previousStep()
{
    stepsContainer.innerHTML = "";
    currentStep--;
    if (currentStep < 0)
    {
        currentStep = 0;
    }
    for (let i = 0; i <= currentStep; i++)
    {
        showStep(i);
    }
}

var rewindButton = document.getElementById("goBackward");
rewindButton.addEventListener("click", previousStep);
var forwardButton = document.getElementById("goForward");
forwardButton.addEventListener("click", nextStep);