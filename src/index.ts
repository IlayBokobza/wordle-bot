import fs from 'fs'
type requirements = {
    l1:string,
    l2:string,
    l3:string,
    l4:string,
    l5:string,
    include:string[],
    exclude:string[]
}


function findWords(req:requirements){
    const words:string[] = JSON.parse(fs.readFileSync('./data.json').toString())
    
    return words.filter(i => {
        i = i.toLocaleLowerCase()
        const r1 = i[0] == req.l1 || !req.l1
        const r2 = i[1] == req.l2 || !req.l2
        const r3 = i[2] == req.l3 || !req.l3
        const r4 = i[3] == req.l4 || !req.l4
        const r5 = i[4] == req.l5 || !req.l5

        if(!r1 || !r2 || !r3 || !r4 || !r5){
            return false
        }

        // check for include
        for(let j = 0;j < req.include.length;j++){
            const letter = req.include[j]
            if(!i.includes(letter)){
                return false
            }
        }

        // check for exclude
        for(let j = 0;j < req.exclude.length;j++){
            const letter = req.exclude[j]
            if(i.includes(letter)){
                return false
            }
        }

        return true
    })
}

console.log(findWords({
    l1:'',
    l2:'a',
    l3:'',
    l4:'',
    l5:'y',
    include:['a'],
    exclude:['b','e','n','s','c','o','l','t','p','m']
}))