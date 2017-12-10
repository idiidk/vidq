const electron = require("electron");
const remote = electron.remote;

Vue.component("video-item", {
    props: ["title", "description", "thumbnail", "date"],
    template: `
    <div class="video-item">
        <img class="thumbnail video-item-child" :src="thumbnail">
        <div class="info">
            <h5 class="title video-item-child">{{title}}</h5>
            <p class="description video-item-child">{{description}}</p>
            <p class="date video-item-child">Upload Date: {{typeof date === "object" ? date.toDateString() : date}}</p>
        </div>
    </div>`
});

Vue.component('child', {
    // declare the props
    props: ['message'],
    // like data, the prop can be used inside templates and
    // is also made available in the vm as this.message
    template: '<span>{{ message }}</span>'
})

let app = new Vue({
    el: "#app",
    data: {
         
    },
    methods: {
        exit: function () {
            remote.getCurrentWindow().close();
        },
        minimize: function () {
            remote.getCurrentWindow().minimize();
        }
    }
});