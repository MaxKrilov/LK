import axios from 'axios'

export default class File {
  public static async getFileByUrl (url: string, cb: (base64Data: string) => any) {
    const result = await axios.get(url, {
      responseType: 'blob'
    })
    const oFReader = new FileReader()
    oFReader.readAsDataURL(result.data)
    oFReader.onload = (OFREvent) => {
      if (OFREvent.target !== null) {
        const header = ';base64,'
        const sFileData = OFREvent.target.result as string
        const sBase64Data = sFileData.substr(sFileData.indexOf(header) + header.length)
        cb(sBase64Data)
      }
    }
  }
}
