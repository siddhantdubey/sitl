import Head from "next/head";
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, Card, CardContent } from "@/components/ui/card"
import { useState, useEffect, FormEvent } from "react";
import { stringify } from "querystring";


export interface Source {
  name: string;
  image: string;
  sourceType: string;
}

export type Sources = Source[];

export default function Home() {
  const [currentSource, setCurrentSource] = useState<string>("twitter");
  const [sources, setSources] = useState<Sources>([]);
  const [summary, setSummary] = useState<string>("");
  const [newSource, setNewSource] = useState<string>("");
  const [openAIKey, setOpenAIKey] = useState<string>(""); 
  useEffect(() => {

  }, [currentSource]);

  const deleteSource = (source: Source) => {
    setSources(sources.filter(s => s !== source));
  }

  const addSource = async (event: FormEvent) => {
    event.preventDefault();
    if (currentSource === "twitter") {
      const data = await getTwitterSourceRSS(newSource);
      const image = data.image.url;
      setSources([...sources, { name: newSource, image, sourceType: currentSource }]);
    } else {
      setSources([...sources, { name: newSource, image: "https://images.squarespace-cdn.com/content/v1/5c5554d316b64061c6f8a20d/1630949829757-WXNOUZ8R4QQCXMIY4YMG/What-Is-The-Reddit-Logo-Called.png", sourceType: currentSource }]); // Each source now has a name and an image
      setNewSource("");
    }
  }

  const getTwitterSourceRSS = async (sourceName: string) => {
    const url = `https://nitter.1d4.us/${sourceName}/rss`;
    const response = await fetch(`/api/getRSSFeed?url=${url}`);
    const data = await response.json();
    return data;
  }

  const getRedditSourceRSS = async (source: Source) => {
    const url = `https://www.reddit.com/r/${source.name}.rss`;
    const response = await fetch(`/api/getRSSFeed?url=${url}`);
    const data = await response.json();
    return data;
  }

  const getSummary = async () => {
    let prompt = "Here is a list of posts from sources the user cares about.";
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (source && source.sourceType === "twitter") {
        const data = await getTwitterSourceRSS(source.name);
        prompt += "Twitter user " + data.items[0].creator + "'s last ten tweets are:"
        for (let j = 0; j < 10; j++) {
          prompt += "\n" + j + ". " + data.items[j].title;
        }
      } else if (source) {
        const data = await getRedditSourceRSS(source);
        prompt += "Subreddit " + data.title + "'s  posts are: ";
        for (let j = 0; j < 10; j++) {
          prompt += "\n" + j + ". " + stringify(data.items[j]);
        }
      }
    }
    const response = await fetch(`/api/getSummary?prompt=${prompt}&openAIKey=${openAIKey}`);
    const data = await response.json();
    setSummary(data.summary);
  }

  return (
    <>
      <Head>
        <title>Keep Up To Date</title>
        <meta name="description" content="Keep up to date with your favorite twitter accounts and subreddits." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6">News Summarizer</h1>
          <form className="w-full max-w-md" onSubmit={addSource}>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-source"
                >
                  News Source
                </label>
                <div className="relative inline-flex">
                  <svg className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 232"><path d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l189.21 189.211c9.372 9.373 24.749 9.373 34.121 0l189.211-189.211c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z" fill="#648299" fill-rule="nonzero" /></svg>
                  <select onChange={(e) => setCurrentSource(e.target.value)} className="border border-gray-300 text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
                    <option>Select Source Type</option>
                    <option value="twitter">Twitter Account</option>
                    <option value="reddit">Subreddit</option>
                  </select>
                </div>
                {currentSource && (
                  <>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-source-input"
                      placeholder={`Enter ${currentSource === 'twitter' ? 'Twitter handle' : 'Subreddit name'}`}
                      type="text"
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                    />
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-openai-key-input"
                      placeholder="Enter OpenAI Key"
                      type="text"
                      value={openAIKey}
                      onChange={(e) => setOpenAIKey(e.target.value)}
                    />
                    <Button className="mt-4" variant="outline" type="submit">
                      Add Source
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="w-full max-w-md mt-6">
              <h2 className="text-2xl font-bold mb-4">Your Sources</h2>
              {sources.map(source => (
                <Card key={source.name}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <img
                      alt={source.name}
                      className="rounded-full mr-4"
                      height="40"
                      src={source.image}
                      style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                      }}
                      width="40"
                    />
                    <CardTitle className="text-lg font-bold">{source.name}</CardTitle>
                    <Button size="icon" variant="ghost" onClick={() => deleteSource(source)}>
                      <DeleteIcon className="w-4 h-4 text-red-500" />
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </form>
          <Button className="mt-10" variant="outline" onClick={() => getSummary()}>
            Summarize
          </Button>
          <div className="w-full max-w-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Your Summary</h2>
            <Card>
              <CardContent>
                <div className="text-base font-normal">{summary ? summary : "Summary will appear here..."}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}


interface DeleteIconProps {
  className?: string;
}

function DeleteIcon({ className }: DeleteIconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  )
}