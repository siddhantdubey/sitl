import type { Sources } from "~/pages";

const getTwitterSourceRSS = async (sourceName: string) => {
    const url = `https://nitter.1d4.us/${sourceName}/rss`;
    const response = await fetch(`/api/getRSSFeed?url=${url}`);
    const data = await response.json();
    return data;
};

const getRedditSourceRSS = async (sourceName: string) => {
    const url = `https://www.reddit.com/r/${sourceName}.rss`;
    const response = await fetch(`/api/getRSSFeed?url=${url}`);
    const data = await response.json();
    return data;
};


export const fetchRSSFeed = async (sourceName: string, sourceType: string) => {
    let data;
    if (sourceType === 'twitter') {
        data = await getTwitterSourceRSS(sourceName);
    } else {
        data = await getRedditSourceRSS(sourceName);
    }

    return {
        name: sourceName,
        image: data.image?.url || 'default-image-url',
        sourceType: sourceType,
    };
};


export const getSummaryFromServer = async (sources: Sources, openAIKey: string) => {
    let prompt = "Here is a list of posts from sources the user cares about:";
    for (const source of sources) {
        if (source.sourceType === 'twitter') {
            const data = await getTwitterSourceRSS(source.name);
            prompt += `\nTwitter user ${data.items[0].creator}'s last ten tweets are:`;
            for (let i = 0; i < Math.min(data.items.length, 10); i++) {
                prompt += `\n${i + 1}. ${data.items[i].title}`;
            }
        } else {
            const data = await getRedditSourceRSS(source.name);
            prompt += `\nSubreddit ${data.title}'s top posts are:`;
            for (let i = 0; i < Math.min(data.items.length, 10); i++) {
                prompt += `\n${i + 1}. ${data.items[i].title}`;
            }
        }
    }
    const response = await fetch(`/api/getSummary?prompt=${encodeURIComponent(prompt)}&openAIKey=${openAIKey}`);
    const summaryData = await response.json();
    return summaryData.summary;
};