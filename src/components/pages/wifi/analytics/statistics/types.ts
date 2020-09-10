export type SortField = 'authorization' | 'traffic' | 'datetime' | 'duration'

export type SortOrder = 'asc' | 'desc'

export interface User {
  number: string
  phone: string
  mac: string
  authorization: string
  traffic: {
    value: string
    units: string
  }
  datetime: {
    date: string
    time: string
  }
  duration: {
    hours: string
    minutes: string
  },
  dateRegistration: string
}

export interface UsersRegistryComponent {
  pre: string
  sortField: SortField
  sortOrder: SortOrder
  rows: User[]
  lastRow: User | null
  currentRow: User | null
  showDialog: boolean
  moreCounts: number[]
  showMore: (this: UsersRegistryComponent, count: number) => void
  toggleCardDialog: (this: UsersRegistryComponent) => void
  scrollTop: (this: UsersRegistryComponent) => void
  selectRow: (this: UsersRegistryComponent, row: User) => void
  hasLastRow: (this: UsersRegistryComponent) => boolean
  isFullscreenDialog: (this: UsersRegistryComponent) => boolean
  isDialogShow: (this: UsersRegistryComponent) => boolean
  $scrollTo: (selector: string) => void
  scrollY: number
  'window.scrollY': (this: UsersRegistryComponent, data: number) => void
  $refs: {
    thead: HTMLElement
  }
}

export interface UserRowComponent {
  user: User
  selected: boolean
  isCardView: boolean
  showCard: (this: UserRowComponent) => void
  hideCard: (this: UserRowComponent) => void
  $emit: (event: string, obj?: any) => void
}

export interface UserCardComponent {
  user: User
  closeCard: (this: UserCardComponent, event: Event) => void
  getImg: (this: UserCardComponent, img: string) => string
  $emit: (event: string, obj?: any) => void
}
