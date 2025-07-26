// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function isValidString(val: unknown) {
  return typeof val === 'string' && val.trim().length > 0;
}

const NAME_KEYS = ['name', 'Please provide your details below to enter our lucky draw.'];
const EMAIL_KEYS = ['email', 'question11'];
const PHONE_KEYS = ['phone', 'Phone'];

function getField(responses: Record<string, any>, keys: string[]) {
  for (const key of keys) {
    if (isValidString(responses[key])) return responses[key];
  }
  return '';
}

function getValidEntries(submissions: unknown[]): Entry[] {
  return submissions.filter((entry): entry is Entry => {
    const e = entry as Entry;
    const responses = e.user_responses || {};
    return (
      isValidString(getField(responses, NAME_KEYS)) &&
      isValidString(getField(responses, EMAIL_KEYS)) &&
      isValidString(getField(responses, PHONE_KEYS))
    );
  });
}

type Entry = {
  id?: string | number;
  user_responses: Record<string, any>;
  created_at?: string;
};

export default function LuckyDrawPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<Entry | null>(null);
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
      background: 'linear-gradient(to bottom right, #FFF7ED, #EEF2FF)',
      padding: '48px 16px',
    }}>
      <div style={{ height: "64px" }} />
      <Card style={{
        maxWidth: '75%',
        margin: '0 auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        marginTop: '120px',
        borderRadius: '1rem',
      }}>
        <CardHeader style={{ padding: "32px" }}>
          <CardTitle style={{
            textAlign: 'center',
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#254569',
          }}>
            <span style={{
              textAlign: 'center',
              padding: '2rem',
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
              <div style={{ marginTop: '2.5rem', padding: "2rem" }}>
                <Table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}>
                  <TableCaption style={{
                    padding: '0.5rem',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                  }}>A list of valid lucky draw entries.</TableCaption>
                  <TableHeader style={{
                    backgroundColor: '#e0f2f7',
                  }}>
                    <TableRow style={{
                      borderBottom: '2px solid #a7d9ed',
                    }}>
                      <TableHead style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#254569',
                        fontSize: '0.9rem',
                      }}>Name</TableHead>
                      <TableHead style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#254569',
                        fontSize: '0.9rem',
                      }}>Email</TableHead>
                      <TableHead style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#254569',
                        fontSize: '0.9rem',
                      }}>Phone</TableHead>
                      <TableHead style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#254569',
                        fontSize: '0.9rem',
                      }}>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow className="table-row">
                        <TableCell colSpan={4} style={{ textAlign: 'left', padding: '16px', color: '#6b7280' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : entries.length === 0 ? (
                      <TableRow className="table-row">
                        <TableCell colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>
                          No valid entries found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry, idx) => {
                        const responses = entry.user_responses || {};
                        return (
                          <TableRow
                            key={entry.id || idx}
                            className="table-row"
                            style={{
                              padding: "16px",
                              borderBottom: '1px solid #e5e7eb',
                              transition: 'background-color 0.2s ease-in-out',
                            }}
                          >
                            <TableCell style={{
                              fontWeight: '500',
                              padding: '12px 16px',
                              color: '#374151',
                            }}>{getField(responses, NAME_KEYS)}</TableCell>
                            <TableCell style={{
                              padding: '12px 16px',
                              color: '#4b5563',
                            }}>{getField(responses, EMAIL_KEYS)}</TableCell>
                            <TableCell style={{
                              padding: '12px 16px',
                              color: '#4b5563',
                            }}>{getField(responses, PHONE_KEYS)}</TableCell>
                            <TableCell style={{
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              padding: '12px 16px',
                            }}>
                              {entry.created_at ? new Date(entry.created_at).toLocaleString() : ''}
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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem', gap: '1.5rem' }}>
            <Button
              onClick={handleLuckyDraw}
              style={{
                fontSize: '1.25rem',
                padding: '1.25rem 2.5rem',
                background: 'linear-gradient(to right, #FACC15, #F472B6, #EF4444)',
                color: 'white',
                fontWeight: '700',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transform: 'scale(1)',
                transition: 'transform 0.3s ease-out',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              ✨ Draw Lucky Winner Now ✨
            </Button>

            {drawError && <div style={{ color: '#dc2626', fontWeight: '600' }}>{drawError}</div>}

            {winner && (
              <Card style={{
                marginTop: '1.5rem',
                width: '100%',
                maxWidth: '28rem',
                border: '2px solid #FACC15',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                animation: 'fadeIn 1s ease-out',
                borderRadius: '0.75rem',
                background: '#fffbeb',
                padding: '1.5rem',
              }}>
                <CardHeader style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
                  <CardTitle style={{ fontSize: '1.5rem', color: '#d97706', fontWeight: '700' }}>🎉 Lucky Winner 🎉</CardTitle>
                </CardHeader>
                <CardContent style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  textAlign: 'center',
                  paddingTop: '0.5rem',
                }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>{getField(winner.user_responses, NAME_KEYS)}</div>
                  <div style={{ color: '#4b5563' }}>Email: <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#1f2937' }}>{getField(winner.user_responses, EMAIL_KEYS)}</span></div>
                  <div style={{ color: '#4b5563' }}>Phone: <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#1f2937' }}>{getField(winner.user_responses, PHONE_KEYS)}</span></div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Submitted: {winner.created_at ? new Date(winner.created_at).toLocaleString() : ''}</div>
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
