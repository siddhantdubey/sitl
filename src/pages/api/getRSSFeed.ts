import Parser from "rss-parser";

export default async function handler(req: any, res: any) {
    const parser = new Parser();
    const url = req.query.url;
    const feed = await parser.parseURL(url);
    res.status(200).json(feed);
}