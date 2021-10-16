import { readFile } from 'fs/promises';
import Life from '../src/life.js'

globalThis.json = async fileName => JSON.parse(await readFile(`data/${fileName}.json`));

globalThis.localStorage = {};
localStorage.getItem = key => localStorage[key]===void 0? null: localStorage[key];
localStorage.setItem = (key, value) => (localStorage[key] = value);


globalThis.$$eventMap = new Map();
globalThis.$$event = (tag, data) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.forEach(fn=>fn(data));
}
globalThis.$$on = (tag, fn) => {
    let listener = $$eventMap.get(tag);
    if(!listener) {
        listener = new Set();
        $$eventMap.set(tag, listener);
    }
    listener.add(fn);
}
globalThis.$$off = (tag, fn) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.delete(fn);
}

async function debug() {

    const life = new Life();
    await life.initial();

    life.restart({
        THY: 5,                     // 理论 theory THY
        TKG: 5,                     // 技术 technology TKG
        LBF: 5,                     // 人才 labor force LBF
        PLC: 5,                     // 政策 policy PLC
        PRT: 5,                     // 资本 property PRT
        // AGE: 100,
        TLT: [1134, 1048, 1114],    // 天赋 talent TLT
    });
    const lifeTrajectory = [];
    let trajectory;
    do{
        try{
            trajectory = life.next();
        } catch(e) {
            console.error(e);
            // debugger
            throw e;
        }
        lifeTrajectory.push(trajectory);
        const { age, content } = trajectory;
        console.debug(
            `---------------------------------`,
            `\n-- ${age} 岁\n   `,
            content.map(
                ({type, description, rate, name, postEvent}) => {
                    switch(type) {
                        case 'TLT':
                            return `天赋【${name}】发动：${description}`;
                        case 'EVT':
                            return description + (postEvent?`\n    ${postEvent}`:'');
                    }
                }
            ).join('\n    ')
        );
        if(age == 60) debugger
    } while(!trajectory.isEnd)
    // debugger;
}

debug();