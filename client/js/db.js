class DB {
    constructor() {
        this.storage = localStorage;
        this.data = this.storage.getItem("db") || {};
    }

    setData(data) {
        if(typeof data === "object") {
            this.data = data;
            this.flushData();
        } else if(typeof data === "string") {
            try {
                let json = JSON.parse(data);
                this.data = json;
                this.flushData();
            } catch(e) {
                throw e;
            }
        } else {
            throw new Error("Data type " + typeof data + " incorrect!");
        }
    }

    addData(key, value) {
        this.data[key] = value;
        this.flushData();
    }

    getData() {
        return JSON.parse(this.storage.getItem("db"));
    }

    resetData() {
        this.storage.setItem("db", null);
        this.data = {};
    }

    flushData() {
        this.storage.setItem("db", JSON.stringify(this.data));
    }
}

module.exports = new DB();