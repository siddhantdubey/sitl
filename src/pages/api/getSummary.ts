import OpenAI from 'openai';

export default async function handler(req: any, res: any) {
    const prompt = req.query.prompt;
    const openAIKey = req.query.openAIKey;
    console.log(prompt);
    console.log(openAIKey);
    const openai = new OpenAI({apiKey: openAIKey});
    const chatCompletion = await openai.chat.completions.create({
        messages: [{role: 'user', content: prompt + 'Give a detailed summary of the above tweets and reddit posts.'}],
        model: 'gpt-4-1106-preview'
    });
    const summary = chatCompletion.choices[0]?.message.content;
    console.log(summary);
    res.status(200).json({summary: summary});
}