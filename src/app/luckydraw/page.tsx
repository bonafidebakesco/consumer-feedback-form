"use client";
import { useEffect, useState } from "react";
import { getQuizSubmissions } from '@/lib/quizService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import '../globals.css'


const NAME_KEYS = ['name', 'Please provide your details below to enter our lucky draw.'];
const EMAIL_KEYS = ['email', 'question11'];
const PHONE_KEYS = ['phone', 'Phone'];

type UserResponses = Record<string, string | number | string[]>;
type Submission = {
  id?: string | number;
  created_at?: string;
  user_responses: UserResponses;
};

function isValidString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

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
export default function LuckyDrawPage() {
  const [entries, setEntries] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<Submission | null>(null);
  const [drawError, setDrawError] = useState<string | null>(null);

  async function fetchEntries() {
    setLoading(true);
    setError(null);
    setWinner(null);
    setDrawError(null);
    try {
      const { data, error } = await getQuizSubmissions();
      if (error) {
        setError(error);
        setEntries([]);
      } else {
        setEntries(getValidEntries(data || []));
      }
    } catch {
      setError('Failed to fetch entries.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
    const interval = setInterval(fetchEntries, 10000);
    return () => clearInterval(interval);
  }, []);

  function handleLuckyDraw() {
    setWinner(null);
    setDrawError(null);
    if (entries.length < 4) {
      setDrawError('At least 4 valid entries are required for the lucky draw.');
      return;
    }
    const idx = Math.floor(Math.random() * entries.length);
    setWinner(entries[idx]);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #FFF7ED, #EEF2FF) !important',
      padding: '48px 16px !important',
    }}>
      <div style={{ height: "64px" }} />
      <Card style={{
        maxWidth: '75%',
        margin: '0 auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important',
        marginTop: '120px !important',
        borderRadius: '1rem !important',
      }}>
        <CardHeader style={{ padding: "32px !important" }}>
          <CardTitle style={{
            textAlign: 'center',
            fontSize: '2.25rem !important',
            fontWeight: '700 !important',
            color: '#254569 !important',
          }}>
            <span style={{
              textAlign: 'center',
              padding: '2rem !important',
              display: 'inline-block',
            }}>
              🎁 <strong><em>Lucky Draw Entries</em></strong> 🎁
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent style={{ marginTop: '1rem' }}>
          {error && (
            <div
              style={{
                color: '#dc2626',
                textAlign: 'center',
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ width: 'auto', margin: '0 auto', minWidth: '360px' }}>
              <div style={{ marginTop: '2.5rem', padding: "2rem !important" }}>
                <Table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}>
                  <TableCaption style={{
                    padding: '0.5rem !important',
                    color: '#6b7280 !important',
                    fontSize: '0.875rem !important',
                    backgroundColor: '#f9fafb !important',
                    borderTop: '1px solid #e5e7eb !important',
                  }}>A list of valid lucky draw entries.</TableCaption>
                  <TableHeader style={{
                    backgroundColor: '#e0f2f7 !important',
                  }}>
                    <TableRow style={{
                      borderBottom: '2px solid #a7d9ed !important',
                    }}>
                      <TableHead style={{
                        padding: '12px 16px !important',
                        textAlign: 'left',
                        fontWeight: '600 !important',
                        color: '#254569 !important',
                        fontSize: '0.9rem !important',
                      }}>Name</TableHead>
                      <TableHead style={{
                        padding: '12px 16px !important',
                        textAlign: 'left',
                        fontWeight: '600 !important',
                        color: '#254569 !important',
                        fontSize: '0.9rem !important',
                      }}>Email</TableHead>
                      <TableHead style={{
                        padding: '12px 16px !important',
                        textAlign: 'left',
                        fontWeight: '600 !important',
                        color: '#254569 !important',
                        fontSize: '0.9rem !important',
                      }}>Phone</TableHead>
                      <TableHead style={{
                        padding: '12px 16px !important',
                        textAlign: 'right',
                        fontWeight: '600 !important',
                        color: '#254569 !important',
                        fontSize: '0.9rem !important',
                      }}>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} style={{     textAlign: 'left', padding: '16px !important',color: '#6b7280 !important' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} style={{ textAlign: 'center', padding: '1.5rem !important', color: '#6b7280 !important' }}>
                          No valid entries found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry: Submission, idx: number) => {
                        const responses = entry.user_responses || {};
                        return (
                          <TableRow key={entry.id || idx} style={{
                            padding: "16px !important",
                            borderBottom: '1px solid #e5e7eb !important',
                            transition: 'background-color 0.2s ease-in-out !important',
                          }}>
                            <TableCell style={{
                              fontWeight: '500 !important',
                              padding: '12px 16px !important',
                              color: '#374151 !important',
                            }}>{getField(responses, NAME_KEYS)}</TableCell>
                            <TableCell style={{
                              padding: '12px 16px !important',
                              color: '#4b5563 !important',
                            }}>{getField(responses, EMAIL_KEYS)}</TableCell>
                            <TableCell style={{
                              padding: '12px 16px !important',
                              color: '#4b5563 !important',
                            }}>{getField(responses, PHONE_KEYS)}</TableCell>
                            <TableCell style={{
                              textAlign: 'right',
                              fontSize: '0.75rem !important',
                              color: '#6b7280 !important',
                              padding: '12px 16px !important',
                            }}>
                              {entry.created_at
                                ? new Date(entry.created_at).toLocaleString()
                                : ''}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex !important', flexDirection: 'column', alignItems: 'center !important', marginTop: '3rem !important', gap: '1.5rem !important' }}>
            <Button
              onClick={handleLuckyDraw}
              style={{
                fontSize: '1.25rem !important',
                padding: '1.25rem 2.5rem !important',
                background: 'linear-gradient(to right, #FACC15, #F472B6, #EF4444) !important',
                color: 'white !important',
                fontWeight: '700 !important',
                borderRadius: '0.75rem !important',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important',
                transform: 'scale(1) !important',
                transition: 'transform 0.3s ease-out !important',
                cursor: 'pointer !important',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05) !important')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) !important')}
            >
              ✨ Draw Lucky Winner Now ✨
            </Button>

            {drawError && <div style={{ color: '#dc2626 !important', fontWeight: '600 !important' }}>{drawError}</div>}

            {winner && (
              <Card style={{
                marginTop: '1.5rem !important',
                width: '100% !important',
                maxWidth: '28rem !important',
                border: '2px solid #FACC15 !important',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important',
                animation: 'fadeIn 1s ease-out !important',
                borderRadius: '0.75rem !important',
                background: '#fffbeb !important',
                padding: '1.5rem !important',
              }}>
                <CardHeader style={{ textAlign: 'center', paddingBottom: '0.5rem !important' }}>
                  <CardTitle style={{ fontSize: '1.5rem !important', color: '#d97706 !important', fontWeight: '700 !important' }}>🎉 Lucky Winner 🎉</CardTitle>
                </CardHeader>
                <CardContent style={{
                  display: 'flex !important',
                  flexDirection: 'column',
                  gap: '0.5rem !important',
                  textAlign: 'center',
                  paddingTop: '0.5rem !important',
                }}>
                  <div style={{ fontSize: '1.125rem !important', fontWeight: '700 !important' }}>{getField(winner.user_responses, NAME_KEYS)}</div>
                  <div style={{ color: '#4b5563 !important' }}>Email: <span style={{ fontFamily: 'monospace !important', fontWeight: '500 !important', color: '#1f2937 !important' }}>{getField(winner.user_responses, EMAIL_KEYS)}</span></div>
                  <div style={{ color: '#4b5563 !important' }}>Phone: <span style={{ fontFamily: 'monospace !important', fontWeight: '500 !important', color: '#1f2937 !important' }}>{getField(winner.user_responses, PHONE_KEYS)}</span></div>
                  <div style={{ fontSize: '0.75rem !important', color: '#6b7280 !important', marginTop: '0.5rem !important' }}>Submitted: {winner.created_at ? new Date(winner.created_at).toLocaleString() : ''}</div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Style for table row hover effect */
        .table-row:hover {
          background-color: #f3f4f6 !important; /* A light gray background on hover */
        }
      `}</style>
    </div>
  );
}
