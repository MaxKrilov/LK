import { Vue, Component, Prop } from 'vue-property-decorator'
import './style.scss'

@Component
export default class CardInstructionsComponent extends Vue {
  @Prop(String) title
  @Prop(String) icon
  @Prop({ type: Array, default: () => ([]) }) links
  @Prop({ type: [Number, String], default: 0 }) beginArray
  @Prop({ type: [Number, String], default: 3 }) endArray

  pre = 'card-instructions-component'
  shadowIcon = {
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      x: '-4px',
      y: '4px'
    },
    shadowRadius: '4px'
  }

  render (h) {
    const pre = this.pre
    return (
      <div class={pre}>
        <div class={`${pre}__content`}>
          <div class={[`${pre}__head`, 'd--flex', 'align-items-center']}>
            <div class={'title'}>{this.title}</div>
            <div class={'icon'}>
              <er-icon
                name={this.icon}
                shadow={this.shadowIcon}
              />
            </div>
          </div>
          <div class={`${pre}__body`}>
            {
              this.links.slice(
                this.beginArray,
                this.endArray
              ).map((link, index) => (
                <router-link to={link.to} key={index}>
                  {link.name}
                  <er-icon name={'arrow_r'} />
                </router-link>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}
