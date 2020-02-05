function TaskHandler() {
    this.title = function () {
        return document.getElementById("title").value;
    }

    this.description = function () {
        return document.getElementById("description").value;
    }

    this.priority = function () {
        return document.getElementById("priority").value;
    }

    this.model = function () {
        return {
            title: this.title(),
            description: this.description(),
            priority: this.priority(),
            _id: 0
        }
    }

    this.reset = function () {
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
    }

    this.valid = function () {
        if(document.getElementById("title").value == "") {
            return false;
        } 

        if(document.getElementById("description").value == "") {
            return false;
        } 

        if(document.getElementById("priority").value == "") {
            return false;
        } 

        return true;
    }
}