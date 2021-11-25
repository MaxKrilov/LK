export function dataLayerPush (payload: {
  event?: string,
  category?: string,
  action?: string,
  label?: string
}) {
  const event = payload.event || 'GA'
  const action = payload.action || 'click'
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      ...payload,
      event,
      action
    })
  }
}
