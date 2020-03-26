const a: string = '1'
const b: number = 1
const c: boolean = true

type numberOrString = number | string
const rrr: numberOrString = 5

const _null: null = null

const _undefind: undefined = undefined

let _any: any = 1
_any = '1'

let test: number | string = '1'
test = 1

const ar: Array<number> = [1, 2]
const ar4: Array<number | string> = ['1', 2]

const arr: number[] = [3, 4]

const arr3: (number | string)[] = [1, '1']

function x(a: number, b: string = '1', c?: Array<number>): string {
  return ''
}

interface IMyInterface {
  a: string
  b: number
  c?: (d: boolean) => string
}

const obj: IMyInterface = {
  a: '1',
  b: 1
}

function mergeObjects<T extends object, U extends IMyInterface>(obj1: T, obj2: U): T & U {
  return Object.assign({}, obj1, obj2)
}
const r = document.querySelector('.eee')! //сто про есть
r.addEventListener

class Ex {
  readonly a = 1
  public b = 2
  protected c = 3
  private d = 4
}


