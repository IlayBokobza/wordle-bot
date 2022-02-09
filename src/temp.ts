import { findWords } from "./find"

const words = [
    'curvy', 'forum',
    'furor', 'humor',
    'juror', 'murky',
    'occur', 'ruddy',
    'rumor', 'thrum',
    'tumor', 'tutor'
]
const options:any = { exclude: [ 'r' ], l2: 'u', l3: 'm', l4: 'o', l5: 'r' };

(async () => {
    const res = await findWords(options,words)
    console.log(res)
})()