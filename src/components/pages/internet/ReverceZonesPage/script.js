var ReverceZonePage_1;
import { __decorate } from "tslib";
import Vue from 'vue';
import Component from 'vue-class-component';
import ReverceZoneItemComponent from './blocks/ReverceZoneItemComponent';
import { getFirstElement } from '@/functions/helper';
// eslint-disable-next-line no-use-before-define
let ReverceZonePage = ReverceZonePage_1 = class ReverceZonePage extends Vue {
    constructor() {
        super(...arguments);
        // Data
        this.listIP = [
            '5.166.47.140',
            '5.166.57.240',
            '5.166.57.241',
            '5.166.57.242',
            '5.166.57.243',
            '109.195.98.254',
            '176.215.1.132'
        ];
        this.currentIP = getFirstElement(this.listIP); // todo Переделать после получения списка IP
        this.listReverceZone = [];
        this.isOpenAdding = false;
        this.model = {
            ip: '',
            domain: ''
        };
        // Переменные-прелоадеры
        this.isLoadingIP = false;
        this.isLoadingReverceZone = false;
        // Hooks
        // beforeRouteEnter (to: Route, from: Route, next: (to?: (RawLocation | false | ((vm: Vue) => void))) => void): void {
        //   console.log(to, from)
        //   console.log('------')
        //   next(vm => {
        //     console.log((vm as ReverceZonePage).cutomerProduct)
        //   })
        // }
    }
    // Methods
    getListReverceZone() {
        this.$store.dispatch('internet/getListReverceZone', { ip: this.currentIP })
            .then(response => {
            this.listReverceZone = Array.isArray(response) ? response : [response];
            this.isLoadingIP = false;
        })
            .finally(() => {
            this.isLoadingReverceZone = false;
        });
    }
    deleteReverceZone() {
        // this.listReverceZone.splice(
        //   this.listReverceZone.findIndex(item => item === reverceZone),
        //   1
        // )
    }
    addReverceZone() {
        if (!this.$refs.form.validate())
            return;
        this.$store.dispatch('internet/addReverceZone', this.model)
            .then(() => {
            if (this.currentIP === this.model.ip) {
                this.listReverceZone.push(this.model.domain);
            }
            this.isOpenAdding = false;
            this.model.ip = '';
            this.model.domain = '';
        });
    }
};
ReverceZonePage = ReverceZonePage_1 = __decorate([
    Component({
        components: {
            ReverceZoneItemComponent
        },
        props: {
            customerProduct: {
                type: Object
            }
        },
        watch: {
            customerProduct(val) {
                if (val) {
                    this.getListReverceZone();
                }
            },
            currentIP() {
                this.isLoadingReverceZone = true;
                this.getListReverceZone();
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.isLoadingIP = true;
                vm.isLoadingReverceZone = true;
                if (vm.customerProduct) {
                    vm.getListReverceZone();
                }
            });
        }
    })
], ReverceZonePage);
export default ReverceZonePage;
// import Vue, { PropType } from 'vue'
//
// // Components
// import ReverceZoneItemComponent from './blocks/ReverceZoneItemComponent/index'
//
// import { ICustomerProduct } from '@/tbapi'
// import { getFirstElement } from '@/functions/helper'
//
// export default Vue.extend({
//   name: 'reverce-zones-page',
//   components: {
//     ReverceZoneItemComponent
//   },
//   props: {
//     customerProduct: {
//       type: Object as PropType<null | ICustomerProduct>
//     }
//   },
//   data () {
//     return {
//       currentIp: '',
//       listIP: [
//         '5.166.47.140',
//         '5.166.57.240',
//         '5.166.57.241',
//         '5.166.57.242',
//         '5.166.57.243',
//         '109.195.98.254',
//         '176.215.1.132'
//       ],
//       listReverceZone: [],
//       isOpenAdding: false,
//       model: {
//         ip: '',
//         domain: ''
//       },
//       loadingReverceZone: true
//     }
//   },
//   watch: {
//     customerProduct (val) {
//       if (!val) {
//         // this.loading = true
//         this.$store.dispatch('internet/getListReverceZone', { ip: getFirstElement(this.listIP) })
//           .then(response => {
//             console.log(response)
//           })
//       }
//     }
//   },
//   methods: {
//     deleteReverceZone (reverceZone: string) {
//       // this.listReverceZone.splice(
//       //   this.listReverceZone.findIndex(item => item.reverceZone === reverceZone),
//       //   1
//       // )
//     }
//   }
// })
//# sourceMappingURL=script.js.map