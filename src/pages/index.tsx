import Head from "next/head";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SourceSelector from "@/components/SourceSelector";
import SourceInput from "@/components/SourceInput";
import SourceList from "@/components/SourceList";
import SummarySection from "@/components/SummarySection";
import { fetchRSSFeed, getSummaryFromServer } from "~/utils/rssUtils";

export type Source = {
  name: string;
  image: string;
  sourceType: string;
};

export type Sources = Source[];

export default function Home() {
  const [currentSource, setCurrentSource] = useState("twitter");
  const [sources, setSources] = useState<Sources>([]);
  const [summary, setSummary] = useState("");
  const [newSource, setNewSource] = useState("");
  const [openAIKey, setOpenAIKey] = useState("");

  const addSource = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sourceData = await fetchRSSFeed(newSource, currentSource);
    setSources([...sources, sourceData]);
    setNewSource("");
  };

  const deleteSource = (sourceName: string) => {
    setSources(sources.filter(source => source.name !== sourceName));
  };

  const handleGetSummary = async () => {
    const summaryData = await getSummaryFromServer(sources, openAIKey);
    setSummary(summaryData);
  };

  return (
    <>
      <Head>
        <title>Keep Up To Date</title>
        <meta name="description" content="Keep up to date with your favorite Twitter accounts and subreddits." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6">News Summarizer</h1>
          <form className="w-full max-w-md" onSubmit={addSource}>
            <SourceSelector currentSource={currentSource} setCurrentSource={setCurrentSource} />
            <SourceInput 
              currentSource={currentSource}
              newSource={newSource}
              setNewSource={setNewSource}
              openAIKey={openAIKey}
              setOpenAIKey={setOpenAIKey}
            />
            <Button className="mt-4" variant="outline" type="submit">Add Source</Button>
          </form>
          <SourceList sources={sources} deleteSource={deleteSource} />
          <Button className="mt-10" variant="outline" onClick={handleGetSummary}>Summarize</Button>
          <SummarySection summary={summary} />
        </div>
      </div>
    </>
  );
}
