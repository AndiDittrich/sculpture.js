const _visibleClasses = [2,3,5,7,9,11,13,17,19];
const _invisibleClasses = [0,1,4,6,8,10,12,14,15,16,18,20,21];

// random char (unicode + ascii)
function randomChar(){
    return (Math.random() + 1).toString(36).substring(2,3);
}

// standard string to array of unicode numbers
function toUnicodeArray(str){
    return str.split('').map(v => {
        return ('0000' + v.charCodeAt(0)).substr(-4);
    });
}

// encode given text to html/unicode/css mix
function crypt(text){

    // std text
    const stdText = text.split('');

    // convert input text to unicode array
    const unicodeText = toUnicodeArray(text);

    // output
    const encodedText = stdText.map((c, index) => {

        const prob = Math.random();

        // use unicode version
        if (c === '@' || prob > 0.4){
            return '&#' + unicodeText[index] + ';';
        }else{
            return c;
        }

    // wrap output into visible span containers
    }).map(el => {
        const n = _visibleClasses[Math.floor(Math.random() * _visibleClasses.length)];
        return `<span class="c${n}">${el}</span>`;
    });

    // inject random content
    for (let i=0;i<10;i++){
        const n = _invisibleClasses[Math.floor(Math.random() * _invisibleClasses.length)];
        const randomContent = `<span class="c${n}">${randomChar()}</span>`;
        const randomIndex = Math.floor(Math.random() * encodedText.length);
        encodedText.splice(randomIndex, 0, randomContent);
    }
    
    // merge
    const output = encodedText.reduce((p, c) => p + c, '');

    // wrap into container
    return `<span class="cryptex">${output}</span>`;
}

module.exports = function init(){
    return {
        crypt: crypt
    };
}