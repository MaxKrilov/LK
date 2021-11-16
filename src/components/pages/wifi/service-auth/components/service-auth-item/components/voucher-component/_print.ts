export function printData (element: Element) {
  const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0')
  if (!windowPrint) return
  windowPrint.document.write(element.innerHTML)
  windowPrint.document.close()
  windowPrint.focus()
  windowPrint.print()
  windowPrint.close()
}
