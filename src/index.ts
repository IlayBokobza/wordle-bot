import fs from 'fs'
import puppeteer, { Page } from 'puppeteer'
import {PageHelper} from './pageHelpers'
import { findWords, requirements } from './find'
import { Log } from './log'

async function play(page:puppeteer.Page,words:string[]){
    Log.reset()
    
    await PageHelper.nextWord(page)
    // await page.click('body')
    
    await PageHelper.typeWord('arise',page)
    await page.keyboard.press('Enter')
    await PageHelper.sleep(2250)
    
    let i = 1
    let data = await PageHelper.getDataFromGame(page,i)
    while(i != -1){
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

        await PageHelper.typeWord(word,page)
        await page.keyboard.press('Enter')
        await PageHelper.sleep(2250)
        i++
        
        //gets new data from game
        data = await PageHelper.getDataFromGame(page,i)
        let isCorrect = true
        
        data.forEach(e => {
            if(!/^l[1-5]/.test(e.value)){
                isCorrect = false
            }
        })
        
        if(isCorrect || i == 6){
            i = -1
            
            if(isCorrect){
                console.log(`Done, The word was: ${word.toUpperCase()}`)
                Log.add(`The words is: ${word}`)
            }
            else{
                console.log('FAIL, Got unlucky')
            }
        }

    }
}

async function main(){
    let words:string[] = JSON.parse(fs.readFileSync('./data.json').toString())
    let [p] = await PageHelper.setup()
    const page = p as puppeteer.Page
    
    do{
        await play(page,words)
    }while(true)
}

main()