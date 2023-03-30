class ApiResponseClass {
    code = 200;
    data = [];
    msg = "SUCCESS";
    constructor(data) {
        if (Array.isArray(data)) {
            this.data = data;
        }
    }
}

module.exports = ApiResponseClass;