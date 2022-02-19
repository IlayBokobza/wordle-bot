function socreLetters(words:string[]){
    const scores:any[] = [{},{},{},{},{}]

    words.forEach(word => {
        for(let i = 0;i < word.length;i++){
            const l = word[i] //the letter
            scores[i][l] = (scores[i][l]) ? scores[i][l] + 1 : 1
        }
    })

    return scores
}

function countUniqueLetters(word:string){
    const counts:any = {}

    for(let i = 0;i < word.length;i++){
        const letter = word[i]
        counts[letter] = true
    }

    return Object.keys(counts).length
}

export function findBestWords(words:string[],onlyUnique:boolean){
    const scores = socreLetters(words)
    let lowest = Number.MAX_SAFE_INTEGER
    let best:any[] = []

    words.forEach((e) => {
        //skiping if word it doen't have 5 unique lettets
        if(onlyUnique && countUniqueLetters(e) != 5) return;

        //finding average
        let average = 0
        for(let i = 0;i < e.length;i++){
            const l = e[i]
            const value = scores[i][l]
            average += value
        }

        average = average / e.length

        if(average < lowest){
            lowest = average
            best = [e]
        }
        else if(average == lowest){
            best.push(e)
        }
    })

    return best
}