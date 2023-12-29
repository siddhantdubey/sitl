import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SummaryProps {
  summary: string;
}

const SummarySection: React.FC<SummaryProps>  = ({ summary }) => (
  <div className="w-full max-w-md mt-10">
    <h2 className="text-2xl font-bold mb-4">Your Summary</h2>
    <Card>
      <CardContent>
        <div className="text-base font-normal">{summary ? summary : "Summary will appear here..."}</div>
      </CardContent>
    </Card>
  </div>
);

export default SummarySection;
