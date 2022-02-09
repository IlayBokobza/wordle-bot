import fs from 'fs'
import puppeteer from 'puppeteer'
import { findWords, requirements } from './find'

let words:string[] = JSON.parse(fs.readFileSync('./data.json').toString())

async function typeWord(word:string,page:puppeteer.Page){
    for(let i = 0; i < word.length;i++){
        const letter = word[i] as puppeteer.KeyInput
        await page.keyboard.press(letter)
    }
}

async function getDataFromGame(page:puppeteer.Page,row:number){
    return await page.evaluate(() => {

        function parseEvaluation(str:string,i:number){
            switch(str){
                case "present":
                    return "el"+i
                case "correct":
                    return "l"+i
                case "absent":
                    return "exclude"
                default:
                    return ""
            }
        }
        
        const tilesNode = document!.querySelector("body > game-app")!.shadowRoot!.querySelector(`#board > game-row:nth-child(${1})`)!.shadowRoot!.querySelectorAll("div > game-tile")
        const tiles = Array.from(tilesNode) as HTMLElement[]
        const data = tiles.map((e,i) => {
            return{
                letter:e.shadowRoot!.querySelector('div')!.textContent!,
                value:parseEvaluation(e.getAttribute('evaluation')!,i+1)
            }
        })

        return data
    })
}

function sleep(t:number){
    return new Promise(resolve => {
        setTimeout(resolve,t)
    })
}


(async () => {
    const broswer = await puppeteer.launch({headless:false})
    const page = await broswer.newPage()
    await page.goto('https://wordle.berknation.com/')
    // await page.waitForSelector('#game')
    await page.waitForTimeout(1000)
    await page.click('body')
    await typeWord('arise',page)
    await page.keyboard.press('Enter')
    await sleep(2250)

    let i = 1
    while(i != -1){
        const data = await getDataFromGame(page,i)
        const options:any = {};

        data.forEach(e => {
            options[e.value] = e.letter
        })

        console.log(options)
        words = findWords(options,words)
        const randomIndex = Math.floor(Math.random() * words.length)
        const word = words[randomIndex]

        await typeWord(word,page)
        await page.keyboard.press('Enter')
        await sleep(2250)

        i++

        //temp
        if(i == 4){
            i = -1
        }
    }
})()