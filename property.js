import { max, min, sum, clone, listRandom } from './functions/util.js';

class Property {
    constructor() {}

    TYPES = {
        // 本局
        AGE: "AGE", // 年龄 age AGE
        THY: "THY", // 理论 theory THY
        TKG: "TKG", // 技术 technology TKG
        LBF: "LBF", // 人才 labor force LBF
        PLC: "PLC", // 政策 policy PLC
        PRT: "PRT", // 资本 property PRT
        LIF: "LIF", // 生命 life LIFE
        TLT: "TLT", // 天赋 talent TLT
        EVT: "EVT", // 事件 event EVT
        TMS: "TMS", // 次数 times TMS

        // Auto calc
        LAGE: "LAGE", // 最低年龄 Low Age
        HAGE: "HAGE", // 最高年龄 High Age
        LTHY: "LTHY", // 最低理论 Low theory
        HTHY: "HTHY", // 最高理论 High theory
        LTKG: "LTKG", // 最低技术 Low technology
        HTKG: "HTKG", // 最高技术 High technology
        LLBF: "LLBF", // 最低人才 Low labor force
        HLBF: "HLBF", // 最高人才 High labor force
        LPLC: "LPLC", // 最低政策 Low policy
        HPLC: "HPLC", // 最高政策 High policy
        LPRT: "LPRT", // 最低资本 Low property
        HPRT: "HPRT", // 最高资本 High property

        SUM: "SUM", // 总评 summary SUM

        EXT: "EXT", // 继承天赋

        // 总计
        // Achievement Total
        ATLT: "ATLT", // 拥有过的天赋 Achieve Talent
        AEVT: "AEVT", // 触发过的事件 Achieve Event
        ACHV: "ACHV", // 达成的成就 Achievement

        CTLT: "RTLT", // 天赋选择数 Count Talent
        CEVT: "REVT", // 事件收集数 Count Event
        CACHV: "CACHV", // 成就达成数 Count Achievement

        // SPECIAL
        RDM: 'RDM', // 随机属性 random RDM

    };

    // 特殊类型
    SPECIAL = {
        RDM: [ // 随机属性 random RDM
            this.TYPES.THY,
            this.TYPES.TKG,
            this.TYPES.LBF,
            this.TYPES.PLC,
            this.TYPES.PRT,
        ]
    }

    #ageData;
    #data = {};

    initial({age}) {

        this.#ageData = age;
        for(const a in age) {
            let { event, talent } = age[a];
            if(!Array.isArray(event))
                event = event?.split(',') || [];

            event = event.map(v=>{
                const value = `${v}`.split('*').map(n=>Number(n));
                if(value.length==1) value.push(1);
                return value;
            });

            if(!Array.isArray(talent))
                talent = talent?.split(',') || [];

            talent = talent.map(v=>Number(v));

            age[a] = { event, talent };
        }
    }

    restart(data) {
        this.#data = {
            [this.TYPES.AGE]: -1,

            [this.TYPES.THY]: 0,
            [this.TYPES.TKG]: 0,
            [this.TYPES.LBF]: 0,
            [this.TYPES.PLC]: 0,
            [this.TYPES.PRT]: 0,

            [this.TYPES.LIF]: 1,

            [this.TYPES.TLT]: [],
            [this.TYPES.EVT]: [],

            [this.TYPES.LAGE]: Infinity,
            [this.TYPES.LTHY]: Infinity,
            [this.TYPES.LTKG]: Infinity,
            [this.TYPES.LLBF]: Infinity,
            [this.TYPES.LPLC]: Infinity,
            [this.TYPES.LPRT]: Infinity,

            [this.TYPES.HAGE]: -Infinity,
            [this.TYPES.HTHY]: -Infinity,
            [this.TYPES.HTKG]: -Infinity,
            [this.TYPES.HLBF]: -Infinity,
            [this.TYPES.HPLC]: -Infinity,
            [this.TYPES.HPRT]: -Infinity,
        };
        for(const key in data)
            this.change(key, data[key]);
    }

    restartLastStep() {
        this.#data[this.TYPES.LAGE] = this.get(this.TYPES.AGE);
        this.#data[this.TYPES.LTHY] = this.get(this.TYPES.THY);
        this.#data[this.TYPES.LTKG] = this.get(this.TYPES.TKG);
        this.#data[this.TYPES.LLBF] = this.get(this.TYPES.LBF);
        this.#data[this.TYPES.LPRT] = this.get(this.TYPES.PRT);
        this.#data[this.TYPES.LPLC] = this.get(this.TYPES.PLC);
        this.#data[this.TYPES.HAGE] = this.get(this.TYPES.AGE);
        this.#data[this.TYPES.HTHY] = this.get(this.TYPES.THY);
        this.#data[this.TYPES.HTKG] = this.get(this.TYPES.TKG);
        this.#data[this.TYPES.HLBF] = this.get(this.TYPES.LBF);
        this.#data[this.TYPES.HPLC] = this.get(this.TYPES.PLC);
        this.#data[this.TYPES.HPRT] = this.get(this.TYPES.PRT);
    }

    get(prop) {
        switch(prop) {
            case this.TYPES.AGE:
            case this.TYPES.THY:
            case this.TYPES.TKG:
            case this.TYPES.LBF:
            case this.TYPES.PLC:
            case this.TYPES.PRT:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                return clone(this.#data[prop]);
            case this.TYPES.LAGE:
            case this.TYPES.LTHY:
            case this.TYPES.LTKG:
            case this.TYPES.LLBF:
            case this.TYPES.LPLC:
            case this.TYPES.LPRT:
                return min(
                    this.#data[prop],
                    this.get(this.fallback(prop))
                );
            case this.TYPES.HAGE:
            case this.TYPES.HTHY:
            case this.TYPES.HTKG:
            case this.TYPES.HLBF:
            case this.TYPES.HPLC:
            case this.TYPES.HPRT:
                return max(
                    this.#data[prop],
                    this.get(this.fallback(prop))
                );
            case this.TYPES.SUM:
                const HAGE = this.get(this.TYPES.HAGE);
                const HTHY = this.get(this.TYPES.HTHY);
                const HTKG = this.get(this.TYPES.HTKG);
                const HLBF = this.get(this.TYPES.HLBF);
                const HPLC = this.get(this.TYPES.HPLC);
                const HPRT = this.get(this.TYPES.HPRT);
                return Math.floor(sum(HTHY, HTKG, HLBF, HPLC, HPRT)*2 + HAGE/2);
            case this.TYPES.TMS:
                return this.lsget('times') || 0;
            case this.TYPES.EXT:
                return this.lsget('extendTalent') || null;
            case this.TYPES.ATLT:
            case this.TYPES.AEVT:
            case this.TYPES.ACHV:
                return this.lsget(prop) || [];
            case this.TYPES.CTLT:
            case this.TYPES.CEVT:
            case this.TYPES.CACHV:
                return this.get(
                    this.fallback(prop)
                ).length;
            default: return 0;
        }
    }

    fallback(prop) {
        switch(prop) {
            case this.TYPES.LAGE:
            case this.TYPES.HAGE: return this.TYPES.AGE;
            case this.TYPES.LTHY:
            case this.TYPES.HTHY: return this.TYPES.THY;
            case this.TYPES.LTKG:
            case this.TYPES.HTKG: return this.TYPES.TKG;
            case this.TYPES.LLBF:
            case this.TYPES.HLBF: return this.TYPES.LBF;
            case this.TYPES.LPLC:
            case this.TYPES.HPLC: return this.TYPES.PLC;
            case this.TYPES.LPRT:
            case this.TYPES.HPRT: return this.TYPES.PRT;
            case this.TYPES.CTLT: return this.TYPES.ATLT;
            case this.TYPES.CEVT: return this.TYPES.AEVT;
            case this.TYPES.CACHV: return this.TYPES.ACHV;
            default: return;
        }
    }

    set(prop, value) {
        switch(prop) {
            case this.TYPES.AGE:
            case this.TYPES.THY:
            case this.TYPES.TKG:
            case this.TYPES.LBF:
            case this.TYPES.PLC:
            case this.TYPES.PRT:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                this.hl(prop, this.#data[prop] = clone(value));
                this.achieve(prop, value);
                return;
            case this.TYPES.TMS:
                this.lsset('times', parseInt(value) || 0);
                return;
            case this.TYPES.EXT:
                this.lsset('extendTalent', value);
                return
            default: return;
        }
    }

    getLastRecord() {
        return clone({
            [this.TYPES.AGE]: this.get(this.TYPES.AGE),
            [this.TYPES.THY]: this.get(this.TYPES.THY),
            [this.TYPES.TKG]: this.get(this.TYPES.TKG),
            [this.TYPES.LBF]: this.get(this.TYPES.LBF),
            [this.TYPES.PLC]: this.get(this.TYPES.PLC),
            [this.TYPES.PRT]: this.get(this.TYPES.PRT),
        });
    }

    change(prop, value) {
        if(Array.isArray(value)) {
            for(const v of value)
                this.change(prop, Number(v));
            return;
        }
        switch(prop) {
            case this.TYPES.AGE:
            case this.TYPES.THY:
            case this.TYPES.TKG:
            case this.TYPES.LBF:
            case this.TYPES.PLC:
            case this.TYPES.PRT:
            case this.TYPES.LIF:
                this.hl(prop, this.#data[prop] += Number(value));
                return;
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                const v = this.#data[prop];
                if(value<0) {
                    const index = v.indexOf(value);
                    if(index!=-1) v.splice(index,1);
                }
                if(!v.includes(value)) v.push(value);
                this.achieve(prop, value);
                return;
            case this.TYPES.TMS:
                this.set(
                    prop,
                    this.get(prop) + parseInt(value)
                );
                return;
            default: return;
        }
    }

    hookSpecial(prop) {
        switch(prop) {
            case this.TYPES.RDM: return listRandom(this.SPECIAL.RDM);
            default: return prop;
        }
    }

    effect(effects) {
        for(let prop in effects)
            this.change(
                this.hookSpecial(prop),
                Number(effects[prop])
            );
    }

    isEnd() {
        return this.get(this.TYPES.LIF) < 1;
    }

    ageNext() {
        this.change(this.TYPES.AGE, 1);
        const age = this.get(this.TYPES.AGE);
        const {event, talent} = this.getAgeData(age);
        return {age, event, talent};
    }

    getAgeData(age) {
        return clone(this.#ageData[age]);
    }

    hl(prop, value) {
        let keys;
        switch(prop) {
            case this.TYPES.AGE: keys = [this.TYPES.LAGE, this.TYPES.HAGE]; break;
            case this.TYPES.THY: keys = [this.TYPES.LTHY, this.TYPES.HTHY]; break;
            case this.TYPES.TKG: keys = [this.TYPES.LTKG, this.TYPES.HTKG]; break;
            case this.TYPES.LBF: keys = [this.TYPES.LLBF, this.TYPES.HLBF]; break;
            case this.TYPES.PLC: keys = [this.TYPES.LPLC, this.TYPES.HPLC]; break;
            case this.TYPES.PRT: keys = [this.TYPES.LPRT, this.TYPES.HPRT]; break;
            default: return;
        }
        const [l, h] = keys;
        this.#data[l] = min(this.#data[l], value);
        this.#data[h] = max(this.#data[h], value);
    }

    achieve(prop, newData) {
        let key;
        switch(prop) {
            case this.TYPES.ACHV:
                const lastData = this.lsget(prop);
                this.lsset(
                    prop,
                    (lastData || []).concat([[newData, Date.now()]])
                );
                return;
            case this.TYPES.TLT: key = this.TYPES.ATLT; break;
            case this.TYPES.EVT: key = this.TYPES.AEVT; break;
            default: return;
        }
        const lastData = this.lsget(key) || [];
        this.lsset(
            key,
            Array.from(
                new Set(
                    lastData
                        .concat(newData||[])
                        .flat()
                )
            )
        )
    }

    lsget(key) {
        const data = localStorage.getItem(key);
        if(data === null) return;
        return JSON.parse(data);
    }

    lsset(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }
}

export default Property;