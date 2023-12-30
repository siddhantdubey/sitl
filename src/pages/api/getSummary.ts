import OpenAI from 'openai';

export default async function handler(req: any, res: any) {
    const prompt = req.query.prompt;
    const openAIKey = req.query.openAIKey;
    const modelType = req.query.modelType;
    console.log(prompt);
    const openai = new OpenAI({apiKey: openAIKey});
    const chatCompletion = await openai.chat.completions.create({
        messages: [{role: 'user', content: prompt + 'Give a detailed summary of the above tweets and reddit posts.'}],
        model: modelType,
    });
    const summary = chatCompletion.choices[0]?.message.content;
    console.log(summary);
    res.status(200).json({summary: summary});
}