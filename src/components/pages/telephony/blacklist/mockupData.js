const CommentList = [
    'Оставь надежду всяк сюда входящий',
    'Это чтобы директор не дозвонился',
    'Провались ты!'
];
const genMockupPhoneNumber = () => Math.random().toFixed(11).slice(2);
const genMockupComment = () => {
    const idx = Math.ceil(Math.random() * CommentList.length) - 1;
    return CommentList[idx];
};
function genMockupBlacklist() {
    let randList = [0, 1, 2, 3, 4, 5, 6, 7]
        .map(el => {
        const p = {
            id: `${el}`,
            phone: genMockupPhoneNumber(),
            comment: genMockupComment()
        };
        return p;
    });
    return randList;
}
const PhoneBlacklist = genMockupBlacklist();
export { PhoneBlacklist };
//# sourceMappingURL=mockupData.js.map