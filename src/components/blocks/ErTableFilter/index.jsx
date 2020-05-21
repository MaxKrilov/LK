import { __decorate } from "tslib";
import './_style.scss';
import Vue from 'vue';
import Component from 'vue-class-component';
let ErTableFilter = class ErTableFilter extends Vue {
    // Methods
    setFilter() {
        if (!this.value) {
            this.$emit('change-filter', 'asc');
        }
        else {
            this.$emit('change-filter', this.order === 'asc' ? 'desc' : 'asc');
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(h) {
        return (<button class={[
            'er-table-filter',
            {
                'sort': this.value,
                'desc': this.order === 'desc'
            }
        ]} onClick={() => this.setFilter()}>
        <span class={'icon'}>
          <er-icon name={'funnel'}/>
        </span>
        <span class={'title'}>{this.title}</span>
      </button>);
    }
};
ErTableFilter = __decorate([
    Component({
        props: {
            title: String,
            value: Boolean,
            order: {
                type: String,
                default: 'asc'
            }
        }
    })
], ErTableFilter);
export default ErTableFilter;
//# sourceMappingURL=index.jsx.map