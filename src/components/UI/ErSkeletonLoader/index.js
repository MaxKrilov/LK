import './_style.scss';
import Vue from 'vue';
export default Vue.extend({
    name: 'er-skeleton-loader',
    props: {
        active: Boolean
    },
    methods: {
        genLoader() {
            return this.$createElement('div', {
                staticClass: 'er-skeleton-loader__loader'
            });
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'er-skeleton-loader'
        }, [
            this.genLoader(),
            this.$slots.default
        ]);
    }
});
//# sourceMappingURL=index.js.map