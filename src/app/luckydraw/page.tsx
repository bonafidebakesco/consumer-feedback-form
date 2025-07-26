import { getQuizSubmissions } from '@/lib/quizService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
type UserResponses = Record<string, string | number | string[]>;
type Submission = {
  id?: string | number;
  created_at?: string;
  user_responses: UserResponses;
};
function isValidString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

// Support both new and legacy keys
const NAME_KEYS = ['name', 'Please provide your details below to enter our lucky draw.'];
const EMAIL_KEYS = ['email', 'question11'];
const PHONE_KEYS = ['phone', 'Phone'];

function getField(responses: UserResponses, keys: string[]): string {
  for (const key of keys) {
    const val = responses[key];
    if (isValidString(val)) return val;
  }
  return '';
}

function getValidEntries(submissions: Submission[]): Submission[] {
  return submissions.filter((entry) => {
    const responses = entry.user_responses || {};
    return (
        isValidString(getField(responses, NAME_KEYS)) &&
        isValidString(getField(responses, EMAIL_KEYS)) &&
        isValidString(getField(responses, PHONE_KEYS))
    );
  });
}

export default async function ValidEntriesPage() {
  // Server-side fetch (Next.js 13+)
  const { data, error } = await getQuizSubmissions();
  const validEntries = data ? getValidEntries(data) : [];

  return (
      <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-amber-50 to-blue-50">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Latest Valid Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-600 mb-4">Error: {error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-xl bg-white">
                <thead>
                <tr className="bg-amber-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Submitted At</th>
                </tr>
                </thead>
                <tbody>
                {validEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        No valid entries found.
                      </td>
                    </tr>
                ) : (
                    validEntries.map((entry, idx) => {
                      const responses = entry.user_responses || {};
                      return (
                          <tr key={entry.id || idx} className="border-b hover:bg-amber-50 transition">
                            <td className="px-4 py-2 font-medium">{getField(responses, NAME_KEYS)}</td>
                            <td className="px-4 py-2">{getField(responses, EMAIL_KEYS)}</td>
                            <td className="px-4 py-2">{getField(responses, PHONE_KEYS)}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}</td>
                          </tr>
                      );
                    })
                )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <script dangerouslySetInnerHTML={{__html: `setTimeout(() => window.location.reload(), 10000);`}} />
      </div>
  );
} 
