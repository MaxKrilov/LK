import axios from 'axios';
const _mime = require('mime-types');
export default class File {
    static async getFileByUrl(url, cb, errorHandler) {
        axios.get(url, {
            responseType: 'blob'
        })
            .then((result) => {
            const oFReader = new FileReader();
            oFReader.readAsDataURL(result.data);
            oFReader.onload = (OFREvent) => {
                if (OFREvent.target !== null) {
                    const header = ';base64,';
                    const sFileData = OFREvent.target.result;
                    const sBase64Data = sFileData.substr(sFileData.indexOf(header) + header.length);
                    cb(sBase64Data);
                }
            };
        })
            .catch((error) => {
            errorHandler && errorHandler(error);
        });
    }
    static downloadFile(data, fileName, mime, bom) {
        const blobData = (typeof bom !== 'undefined') ? [bom, data] : [data];
        mime = mime || _mime.lookup(fileName);
        const blob = new Blob(blobData, { type: mime });
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, fileName);
        }
        else {
            const blobURL = (window.URL ? window.URL : window.webkitURL).createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', fileName);
            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            setTimeout(function () {
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobURL);
            }, 0);
        }
    }
    static downloadFileByURL(link, fileName) {
        const tempLink = document.createElement('a');
        tempLink.setAttribute('download', fileName);
        tempLink.style.display = 'none';
        tempLink.href = link;
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function () {
            document.body.removeChild(tempLink);
        }, 0);
    }
}
//# sourceMappingURL=file.js.map