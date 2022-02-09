function countWord(word:string){
    const counts:any = {}

    for(let i = 0;i < word.length;i++){
        const letter = word[i]
        counts[letter] = true
    }

    return Object.keys(counts).length
}

export function findMostUniqeWords(words:string[]){
    let out:string[] = []
    let mostUniqeLetters = 0

    words.forEach((i) => {
        const length = countWord(i)

        if(length > mostUniqeLetters){
            mostUniqeLetters = length
            out = [i]
        }
        else if(length == mostUniqeLetters){
            out.push(i)
        }
    })

    return out
}