export function downloadFileByLink(link) {
    // todo Реализовать после реализации хранилища
    fetch(link)
        .then(response => response.blob())
        .then(commits => { console.log(commits); });
}
//# sourceMappingURL=download.js.map