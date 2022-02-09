import puppeteer from 'puppeteer'

export class PageHelper{
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
    
    static async nextWord(page:puppeteer.Page){
        await page.evaluate(() => {
            const btn = document?.querySelector("body > game-app")?.shadowRoot?.querySelector("#randomize") as HTMLButtonElement
            btn.click()
        })
        await page.waitForTimeout(1000)
        await page.click('body')
        await PageHelper.typeWord('arise',page)
    }
    
     static async setup(){
        const broswer = await puppeteer.launch({headless:false})
        const page = await broswer.newPage()
        await page.goto('https://wordle.berknation.com/')
        await page.waitForTimeout(1000)
        return [page,broswer]
     }
        
    static sleep(t:number){
        return new Promise(resolve => {
            setTimeout(resolve,t)
        })
    }
}