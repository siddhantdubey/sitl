import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sources } from '~/pages';

interface SourceListProps {
  sources: Sources;
  deleteSource: (sourceName: string) => void;
}

const SourceList: React.FC<SourceListProps> = ({ sources, deleteSource }) => (
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
            style={{ aspectRatio: "40/40", objectFit: "cover" }}
            width="40"
          />
          <CardTitle className="text-lg font-bold">{source.name}</CardTitle>
          <Button size="icon" variant="ghost" onClick={() => deleteSource(source.name)}>
            <DeleteIcon className="w-4 h-4 text-red-500" />
          </Button>
        </CardHeader>
      </Card>
    ))}
  </div>
);
function DeleteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
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

export default SourceList;
