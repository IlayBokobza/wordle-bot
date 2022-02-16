import puppeteer from 'puppeteer'
import fs from 'fs'

export type settings = {daily:boolean,startWith:string}
export class Services{
    static async typeWord(word:string,page:puppeteer.Page){
        for(let i = 0; i < word.length;i++){
            const letter = word[i] as puppeteer.KeyInput
            await page.keyboard.press(letter)
        }
    }
    
    static async getDataFromGame(page:puppeteer.Page,r:number){
        return await page.evaluate((row) => {
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
                
            const tilesNode = document!.querySelector("body > game-app")!.shadowRoot!.querySelector(`#board > game-row:nth-child(${row})`)!.shadowRoot!.querySelectorAll("div > game-tile")
            const tiles = Array.from(tilesNode) as HTMLElement[]
            const data = tiles.map((e,i) => {
                return{
                    letter:e.shadowRoot!.querySelector('div')!.textContent!,
                    value:parseEvaluation(e.getAttribute('evaluation')!,i+1)
                }
            })
            
            return data
        },r)
    }
    
    static async nextWord(page:puppeteer.Page,startingWith:string){
        await page.evaluate(() => {
            const btn = document?.querySelector("body > game-app")?.shadowRoot?.querySelector("#randomize") as HTMLButtonElement
            btn.click()
        })
        await Services.sleep(500)
        await page.click('body')
        await Services.typeWord(startingWith,page)
    }
    
     static async setup(settings:settings){
        const broswer = await puppeteer.launch({headless:false})
        const page = await broswer.newPage()
        
        if(settings.daily){
            await page.goto('https://www.nytimes.com/games/wordle/index.html')
        }
        else{
            await page.goto('https://wordle.berknation.com/')
        }

        await page.waitForTimeout(1000)
        await page.click('body')
        return [page,broswer]
     }
        
    static sleep(t:number){
        return new Promise(resolve => {
            setTimeout(resolve,t)
        })
    }

    static loadSettings(){
        const data:settings = JSON.parse(fs.readFileSync('settings.json').toString())
        return data
    }
}