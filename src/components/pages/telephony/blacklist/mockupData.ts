import { IBlacklistPhone } from '../telephony.d'

const CommentList = [
  'Оставь надежду всяк сюда входящий',
  'Это чтобы директор не дозвонился',
  'Провались ты!'
]

const genMockupPhoneNumber = (): string => Math.random().toFixed(11).slice(2)
const genMockupComment = (): string => {
  const idx = Math.ceil(Math.random() * CommentList.length) - 1
  return CommentList[idx]
}

function genMockupBlacklist (): IBlacklistPhone[] {
  let randList = [0, 1, 2, 3, 4, 5, 6, 7]
    .map(el => {
      const p: IBlacklistPhone = {
        id: `${el}`,
        phone: genMockupPhoneNumber(),
        comment: genMockupComment()
      }

      return p
    })
  return randList
}

const PhoneBlacklist = genMockupBlacklist()

export {
  PhoneBlacklist
}
