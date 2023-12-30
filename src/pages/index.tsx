import Head from "next/head";
import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader, Card, CardContent } from "@/components/ui/card";
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
  const [modelType, setModelType] = useState<string>("gpt-4");

  const [sources, setSources] = useState<Sources>([]);
  const [summary, setSummary] = useState<string>("");
  const [newSource, setNewSource] = useState<string>("");
  const [openAIKey, setOpenAIKey] = useState<string>("");
  useEffect(() => {}, [currentSource]);

  const deleteSource = (source: Source) => {
    setSources(sources.filter((s) => s !== source));
  };

  const addSource = async (event: FormEvent) => {
    event.preventDefault();
    if (currentSource === "twitter") {
      const data = await getTwitterSourceRSS(newSource);
      const image = data.image.url;
      setSources([
        ...sources,
        { name: newSource, image, sourceType: currentSource },
      ]);
    } else {
      setSources([
        ...sources,
        {
          name: newSource,
          image:
            "https://images.squarespace-cdn.com/content/v1/5c5554d316b64061c6f8a20d/1630949829757-WXNOUZ8R4QQCXMIY4YMG/What-Is-The-Reddit-Logo-Called.png",
          sourceType: currentSource,
        },
      ]); // Each source now has a name and an image
      setNewSource("");
    }
  };

  const getTwitterSourceRSS = async (sourceName: string) => {
    const url = `https://nitter.1d4.us/${sourceName}/rss`;
    const response = await fetch(`/api/getRSSFeed?url=${url}`);
    const data = await response.json();
    return data;
  };

  const getRedditSourceRSS = async (source: Source) => {
    const url = `https://www.reddit.com/r/${source.name}.rss`;
    const response = await fetch(`/api/getRSSFeed?url=${url}`);
    const data = await response.json();
    return data;
  };

  const getSummary = async () => {
    let prompt = "Here is a list of posts from sources the user cares about.";
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (source && source.sourceType === "twitter") {
        const data = await getTwitterSourceRSS(source.name);
        prompt +=
          "Twitter user " + data.items[0].creator + "'s last ten tweets are:";
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
    const response = await fetch(
      `/api/getSummary?prompt=${prompt}&openAIKey=${openAIKey}`,
    );
    const data = await response.json();
    setSummary(data.summary);
  };

  return (
    <>
      <Head>
        <title>Keep Up To Date</title>
        <meta
          name="description"
          content="Keep up to date with your favorite twitter accounts and subreddits."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen justify-center py-2">
        <div className="flex w-min flex-col gap-2">
          <div className="flex w-min gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex aspect-square w-full items-center rounded-2xl bg-stone-700 text-center text-8xl font-bold text-white">
                Quick News
              </div>
              <div className="flex w-min gap-2 rounded-[.5em] bg-neutral-200 p-2">
                <input
                  className="appearance-none rounded-[.5em] bg-neutral-100 p-2 text-center focus:outline-none"
                  placeholder="Enter OpenAI Key"
                  type="text"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                />
                <select
                  onChange={(e) => setModelType(e.target.value)}
                  className="appearance-none rounded-[.5em] bg-neutral-100 p-2 text-center focus:outline-none"
                >
                  <option value="gpt-4">Select Model Type</option>
                  <option value="gpt-4">GPT 4</option>
                  <option value="gpt-3">GPT 3.5</option>
                </select>
              </div>
              <Button
                className="rounded-[.5em] bg-stone-700 text-white"
                variant="outline"
                onClick={() => getSummary()}
              >
                Summarize
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <form
                className="flex w-min gap-2 rounded-[.5em] bg-neutral-200 p-2"
                onSubmit={addSource}
              >
                <select
                  onChange={(e) => setCurrentSource(e.target.value)}
                  className="appearance-none rounded-[.5em] bg-neutral-100 p-2 text-center focus:outline-none"
                >
                  <option value="twitter">Select Source Type</option>
                  <option value="twitter">Twitter</option>
                  <option value="reddit">Reddit</option>
                </select>
                <input
                  className="appearance-none rounded-[.5em] bg-neutral-100 text-center focus:outline-none"
                  placeholder={`Enter ${
                    currentSource === "twitter"
                      ? "Twitter handle"
                      : "Subreddit name"
                  }`}
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                />
                <Button
                  className="aspect-square rounded-[.5em] bg-stone-700 text-white"
                  type="submit"
                >
                  ⏎
                </Button>
              </form>
              <div className="h-full rounded-[.5em] bg-neutral-200 p-2">
                {sources.map((source) => (
                  <div
                    className="rounded-[.5em] bg-neutral-100"
                    key={source.name}
                  >
                    <div className="flex flex-row items-center justify-between p-3">
                      <div className="flex flex-row items-center">
                        <img
                          alt={source.name}
                          className="mr-2 rounded-full"
                          height="40"
                          src={source.image}
                          style={{
                            aspectRatio: "40/40",
                            objectFit: "cover",
                          }}
                          width="40"
                        />
                        <div className="text-lg">{"@" + source.name}</div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteSource(source)}
                      >
                        <DeleteIcon className="aspect-square h-8 text-stone-700 hover:text-stone-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-full overflow-y-scroll rounded-[.5em] bg-stone-200 p-4 ">
            <div className="font-normal">
              {summary ? summary : "Summary will appear here..."}
            </div>
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
  );
}
