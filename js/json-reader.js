function JsonReader() {
    var self = this;

    this.match = function (template) {
        var regexStr = /\[(.*?)\]/g;
        var matched = template.match(regexStr);

        return matched;
    }

    this.parse = function (template, data) {
        var matched = this.match(template);

        matched.forEach(function (im) {
            var newIM = im.replace("[", "").replace("]", "");

            var strToReplace = "";
            if (newIM.substring(0, 5) === "json:") {
                strToReplace = self.pipeline(newIM, data);
            }

            if (strToReplace !== null) {
                template = template.replace(im, strToReplace);
            }
        });

        return template;
    }

    this.pipeline = function (element, message) {
        if (typeof element === "string") {
            if (element.substring(0, 5) == "json:") {
                element = element.replace("json:", "");
                element = this.read(element, message);
            }
        }

        return element;
    }

    this.read = function (str, obj) {
        if (str === undefined)
            throw new Error("The json selector string is not defined");
        if (typeof str != "string")
            throw new Error("The json selector string is not defined");
        if (str.trim() == "")
            throw new Error("The json selector string is not defined");
        if (obj === undefined)
            throw new Error("The json object is not defined");
        if (Object.keys(obj).length == 0)
            throw new Error("The json object has not properties");

        const strData = str.split(".");
        var holder = obj;
        strData.forEach((element) => {

            if (element.indexOf("[") != -1) {
                element = element.replace("]", "");
                var elementArray = element.split("[");
                element = elementArray[0];
                var index = parseInt(elementArray[1]);

                if (holder[element] === undefined) {
                    holder = null;
                }
                else {

                    if (Array.isArray(holder[element]) == false)
                        throw new Error(`The property ${element} is not an array`);

                    holder = holder[element][index];

                }
            }
            else {
                if (holder[element] === undefined) {
                    holder = null;
                }
                else {
                    holder = holder[element];
                }
            }
        });

        return holder;
    }
}