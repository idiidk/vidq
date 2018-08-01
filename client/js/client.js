const electron = require("electron");
const p2p = require("./js/p2p.js");
const db = require("./js/db.js");
const remote = electron.remote;

Vue.component("video-item", {
  props: ["title", "description", "thumbnail", "date"],
  data: function() {
    return {
      backgroundColor: "#141311",
      hidden: true
    };
  },
  template: `
    <div v-bind:style="{backgroundColor: backgroundColor}" class="video-item">
        <img v-bind:style="{opacity: hidden ? 0 : 1}" class="thumbnail video-item-child" :src="thumbnail">
        <div class="info">
            <h5 class="title video-item-child">{{title}}</h5>
            <p class="description video-item-child">{{description}}</p>
            <p class="date video-item-child">Upload Date: {{typeof date === "object" ? date.toDateString() : date}}</p>
        </div>
    </div>`,
  created: function() {
    const self = this;
    getAverageColor(this.thumbnail, function(color) {
      self.backgroundColor = color;
      self.hidden = false;
    });
  }
});

Vue.component("video-list", {
  data: function() {
    return {
      videos: []
    };
  },
  template: `
    <div class="video-list">
      <template v-for="video in videos">
        <video-item :title="video.title" :description="video.description" :thumbnail="video.thumbnail" :date="video.date"></video-item>
      </template>
    </div>`,
  created: function() {
    p2p.server(8080, () => {
      console.log("LISTENING ON 8080")
      p2p.loadNodes(() => {
        p2p.connect(nodeCount => {
          console.log(`CONNECTED TO: ${nodeCount} NODES`);
          p2p.askForNodes();
          p2p.ask("videos", untrustedVideo => {
            this.videos.push(untrustedVideo);
          });
        });
      });
    });
  }
});

let app = new Vue({
  el: "#app",
  data: {},
  methods: {
    exit: function() {
      remote.getCurrentWindow().close();
    },
    minimize: function() {
      remote.getCurrentWindow().minimize();
    }
  }
});

function getAverageColor(imgUrl, callback) {
  let pixelInterval = 5,
    rgb = { r: 102, g: 102, b: 102 },
    count = 0,
    i = -4,
    data,
    length;

  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");
  let img = new Image();

  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    let height = c.height,
      width = c.width;

    try {
      data = ctx.getImageData(0, 0, width, height);
    } catch (e) {
      console.error(e);
      return rgb;
    }

    data = data.data;
    length = data.length;
    while ((i += pixelInterval * 4) < length) {
      count++;
      rgb.r += data[i];
      rgb.g += data[i + 1];
      rgb.b += data[i + 2];
    }

    let finalString = "";

    finalString += "rgb(" + Math.floor(rgb.r / count);
    finalString += ", " + Math.floor(rgb.g / count);
    finalString += ", " + Math.floor(rgb.b / count) + ")";

    callback(finalString);
  };
  img.src = imgUrl;
}
