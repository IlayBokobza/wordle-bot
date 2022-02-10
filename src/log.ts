import fs from 'fs'

export class Log{
    static path = "logs.log"

    static reset(){
        fs.writeFileSync(this.path,'')
    }
    
    static add(msg:string){
        fs.writeFileSync(this.path,`${this.get()}${msg}\n`)
    }

    static get(){
        return fs.readFileSync(this.path).toString()
    }
}