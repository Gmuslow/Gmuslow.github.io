import {grid_actions, grid_goto, action_headers, production_rules} from "./SR_parser.js"

var table = document.getElementById("parseTable");
let numTokens = 6;
let startingTokens = ["id", "+", "id", "*", "id", "$"];

let r = table.insertRow();
let state_header = r.insertCell();
state_header.innerHTML = "State";
for (let i = 0; i < action_headers.length; i++)
{
    var cell = r.insertCell();
    cell.innerHTML = action_headers[i];
}

// Create a row for each element in the array
for (var i = 0; i < grid_actions.length; i++) {
    var row = table.insertRow();
    let state = row.insertCell();
    state.innerHTML = i;
    // Create a cell for each element in the row
    for (var j = 0; j < grid_actions[i].length; j++) {
        var cell = row.insertCell();
        cell.innerHTML = grid_actions[i][j];
    }
}

var table2 = document.getElementById("gotoTable");
var r2 = table2.insertRow();
var gotoHeaders = ["E","T", "F"]
for (let i = 0; i < gotoHeaders.length; i++)
{
    var cell = r2.insertCell();
    cell.innerHTML = gotoHeaders[i];
}



// Create a row for each element in the array
for (var i = 0; i < grid_goto.length; i++) {
    var row = table2.insertRow();

    // Create a cell for each element in the row
    for (var j = 0; j < grid_goto[i].length; j++) {
        var cell = row.insertCell();
        cell.innerHTML = grid_goto[i][j];
    }
}

var incrementButton = document.getElementById("inc");
incrementButton.addEventListener("click", increment);
var decrementButton = document.getElementById("dec");
decrementButton.addEventListener("click", decrement);

updateTokenInputs();
loadStartingTokens();

let rulesContainer = document.getElementById("productionRules");
let rule_num = 0;
production_rules.forEach(function (rule) {
    let p = document.createElement("p")
    let productionString = "";
    for (let i = 0; i < rule.production_rule.length; i++)
    {
        productionString += rule.production_rule[i];
    }
    p.innerHTML = rule.reduction + "-->" + productionString;
    p.id = "rule " + rule_num;
    rulesContainer.appendChild(p);
    rule_num ++;

})

function increment()
{
    numTokens++;
    updateTokenInputs()
}

function decrement()
{
    numTokens--;
    updateTokenInputs()
}

function loadStartingTokens()
{
    for (let i = 0; i < tokenStream.childNodes.length; i++) {
        let input = document.getElementById("token " + i);
        input.value = startingTokens[i];
    }
}

function updateTokenInputs()
{
    let container = document.getElementById("tokenStream")

    let prevInputs = [];

    // save previous input values
    for (let i = 0; i < container.childNodes.length; i++) {
        prevInputs.push(container.childNodes[i].value);
    }

    // Remove all child elements from the input container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (let i = 0; i < numTokens; i++)
    {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "tokenInput";
        input.id = "token " + i;
        if (prevInputs[i]) {
            input.value = prevInputs[i];
        }
        container.appendChild(input);
    }
}