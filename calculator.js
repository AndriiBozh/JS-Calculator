// buttons

const buttons = document.querySelectorAll('.button');
//we need to make an array of 'buttons' node list, to be able to apply .forEach method on it
const arr = Array.from(buttons);
const inputDisplay = document.getElementById('input-display');
const outputDisplay = document.getElementById('output-display');
const getResult = document.getElementById('equals');
const clearDisplay = document.getElementById('clear');
const symbols = ['=', 'AC'];
const mathSymbols = ['+', '-', '*', '/'];
let clicked = false;


//functions

const logToDisplay = function() {    

    //use only that symbols, which eval() takes (i.e., not 'const symbols = ['=', 'AC'])
    if (!symbols.includes(this.value) ) {
    // 'this' refers to the 'element' in 'arr.forEach(element.....)' (see below)
    // the first 'inputDisplay.textContent.length' is to check whether it is not undefined, null, or any other falsy value. If we didn't check and if the value was undefined, we'll get an Error when trying to access length. 
// replace math symbol, if user presses another math symbol (e.g.: '+-' => '-')
        let lastChar = inputDisplay.textContent.length && inputDisplay.textContent.length > 0 ? inputDisplay.textContent[inputDisplay.textContent.length-1] : '';     
        if (inputDisplay.textContent.length > 0 && mathSymbols.includes(this.value) && mathSymbols.includes(lastChar)) {
            let stringWithoutLastCharacter = inputDisplay.textContent.slice(0, -1);
            inputDisplay.textContent = stringWithoutLastCharacter + this.value;          
        } else {
           // display elements consequently  
            inputDisplay.textContent += this.value; 
          }
    }
    
    // output display should show only the last input value
    outputDisplay.textContent = this.value;  
    
    if (clicked == true) {
        inputDisplay.textContent = this.value;           
        clicked = false; 
        //  without the following if-statement, when we press '=', after calculations were made and we got result, 'input-display' shows '='. Now, it shows '0'. E.g.: without if-statement: 1+2=3; when we press '=', input display displays '='; with if-statement: 1+2=3; when we press '=', input display displays '0';
        if(this.id == 'equals') {
            inputDisplay.textContent = '0';         
        }              
    }    
}
    
// remove zero before decimal, if multiple zeroes are nor preceded by a number other than zero
const removeExtraZerosAndDots = function() {
    //remove extra zeroes before decimal dot
    inputDisplay.textContent = inputDisplay.textContent.replace(/\b0+(0\.\d+)/g, '$1');    
    //replace dot followed by +, -, *, / with correspondent math symbol. Now we don't have: 1./, or '1.+'. Now the dot, preceeding math symbol is replaced by a correspondent math symbol: '1.+' => '1'
    inputDisplay.textContent = inputDisplay.textContent.replace(/\.(\+|\-|\*|\/)/g, '$1');
    // if after math symbol user presses decimal dot '.' 1+. replace this dot with 0.: 1+. => 1+0.
    inputDisplay.textContent = inputDisplay.textContent.replace(/(\+|\-|\*|\/)\./g, '$1' + '0.');
    // do not allow the first character to be +, /, *
    inputDisplay.textContent = inputDisplay.textContent.replace(/^(\/|\*|\+)/, '');
    // replace decimal dot at the beginning with '0.'
    inputDisplay.textContent = inputDisplay.textContent.replace(/^(\.)/, '0.');    
}

//prevent multiple dots in the string, within one number: '1..2..+2..3..5' => '1.2+2.35'
const oneNumberOneDot = function() {
    let oneDotRegEx = (/^(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[-+\/*]|$))+$/g);    
    //if characters in the 'inputDisplay.textContent' string does not correspond to our oneDotRegEx
    if(!oneDotRegEx.test(inputDisplay.textContent)) {
        // replace the 'inputDisplay.textContent' with unwanted character (coming last), by 'inputDisplay.textContent' without this character
        inputDisplay.textContent = inputDisplay.textContent.slice(0, -1);
    }    
}

const removeExtraMathSymbols = function() {
    // remove extra + (e.g.: 3+++5 => 3+5)
    inputDisplay.textContent = inputDisplay.textContent.replace(/\+*(\+)/g, '$1');
    // remove extra -
    inputDisplay.textContent = inputDisplay.textContent.replace(/\-*(\-)/g, '$1');
    // remove extra *  
    inputDisplay.textContent = inputDisplay.textContent.replace(/\**(\*)/g, '$1');
    // remove extra /
    inputDisplay.textContent = inputDisplay.textContent.replace(/\/*(\/)/g, '$1');    
}

// remove math symbol at the end of a string. Without this, our calculator will not work, if we press '=': 5+=. Now, it will be 5=  
const removeMathSymbolBeforeEqualSign = function() {
    let lastCharacter = inputDisplay.textContent.slice(-1);
    if (mathSymbols.includes(lastCharacter) && this.id=='equals') {      
    inputDisplay.textContent = inputDisplay.textContent.replace(lastCharacter, '');
    }
}

const result = function() {  
    //calculate input
    let res = eval(inputDisplay.textContent);
    //we need our result number to have (in our case) four numbers after '.': 5.1234    
    // so, if the eval() gives us 0.3333333333333333, make it 0.3333;
    // else, if the eval() gives us 1 (a number's length is less than 5), do not change it (if we applied .toFixed(4) to '1': (1).toFixed(4) => 1.0000);
        if (res.toString().length > 5) {
            outputDisplay.textContent = res.toFixed(4);
        } else {
        outputDisplay.textContent = res;
    }    
    clicked = true;    
}

const reset = function() {
    //clear inputDisplay
    if (this.value === "AC") {
        inputDisplay.textContent = '';
        outputDisplay.textContent = '0';        
    }    
}

//event listeners

arr.forEach(element => {
    element.addEventListener('click', logToDisplay);     
    element.addEventListener('click', removeExtraZerosAndDots);
    element.addEventListener('click', removeExtraMathSymbols);   
    element.addEventListener('click', removeMathSymbolBeforeEqualSign); 
    element.addEventListener('click', oneNumberOneDot);    
});

//when a person clicks 'AC'
clearDisplay.addEventListener('click', reset);

//when a person clicks '='
getResult.addEventListener('click', result);
