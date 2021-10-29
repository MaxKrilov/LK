export function dataLayerPush (payload: {
  event?: string,
  category?: string,
  action?: string,
  label?: string
}) {
  const event = payload.event || 'GA'
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      ...payload,
      event
    })
  }
}
