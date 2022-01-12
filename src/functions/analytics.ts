export function dataLayerPush (payload: {
  event?: string,
  category?: string,
  action?: string,
  label?: string
}) {
  // const event = payload.event || 'GA'
  const action = payload.action || 'click'
  window.dataLayer = window.dataLayer || []
  if ('gtag' in window) {
    (window as any).gtag('event', action, {
      event_category: payload.category,
      event_label: payload.label,
      value: '1'
    })
  }
}
