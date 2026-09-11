import YTMusic from "ytmusic-api"

import youtubedl from 'youtube-dl-exec'
//const youtubedl = require('youtube-dl-exec');


// TODO: add progress bar for downloading

//const logger = require('progress-estimator')();

// TODO: hardcoded path extract to .env later
const output_dir = "/home/nurasik12/Downloads/YT_DLT_INSTALLED"

export default class YT_Music_Instance {
    yt_inst: YTMusic;
    private readonly readyPromise: Promise<YTMusic | void>;

    constructor() {
        this.yt_inst = new YTMusic();
        this.readyPromise = this.yt_inst.initialize();
    }

    async ready(): Promise<YTMusic | void> {
        await this.readyPromise;

        return this.readyPromise;
    }

    async find_music(query: string) {
        await this.readyPromise;
        return this.yt_inst.search(query);
    }

    async download_music(videoID: string) {
        const url = `https://www.youtube.com/watch?v=${videoID}`;

        return youtubedl(url, {
            paths: output_dir,
        })
            .then((res) => { console.log(res); return res; })
            .catch((err) => { console.log(`Error occured while downloading: ${err}`); throw err; });
    }
}
