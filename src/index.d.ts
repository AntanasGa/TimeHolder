declare module '*.vue' {
  import Vue from 'vue'
  export default ReturnType<typeof Vue.defineComponent>
}
