import { Component, Vue, Watch } from 'vue-property-decorator'
import { logInfo } from '@/functions/logging'

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

    SimpleFSM необходим когда требуется чтобы компонент находился только в одном состоянии
    Например:
      - модальное окно с загружаемыми данными будет иметь три состояния: hidden, loading, visible
      - страница с заказом может иметь состояния: order, orderSuccess, orderError
      в каждом состоянии отображаются соответствующие данные и элементы управления

    Пример:

      export default class MyProduct extends VueSimpleFSM {
        stateList = ['loading', 'ready', 'disabled']
      }
  */
  private state: TState = ''
  private prevState: TState = ''
  stateList!: TState[]

  created () {
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
    Конечный автомат с переходами
    Позволяет задать код, который будет выполняться при переходе с одного
    состояния на другое состояние

    Переходы записываются в поле stateTransitions в формате:

    {
      <состояние_1>: {
        <состояние_2>: <код_выполняющийся_при_переходе_из_состояния_1_в_состояние_2>
      }
    }

    Пример использования - страница с загрузкой данных:

    class MyVueComponent extends VueTransitionFSM {
      // определяем доступные состояния (FSM сразу будет в первом состоянии 'loading')
      stateList = [
        'loading',
        'ready',
        'error'
      ]

      // определяем переходы для loading -> error, loading -> ready и ready -> loading
      stateTransitions = {
        loading: {
          error: () => { alert('Ошибка при загрузке данных') },
          ready: () => { alert('страница загружена') }
        },
        ready: {
          loading: () => { alert('Надо догрузить данные') }
        }
      }

      mounted() {
        // переключаем в состояние загрузки
        this.setState('loading')

        // грузим данные
        fetch('/api/info')
          .then(data => {
            // после успешной загрузки меняем состояние на 'ready'
            // при этом сработает alert('страница загружена')
            // как это прописано в переходе loading -> ready (в this.stateTransitions.loading.ready)
            this.setState('ready')
          })
          .catch(error => {
            // данные не загрузились - переключаемся на состояние ошибки
            // при этом выведется alert('ошибка при загрузке данных'),
            // как описано в this.stateTransitions.loading.error
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
    this.stateTransitions?.[this.lastState]?.[nextState](this)
  }

  @Watch('state')
  onChangeState (stateName: TState) {
    logInfo(`FSM ${(this.lastState ? this.lastState + ' → ' : '') + this.activeState}`)
    if (this.hasTransition(stateName)) {
      this.runTransition(stateName)
    }
  }
}
