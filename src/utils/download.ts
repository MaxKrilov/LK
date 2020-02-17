export function downloadFileByLink (link: string) {
  // todo Реализовать после реализации хранилища
  fetch(link)
    .then(response => response.blob())
    .then(commits => { console.log(commits) })
}
