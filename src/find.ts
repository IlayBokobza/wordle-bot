export type requirements = {
    l1:string,
    l2:string,
    l3:string,
    l4:string,
    l5:string,
    el1:string,
    el2:string,
    el3:string,
    el4:string,
    el5:string,
    exclude:string[],
}

function countLetters(arr:string[]){
    let out:any = {}
    arr.forEach(i => {
        out[i] = (out[i]) ? out[i] + 1: 1
    })
    return out
}

export function findWords(req:requirements,words:string[]){

    //counts all the times we know the letters apear
    const include = [req.el1,req.el2,req.el3,req.el4,req.el5].filter(i => i)
    const letters = [...include,req.l1,req.l2,req.l3,req.l4,req.l5].filter(i => i)
    const counts = countLetters(letters)

    return words.filter(word => {
        word = word.toLocaleLowerCase()

        // checks letters
        const r1 = word[0] == req.l1 || !req.l1
        const r2 = word[1] == req.l2 || !req.l2
        const r3 = word[2] == req.l3 || !req.l3
        const r4 = word[3] == req.l4 || !req.l4
        const r5 = word[4] == req.l5 || !req.l5

        if(!r1 || !r2 || !r3 || !r4 || !r5){
            return false
        }

        //checks excluded at specific spots (the yellow ones)
        const er1 = word[0] != req.el1 || !req.el1
        const er2 = word[1] != req.el2 || !req.el2
        const er3 = word[2] != req.el3 || !req.el3
        const er4 = word[3] != req.el4 || !req.el4
        const er5 = word[4] != req.el5 || !req.el5

        if(!er1 || !er2 || !er3 || !er4 || !er5){
            return false
        }

        // check for include
        for(let j = 0;j < include.length;j++){
            const letter = include[j]
            if(!word.includes(letter)){
                return false
            }
        }

        // check for exclude
        for(let j = 0;j < req.exclude.length;j++){
            const letter = req.exclude[j]
            const count = (counts[letter]) ? counts[letter] : 0
            if(word.length - word.replace(letter,'').length > count){
                return false
            }
        }

        return true
    })
}
