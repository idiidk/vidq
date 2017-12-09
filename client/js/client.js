const electron = require("electron");
const remote = electron.remote;

let app = new Vue({
    el: "#app",
    data: {
        titlebarText: document.title
    },
    methods: {
        exit: function() {
            remote.getCurrentWindow().close();
        }
    }
});