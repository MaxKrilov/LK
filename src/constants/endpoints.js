export const ENDPOINTS_API = {
  url: '/sso/default',
  endpoints: {
    // Аутентификация пользователя в SSO
    authUser: 'auth-user',
    // Обновление токена
    refreshToken: 'refresh-token',
    /**
     * Список учетных записей
     * @param tomsId
     */
    getListlk: 'get-list-lk',
    /**
     * Добавление УЗ пользователем ЛПР
     * @param email,name,phone,tomsId,dmpId
     */
    createUserLpr: 'create-user-lpr',
    /**
     * Создание должности
     * @param userId,tomsId,dmpId,roleId
     */
    createUserPosition: 'create-user-position',
    /**
     * Создание прав доступа для роли
     * @param  userPostId,systemRoleId
     */
    createUserRoles: 'create-user-roles',
    /**
     * Редактирование должности
     * @param id,roleId
     */
    changePosition: 'change-position',
    /**
     * Удаление прав доступа
     * userPostId,systemRoleId
     */
    removeUserRoles: 'remove-user-roles',
    /**
     * Сменить пароль от УЗ
     * @param userId, password
     */
    changePassword: 'change-password',
    /**
     * Создание пользователя
     * @param username,password
     */
    createUser: 'create-user',
    /**
     * @param userId,firstname,lastname,email,attributes[]
     */
    updateUser: 'update-user',
    /**
     * Обновление атрибутов пользователя
     */
    changeAttributes: 'change-attributes',
    /**
     * Удаление должности пользователя
     * @param userId
     */
    deleteUserPost: 'delete-user-post',
    /**
     * Удаление должности
     * @param userId
     */
    deleteRoles: 'delete-roles',
    /**
     * Удаление должности (пользователя из списка)
     * @param userPostId
     */
    removeUser: 'remove-user',
    /**
     * Получение прав доступа кастомера
     */
    getUserRole: 'get-user-role',
    /**
     * Получение должности
     */
    getPost: 'get-post',
    /**
     * Получение cправочника доступов в системы
     */
    getRoles: 'get-roles',
    /**
     * Получение справочника систем
     */
    getSystems: 'get-systems'
  }
}
