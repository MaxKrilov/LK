// Информационный блок на промо странице
export default interface IPromoFeatureItem {
  icon: string // название иконки
  name: string // заголовок блока
  isComponent?: boolean // если true, то вместо description отрисовывается компонент из поля component
  component?: any // обязательный, если isComponent === true
  isHTML?: boolean // если true то содержимое description рендерится как HTML
  description?: string // не требуется если isComponent === true
}
