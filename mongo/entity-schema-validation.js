function SchemaValidation () {
    var self = this;
    this.rules = {};
    this.rules["required"] = new RequiredValidation();
    this.rules["email"] = new EmailValidation();
    this.rules["typeof"] = new TypeofValidation();
    this.rules["max"] = new MaxValidation();
    this.rules["min"] = new MinValidation();

    this.validate = function (schema, model, partial) {
        var response = {
            success: true,
            error: "",
            rule: {}
        }

        var validatePartial = partial !== undefined ? partial : false;

        if(model === undefined || Object.getOwnPropertyNames(model).length == 0) {
            response.success = false;
            response.error = "Model is undefined";
            response.errorCode = 700;

            return response;
        }

        if(!validatePartial) {
            Object.getOwnPropertyNames(schema).forEach(function(name, idx, array) {
                if(model[name] === undefined) {
                    response.success = false;
                    response.error = `The parameter ${name} does not exists in the model`;
                    response.errorCode = 701;
                    response.rule = schema[name];

                    return response;
                }
            });
        }

        Object.getOwnPropertyNames(model).forEach(function(name, idx, array) {
            var item = schema[name];

            if(item !== undefined) {
                // required
                if(item["required"] !== undefined) {
                    if(item["required"] === true) {
                        if(!self.rules["required"].valid(model[name])) {
                            response.success = false;
                            response.error = self.rules["required"].error.replace("[parameter]", name);
                            response.errorCode = 702;
                            response.rule = item;
                            return response;
                        }
                    }
                }

                // email
                if(item["email"] !== undefined) {
                    if(item["email"] === true) {
                        if(!self.rules["email"].valid(model[name])) {
                            response.success = false;
                            response.error = self.rules["email"].error.replace("[parameter]", name);
                            response.errorCode = 703;
                            response.rule = item;
                            return response;
                        }
                    }
                }

                // typeof
                if(item["typeof"] !== undefined) {
                    if(item["typeof"] !== "") {
                        if(!self.rules["typeof"].valid(item["typeof"], model[name])) {
                            response.success = false;
                            response.error = self.rules["typeof"].error.replace("[parameter]", name);
                            response.errorCode = 704;
                            response.rule = item;
                            return response;
                        }
                    }
                }

                // max
                if(item["max"] !== undefined) {
                    if(item["max"] !== "") {
                        if(typeof item["max"] !== "number") {
                            response.success = false;
                            response.error = `The max of the schema must be a number`;
                            response.errorCode = 705;
                            response.rule = item;
                            return response;
                        }

                        if(!self.rules["max"].valid(item["max"], model[name])) {
                            response.success = false;
                            response.error = self.rules["max"].error.replace("[parameter]", name);
                            response.error = response.error.replace("[max]", item["max"]);
                            response.errorCode = 706;
                            response.rule = item;
                            return response;
                        }
                    }
                }

                // min
                if(item["min"] !== undefined) {
                    if(item["min"] !== "") {
                        if(typeof item["min"] !== "number") {
                            response.success = false;
                            response.error = `The min of the schema must be a number`;
                            response.errorCode = 707;
                            response.rule = item;
                            return response;
                        }

                        if(!self.rules["min"].valid(item["min"], model[name])) {
                            response.success = false;
                            response.error = self.rules["min"].error.replace("[parameter]", name);
                            response.error = response.error.replace("[min]", item["min"]);
                            response.errorCode = 708;
                            response.rule = item;
                            return response;
                        }
                    }
                }
            }
            else {
                response.success = false;
                response.error = `The parameter ${name} does not exists in the schema`;
                response.errorCode = 709;

                return response;
            }
        });

        return response;
    }
}

function MaxValidation () {
    this.valid = function (max, value) {
        if(value.length > max) {
            return false;
        }

        return true;
    }

    this.error = "The [parameter] max([max]) length is invalid";
}

function MinValidation () {
    this.valid = function (min, value) {
        if(value.length < min) {
            return false;
        }

        return true;
    }

    this.error = "The [parameter] min([min]) length is invalid";
}

function TypeofValidation () {
    this.valid = function (type, value) {
        if(typeof value !== type) {
            return false;
        }

        return true;
    }

    this.error = "The [parameter] type is invalid";
}

function EmailValidation () {
    this.valid = function (value) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    }

    this.error = "The [parameter] format is invalid";
}

function RequiredValidation () {
    this.valid = function (value) {
        if(value === undefined) {
            if(typeof value === "string") {
                if(value == "") {
                    return false;
                }
            }
            return false;
        }

        return true;
    }

    this.error = "The [parameter] is required";
}

exports.SchemaValidation = function () {
    return new SchemaValidation();
}