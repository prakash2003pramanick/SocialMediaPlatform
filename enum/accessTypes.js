// Always define any new access type here
const AccessTypes = {
    SUPERADMIN: 0,
    ADMIN: 5,
    USER: 8,
    // POST ACCESS
    POST_ACCESS_BLOCKED : 21,
    POST_CREATION_BLOCKED : 22,
    POST_DELETION_BLOCKED : 23,
    POST_FETCH_BLOCKED : 24,
    // EVENT ACCESS FOR SOCIETIES
    SOCIETY : {
        FULL_ACCESS : 9,
        NOT_APPROVED : 10,
        EVENT_ACCESS_BLOCKED:11,
        EVENT_DELETION_BLOCKED:12,
        EVENT_CREATION_BLOCKED:13,
        EVENT_FETCH_BLOCKED:14,
    },

};

module.exports = AccessTypes;
