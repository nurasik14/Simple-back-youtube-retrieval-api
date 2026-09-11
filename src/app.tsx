async function waitForSpicetify() {
    while (!Spicetify?.showNotification) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    //TODO: Start the backend + check if responses
    const url = "http://127.0.0.1:3000/health";

    const response = await fetch(url);
    if (response.status != 200) {
        throw Error(`Error occured while trying to start the youtubeAPI server: ${response.status}`);
    } else {
        console.log(`Successful loading of backend: ${response.status}`);
    }
}

//TODO: FIND from backend
async function findMusicInYoutubeMusic(event): Promise<string> {
    console.log("FINDING MUSIC:");

    if (event) {
        const [artists, song_name, album_name] = await getPlayerMetadata(event.data.item);

        //TODO: Handle YouTubeMusicAPI query
        const query = `${song_name} ${album_name} ${artists[0].name}`;
        const url = `http://127.0.0.1:3000/find?query=${query}`;
        const init = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        };

        const response = await fetch(url, init);
        console.log(response.json());
        const videoId = "";

        if (videoId) {
            return videoId;
        } else {
            throw Error("Failed to retrieve the videoId");
        }
    }
}

async function getPlayerMetadata(item) {
    if (item) {
        console.log("Metadata")
        console.log(`Track Author:`)
        console.log(item.artists)
        console.log(`Track name: ${item.name}`)
        console.log(`Album name: ${item.album.name}`)

        return [item.artists, item.name, item.album.name];
    }
    throw Error("Failed to retieve metadata from the music");
}

//TODO: DOWNLOAD from backend
async function download(videoId: string) {
    console.log(`Fetching url=https://www.youtube.com/watch?v=${videoId}`);
};

async function main() {
    await waitForSpicetify();
    Spicetify.showNotification("Yoo! Nurasik. Your script is working");

    Spicetify.Player.addEventListener("songchange", async (e) => {
        const videoId = await findMusicInYoutubeMusic(e);

        await download(videoId);
    });
}

export default main;
