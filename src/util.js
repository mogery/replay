export function uniqify(x, k) {
    let uniqueValues = [...new Set(x.map(x => x[k]))];
    return uniqueValues.map(y => x.find(x => x[k] === y));
}

export function shufflify(x) {
    let o = []
    while (x.length !== 0) {
        o.push(...x.splice(Math.floor(Math.random() * x.length), 1));
    }
    return o;
}

export function seconds2pretty(x) {
    let categories = {
        s: x % 60,
        m: Math.floor(x / 60) % 60,
        h: Math.floor(Math.floor(x / 60) / 60) % 24,
        d: Math.floor(Math.floor(Math.floor(x / 60) / 60) / 24)
    };
    return Object.entries(categories)
        .filter(([k,v], i) => v !== 0 || i === 0)
        .map(([k,v]) => v + k)
        .reverse()
        .map((x, i) => (<span key={i} className={(i > 1 ? "hidden md:inline" : "")}>
            {x}&nbsp;
        </span>))
}