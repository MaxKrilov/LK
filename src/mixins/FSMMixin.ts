import { Component, Vue, Watch } from 'vue-property-decorator'

type TState = string
interface IFSMTransition extends Record<TState, Record<TState, Function>> {}

@Component
export class VueSimpleFSM extends Vue {
  /*
    SimpleFSM - Примитивный конечный автомат.
      * Хранит список состояний в поле stateLits (задаётся в потомке)
      * хранит текущее состояние в поле activeState
      * хранит предыдущее состояния в поле lastState
      * Меняет состояния с помощью метода setState(stateName)
  */
  private state: TState = ''
  private prevState: TState = ''
  stateList!: TState[]

  created () {
    console.log('my state list', this.stateList)
    this.state = this.stateList[0] || ''
  }

  /* Установка текущего состояния */
  public setState (state: TState) {
    if (this.isRealState(state)) {
      Vue.set(this, 'prevState', this.state)
      Vue.set(this, 'state', this.stateList.includes(state) ? state : this.state)
    }
  }

  public get activeState (): TState {
    return this.state
  }

  public get lastState (): TState {
    return this.prevState
  }

  private isRealState (stateName: TState) {
    return this.stateList.includes(stateName)
  }
}

@Component
export class VueTransitionFSM extends VueSimpleFSM {
  /*
    Конечный автомат с переходами от одного состояния к другому

    class MyVueComponent extends VueTransitionFSM {
      // определяем доступные состояния (FSM сразу будет в первом состоянии 'loading')
      stateList = [
        'loading',
        'ready',
        'error'
      ]

      // определяем переходы для loading -> error, loading -> ready и ready -> loading
      stateTransition = {
        loading: {
          error: () => { alert('Ошибка при загрузке') },
          ready: () => { alert('страница загружена') }
        },
        ready: {
          loading: () => { alert('Надо догрузить данные') }
        }
      }

      mounted() {
        // грузим данные
        fetch('/api/info')
          .then(data => {
            // после успешной загрузки меняем состояние на 'ready'
            this.setState('ready')
          })
          .catch(error => {
            this.setState('error')
          })
      }
    }
  */
  stateTransitions: IFSMTransition = {}

  private hasTransition (nextState: TState) {
    return this.stateTransitions?.[this.lastState]?.[nextState] || false
  }

  private runTransition (nextState: TState) {
    this.stateTransitions?.[this.lastState]?.[nextState]()
  }

  @Watch('state')
  onChangeState (stateName: TState) {
    console.log(`[FSM CHANGE STATE '${this.lastState}' -> '${stateName}']`)

    if (this.hasTransition(stateName)) {
      console.log(`[FSM RUN transition '${this.lastState}' -> '${stateName}']`)
      this.runTransition(stateName)
    }
  }
}
