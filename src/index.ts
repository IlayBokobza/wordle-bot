import fs from 'fs'
import puppeteer from 'puppeteer'
import { Services, settings } from './services'
import { findWords } from './find'
import { Log } from './log'

async function play(page:puppeteer.Page,words:string[],settings:settings){
    Log.reset()
    
    if(!settings.daily){
        await Services.nextWord(page,settings.startWith)
    }
    
    await Services.typeWord(settings.startWith,page)
    await page.keyboard.press('Enter')
    await Services.sleep(2250)
    
    let data = await Services.getDataFromGame(page,1)
    let isCorrect = null
    for(let i = 1;i <= 6;i++){
        await page.click('body')
        const options:any = {exclude:[]};

        data.forEach(e => {
            if(e.value == 'exclude'){
                options.exclude.push(e.letter)
                return
            }

            options[e.value] = e.letter
        })

        words = findWords(options,words)
        const randomIndex = Math.floor(Math.random() * words.length)
        const word = words[randomIndex]

        // logs
        Log.add(JSON.stringify(words))
        Log.add(JSON.stringify(options))
        Log.add(JSON.stringify({word,randomIndex,length:words.length}));
        Log.add("##############")

        
        //remove last word from list
        words.splice(randomIndex,1)

        await Services.typeWord(word,page)
        await page.keyboard.press('Enter')
        await Services.sleep(2250)
        
        //gets new data from game
        data = await Services.getDataFromGame(page,i+1)
        isCorrect = true
        
        data.forEach(e => {
            if(!/^l[1-5]/.test(e.value)){
                isCorrect = false
            }
        })
        
        if(isCorrect){
            console.log(`Done, The word was: ${word.toUpperCase()}`)
            Log.add(`The words is: ${word}`)
            break
        }
    }

    if(!isCorrect){
        console.log('FAIL, Got unlucky')
    }
}

async function main(){
    let words:string[] = JSON.parse(fs.readFileSync('./data.json').toString())
    const settings = Services.loadSettings()
    let [p] = await Services.setup(settings)
    const page = p as puppeteer.Page
    
    do{
        await play(page,words,settings)
    }while(!settings.daily)
}

main()