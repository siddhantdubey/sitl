import Head from "next/head";
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
      ]);
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
        <title>Quick News</title>
        <meta
          name="description"
          content="Keep up to date with your favorite twitter accounts and subreddits."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center py-2 md:h-screen">
        <div className="flex w-min flex-col gap-2">
          <div className="flex w-min flex-col gap-2 md:flex-row">
            <div className="flex flex-col gap-2 md:w-1/2">
              <div className="flex aspect-square w-full items-center rounded-2xl bg-stone-700 text-center text-8xl font-bold text-white">
                Quick News
              </div>
              <div className="flex w-full gap-2 rounded-[.5em] bg-neutral-200 p-2">
                <select
                  onChange={(e) => setModelType(e.target.value)}
                  className="appearance-none rounded-[.5em] bg-neutral-100 p-2 text-center focus:outline-none"
                >
                  <option value="gpt-4">Select Model Type</option>
                  <option value="gpt-4">GPT 4</option>
                  <option value="gpt-3">GPT 3.5</option>
                </select>
                <input
                  className="appearance-none rounded-[.5em] bg-neutral-100 p-2 text-center focus:outline-none"
                  placeholder="Enter OpenAI Key"
                  type="text"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                />
              </div>
              <button
                className="rounded-[.5em] bg-stone-700 text-white"
                onClick={() => getSummary()}
              >
                Summarize
              </button>
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
                <button
                  className="aspect-square rounded-[.5em] bg-stone-700 px-3 text-white"
                  type="submit"
                >
                  ⏎
                </button>
              </form>

              <div className="flex h-min min-h-24 flex-col gap-2 rounded-[.5em] bg-neutral-200 p-2 md:h-full">
                {sources.length > 0 ? (
                  sources.map((source) => (
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
                          <div className="text-lg">{source.name}</div>
                        </div>

                        <button
                          className="aspect-square rounded-[.5em] bg-stone-700 p-2 text-white"
                          onClick={() => deleteSource(source)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-400">
                    Sources will appear here
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-96 min-h-64 rounded-[.5em] bg-stone-200 p-4 md:h-full ">
            {summary ? (
              <div className="font-normal">{summary}</div>
            ) : (
              <div className="text-neutral-400">Summary will appear here</div>
            )}
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  );
}
