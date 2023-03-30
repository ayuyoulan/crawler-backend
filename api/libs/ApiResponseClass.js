class ApiResponseClass {
    code = 200;
    data = [];
    msg = "SUCCESS";
    constructor(data) {
        if (data != null) {
            this.data = data;
        }
    }
}

module.exports = ApiResponseClass;