const electron = require("electron");
const remote = electron.remote;

let app = new Vue({
    el: "#app",
    data: {

    },
    methods: {
        exit: function() {
            remote.getCurrentWindow().close();
        }
    }
});