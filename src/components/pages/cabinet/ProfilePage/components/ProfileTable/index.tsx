import { CreateElement, VNode } from 'vue'
import { Vue, Component } from 'vue-property-decorator'
import './_style.scss'
import { getSlot } from '@/functions/helper'

interface SortBy {
  asc: any,
  name: string
}

const ProfileTableProp = Vue.extend({
  name: 'profile-table',
  props: {
    columns: {
      type: Array,
      default: () => ([])
    },
    tableData: {
      type: Array,
      default: () => ([])
    },
    sortField: {
      type: String,
      default: 'name'
    },
    sortAsc: {
      type: Boolean,
      default: true
    },
    showAmount: {
      type: Boolean,
      default: false
    },
    expandedId: {
      type: String,
      default: null
    }
  }
})

@Component
export default class ProfileTable extends ProfileTableProp {
  pre: string = 'profile-table'
  sortBy: SortBy = {
    asc: null,
    name: 'name'
  }
  defaultAscSortValue: boolean = true

  get preparedColumns () {
    return this.columns.filter((col: any) => col.display)
  }

  get sortedData () {
    const { name, asc } = this.sortBy

    if (asc === null) {
      return this.tableData
    }
    return [...this.tableData].sort((a: any, b: any) => {
      if (asc) {
        return ((a[name] === b[name]) ? 0 : ((a[name] > b[name]) ? 1 : -1))
      }

      return ((a[name] === b[name]) ? 0 : ((a[name] < b[name]) ? 1 : -1))
    })
  }

  get tableLength () {
    return this.sortedData?.length
  }

  mounted () {
    if (this.sortField) {
      this.sortBy.name = this.sortField
    }
    if (this.sortAsc) {
      this.sortBy.asc = this.sortAsc
    }
  }

  handleSort (dataKey: any) {
    const isToggledSameField = this.sortBy.name === dataKey
    this.sortBy.asc = isToggledSameField ? !this.sortBy.asc : this.defaultAscSortValue
    this.sortBy.name = dataKey
    this.$emit('sort', dataKey)
  }

  setFilterActiveStyle (dataKey: any) {
    const { active, reverse } = this.getFilterActiveState(dataKey)
    const result = []
    if (active) {
      result.push(`${this.pre}__filter--active`)
    }
    if (reverse) {
      result.push(`${this.pre}__filter--reverse`)
    }
    return result
  }

  setCellFilterActiveStyle (dataKey: any) {
    const { active, reverse } = this.getFilterActiveState(dataKey)
    const result = []
    if (active) {
      result.push(`${this.pre}__header__cell__filter--active`)
    }
    if (reverse) {
      result.push(`${this.pre}__header__cell__filter--reverse`)
    }
    return result
  }

  getFilterActiveState (dataKey: any) {
    const { name, asc } = this.sortBy
    if (name !== dataKey) {
      return { active: false, reverse: false }
    }
    return { active: true, reverse: asc !== null && !asc }
  }

  handleClickRow (item: any) {
    return this.$emit('clickRow', { item })
  }

  render (h: CreateElement): VNode {
    const scopedSlots = {
      cell: ({ item, dataKey, index }: any) => {
        return (
          <span class={`${this.pre}__content__cell__content`}>
            {getSlot(this, 'cell', { item, dataKey, index }) || item[dataKey]}
          </span>
        )
      },
      row: ({ item }: any) => {
        if (!item) {
          return null
        }
        return (
          <span class={`${this.pre}__content__row__slot`}>
            <span class={`${this.pre}__content__row__slot__separator`}></span>
            {getSlot(this, 'row', { item })}
          </span>
        )
      }
    }

    const getHeadingComponent = (column: any, index: number) => {
      const {
        label,
        disableSort,
        // display,
        dataKey,
        showAmount,
        flexGrow = 1,
        flexShrink = 1,
        width = '100%'
      } = column
      return (
        <div
          onClick={() => !disableSort && this.handleSort(dataKey)}
          class={[`${this.pre}__header__cell`, this.setCellFilterActiveStyle(dataKey)]}
          style={{
            flex: `${flexGrow} ${flexShrink} ${width}`,
            padding: width === 0 ? '0' : undefined,
            ...(disableSort ? {
              cursor: 'default',
              color: '#A7A7A7'
            } : {})
          }}
          key={index}
        >
          {label}
          {showAmount && ` (${this.tableLength})`}
          {!disableSort && (
            <er-button class={[`${this.pre}__filter`, this.setFilterActiveStyle(dataKey)]}>
              <er-icon
                name="funnel"
                class={`${this.pre}__filter__icon`}
              />
            </er-button>
          )}
        </div>
      )
    }

    return (
      <div>
        <div class={this.pre}>
          <div class={`${this.pre}__header`}>
            <div class={`${this.pre}__header__row`}>
              {this.preparedColumns.map((column: any, index: any) => getHeadingComponent(column, index))}
            </div>
          </div>
          <div class={`${this.pre}__content`}>
            {this.tableLength > 0 && this.sortedData.map((item: any, key: any) => (
              <div class={`${this.pre}__content__row-wrapper ${this.expandedId === item.userPostId ? `${this.pre}__content__row-wrapper--active` : ''}`}
                key={key}>
                <div
                  class={`${this.pre}__content__row`}
                  onClick={() => this.handleClickRow(item)}
                >
                  {
                    this.preparedColumns.map(({
                      dataKey,
                      flexGrow,
                      flexShrink,
                      width
                    }: any, index: any) => (
                      <div
                        class={`${this.pre}__content__cell`}
                        style={{
                          flex: width === 0 ? `${flexGrow} ${flexShrink} ${width} !important` : undefined,
                          padding: width === 0 ? '0px !important' : undefined
                        }}
                      >
                        {scopedSlots.cell({ item, dataKey, index })}
                      </div>
                    )
                    )}
                </div>
                {scopedSlots.row({ item })}
                <div class={`${this.pre}__content__separator`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
