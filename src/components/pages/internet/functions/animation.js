import * as d3 from 'd3';
export function tweenText(newVal) {
    return function () {
        // @ts-ignore
        const currentValue = +this.textContent;
        const i = d3.interpolateRound(currentValue, newVal);
        return function (t) {
            // @ts-ignore
            this.textContent = i(t);
        };
    };
}
//# sourceMappingURL=animation.js.map