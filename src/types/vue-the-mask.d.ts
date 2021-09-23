declare module 'vue-the-mask' {
  import {
    AsyncComponent,
    Component,
    DirectiveFunction,
    DirectiveOptions,
    PluginFunction
  } from 'vue'

  // Local component:
  const TheMask: Component<any, any, any, any> | AsyncComponent<any, any, any, any>

  // Local directive:
  const mask: DirectiveFunction | DirectiveOptions

  // Global plugin / default:
  const VueTheMask: PluginFunction<any> & {
    TheMask: Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
    mask: DirectiveFunction | DirectiveOptions;
  }

  export { TheMask, mask }
  export default VueTheMask
}
