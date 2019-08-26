export default function Grid (name) {
  return {
    name: `er-${name}`,
    functional: true,
    props: {
      id: String,
      tag: {
        type: String,
        default: 'div'
      }
    },
    render: (h, { props, data, children }) => {
      data.staticClass = (`${name} ${data.staticClass || ''}`).trim()
      const { attrs } = data
      if (attrs) {
        data.attrs = {}
        const classes = Object.keys(attrs).filter(key => {
          if (key === 'slot') return false
          const value = attrs[key]
          if (key.startsWith('data-')) {
            data.attrs[key] = value
            return false
          }
          return value || typeof value === 'string'
        })
        if (classes.length) {
          data.staticClass += ` ${classes.join(' ')}`
        }
      }
      if (props.id) {
        data.domProps = data.domProps || {}
        data.domProps.id = props.id
      }
      return h(props.tag, data, children)
    }
  }
}
