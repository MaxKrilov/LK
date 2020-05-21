import { MANDATORY_02, SHOW_IN_SSP_RU, SHOW_IN_SSP_EN, QUESTION_TYPE_TEXT, SURVEY_STATUS_DONE, SURVEY_MAX_POSTPONED_TIMES, QUESTION_IS_REQUIRED } from '@/constants/survey.ts';
function questionIsVisibleInSSP(question) {
    const showInSSP = [SHOW_IN_SSP_RU, SHOW_IN_SSP_EN];
    return showInSSP.includes(question.doNotShowInSSP);
}
function questionHasMandatory(question) {
    return question.mandatory === MANDATORY_02;
}
function isRequiredQuestion(question) {
    return question.mandatory === QUESTION_IS_REQUIRED;
}
function getOrderedQuestionList(questionList) {
    if (questionList) {
        let newList = questionList.slice();
        newList.sort((a, b) => {
            const aOrder = parseInt(a.orderNumber);
            const bOrder = parseInt(b.orderNumber);
            return aOrder - bOrder;
        });
        const filteredList = newList.filter(el => questionIsVisibleInSSP(el));
        return filteredList;
    }
    return [];
}
function isChildQuestion(question) {
    return !!question.dependencyOnQuestion;
}
function getParentQuestionList(questionList) {
    return questionList.filter(el => !isChildQuestion(el));
}
function surveyStatusIsDone(surveyStatus) {
    return surveyStatus === SURVEY_STATUS_DONE;
}
function isTextQuestion(questionType) {
    return questionType === QUESTION_TYPE_TEXT;
}
function isMaxPostponedTimes(postponedTimes) {
    /* отложено максимальное количество раз */
    const times = parseInt(postponedTimes);
    return times >= SURVEY_MAX_POSTPONED_TIMES;
}
function isPostponedTillActual(postponedTill, endDate) {
    const tillTimestamp = +postponedTill;
    const endTimestamp = +endDate;
    const todayDate = new Date();
    const todayTimestamp = +todayDate;
    const isActual = endTimestamp >= tillTimestamp
        ? todayTimestamp >= tillTimestamp
        : false;
    return isActual;
}
function isPostponedTillExpired(postponedTill, endDTTM) {
    return !isPostponedTillActual(postponedTill, endDTTM);
}
function processSurvey(data) {
    data.postponedTill = data.postponedTill
        ? new Date(data.postponedTill)
        : undefined;
    data.surveyQuestion = getOrderedQuestionList(data.surveyQuestion);
    return data;
}
export { questionIsVisibleInSSP, questionHasMandatory, isRequiredQuestion, isChildQuestion, getOrderedQuestionList, getParentQuestionList, isTextQuestion, surveyStatusIsDone, isMaxPostponedTimes, isPostponedTillExpired, isPostponedTillActual, processSurvey };
//# sourceMappingURL=survey.js.map