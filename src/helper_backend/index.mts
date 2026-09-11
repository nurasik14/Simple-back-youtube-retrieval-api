import os from "node:os";
import process from "node:process";

import Fastify from 'fastify'
import cors from "@fastify/cors";
import YT_Music_Instance from './youtube_api.mts'

const fastify = Fastify({
    logger: true
})

const startedAt = new Date();
let ytMusicStatus: "initializing" | "ready" | "failed" = "initializing";
let ytMusicError: string | undefined;

let yt_instance: YT_Music_Instance;

try {
    yt_instance = new YT_Music_Instance();

    yt_instance.ready()
        .then(() => { ytMusicStatus = "ready" })
        .catch(() => { ytMusicStatus = "failed" });
} catch (error) {
    ytMusicStatus = "failed";
    ytMusicError = error instanceof Error ? error.message : String(error);
    fastify.log.error(error);
}

fastify.get("/health", async (_request, reply) => {
    const healthy = ytMusicStatus === "ready";

    return reply
        .code(healthy ? 200 : 503)
        .send({
            ok: healthy,
            status: healthy ? "healthy" : "degraded",
            service: "spotify-helper",
            version: "0.1.0",
            uptimeSeconds: Math.floor(process.uptime()),
            startedAt: startedAt.toISOString(),
            timestamp: new Date().toISOString(),
            runtime: {
                node: process.version,
                platform: process.platform,
                architecture: process.arch,
                hostname: os.hostname(),
            },
            dependencies: {
                youtubeMusic: {
                    status: ytMusicStatus,
                    ...(ytMusicError ? { error: ytMusicError } : {}),
                },
            },
        });
});

type FindQuery = {
    query: string
}

fastify.get<{ Querystring: FindQuery }>('/find', async (request, reply) => {
    const { query } = request.query;

    if (!query) {
        return reply.code(400).send({ error: "query is required" });
    }

    // format validation
    if (typeof (query) !== 'string' || query.trim() === '') {
        return reply.code(400).send({ error: "Incorrect requesting parameter format for query" });
    }

    try {
        return await yt_instance.find_music(query);
    } catch (err) {
        request.log.error(err);
        return reply.code(502).send({ error: `Search service failed` });
    }
});

type DownloadBody = {
    videoId: string
}

fastify.post<{ Body: DownloadBody }>(
    '/download',
    async (request, reply) => {
        const { videoId } = request.body;

        // if it exists
        if (!videoId) {
            return reply.code(400).send({ error: "videoId is required" });
        }

        // format validation
        if (typeof (videoId) !== 'string' || videoId.trim() === '') {
            return reply.code(400).send({ error: "Incorrect requesting parameter format for videoId" });
        }

        try {
            const result = await yt_instance.download_music(videoId);
            return reply.code(200).send({ ok: true, result })
        } catch (err) {
            request.log.error(err);
            return reply.code(502).send({ error: "Download service failed" });
        }
    });

const start = async () => {
    try {
        await fastify.register(cors, {
            origin: "https://xpui.app.spotify.com",
            methods: ["GET", "POST", "OPTIONS"],
        });

        await fastify.listen({ host: "127.0.0.1", port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        return "Fastify failed to listen at endpoint";
    }
};

start();
