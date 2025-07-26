'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getQuizSubmissions } from '@/lib/quizService';
import PasswordChangeDialog from '../../components/PasswordChangeDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  CompletionRateChart,
  QuestionResponseChart,
  ResponseTypePieChart,
  TimeAnalysisChart,
  SatisfactionChart,
  ResponseTrendChart,
  QuestionTypeDoughnut,
  prepareChartData
} from '@/components/analytics/Charts';
import { BusinessInsights } from '@/components/analytics/BusinessInsights';
import {
  analyzeUserResponses,
  generateProductInsights,
  generateSalesOpportunities
} from '@/lib/businessAnalytics';
import {
  AnalyticsData,
  QuizSubmission,
  BusinessInsight,
  ProductInsight,
  SalesOpportunity
} from '@/types';
import type { QuestionAnalysis, TopResponse } from '@/types';
import '../globals.css';

// Prevent static generation - this page should only be rendered on the client
export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Business Analytics State
  const [businessInsights, setBusinessInsights] = useState<BusinessInsight[]>([]);
  const [productInsights, setProductInsights] = useState<ProductInsight[]>([]);
  const [salesOpportunities, setSalesOpportunities] = useState<SalesOpportunity[]>([]);
  
  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getQuizSubmissions();
      if (result.success && result.data) {
        setSubmissions(result.data);
        const analytics = analyzeResponses(result.data);
        setAnalyticsData(analytics);

        // Generate Business Analytics
        const insights = analyzeUserResponses(result.data);
        const products = generateProductInsights(result.data);
        const opportunities = generateSalesOpportunities(result.data);

        setBusinessInsights(insights);
        setProductInsights(products);
        setSalesOpportunities(opportunities);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
    if (session) {
      await loadAnalytics();
    }
  },[loadAnalytics]);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setLoginError(error.message);
      } else {
        setIsLoggedIn(true);
        await loadAnalytics();
      }
    } catch (error) {
      setLoginError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setAnalyticsData(null);
  };

  const analyzeResponses = (data: QuizSubmission[]): AnalyticsData => {
    const totalSubmissions = data.length;
    const completedSubmissions = data.filter(s => s.submission_status === 'completed').length;
    const completionRate = totalSubmissions > 0 ? (completedSubmissions / totalSubmissions) * 100 : 0;

    // Calculate average completion time (if timestamps are available)
    const completionTimes = data
        .filter(s => s.created_at)
        .map(s => new Date(s.created_at!).getTime());

    const averageCompletionTime = completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;

    // Analyze question responses
    const questionAnalysis: Record<string, unknown> = {};
    const topResponses: Record<string, unknown[]> = {};

    data.forEach(submission => {
      if (submission.user_responses) {
        Object.entries(submission.user_responses).forEach(([questionName, response]) => {
          if (!questionAnalysis[questionName]) {
            questionAnalysis[questionName] = {
              total: 0,
              responses: {},
              type: 'text'
            };
            topResponses[questionName] = [];
          }

          // Type assertion for the structure
          ((questionAnalysis[questionName] as { total: number, responses: Record<string, number>, type?: string }).total)++;

          if (Array.isArray(response)) {
            ((questionAnalysis[questionName] as { total: number, responses: Record<string, number>, type?: string }).type) = 'checkbox';
            response.forEach((choice: string) => {
              const qa = questionAnalysis[questionName] as { total: number, responses: Record<string, number>, type?: string };
              qa.responses[choice] = (qa.responses[choice] || 0) + 1;
            });
          } else if (typeof response === 'string' && response.length > 0) {
            ((questionAnalysis[questionName] as { total: number, responses: Record<string, number>, type?: string }).type) = 'text';
            const qa = questionAnalysis[questionName] as { total: number, responses: Record<string, number>, type?: string };
            qa.responses[response] = (qa.responses[response] || 0) + 1;
          }
        });
      }
    });

    // Calculate top responses for each question
    Object.keys(questionAnalysis).forEach(questionName => {
      const responses = (questionAnalysis[questionName] as { responses: Record<string, number> }).responses;
      // noinspection UnnecessaryLocalVariableJS
      const sortedResponses = Object.entries(responses)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([response, count]) => ({ response, count }));

      topResponses[questionName] = sortedResponses;
    });

    // Response trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // const recentSubmissions = data.filter(s =>
    //     s.created_at && new Date(s.created_at) > sevenDaysAgo
    // );

    // const responseTrends = Array.from({ length: 7 }, (_, i) => {
    //   const date = new Date();
    //   date.setDate(date.getDate() - i);
    //   const daySubmissions = recentSubmissions.filter(s =>
    //       s.created_at && new Date(s.created_at).toDateString() === date.toDateString()
    //   );
    //   return {
    //     date: date.toLocaleDateString(),
    //     count: daySubmissions.length
    //   };
    // }).reverse();

    return {
      totalSubmissions,
      completionRate,
      averageCompletionTime,
      questionAnalysis: questionAnalysis as Record<string, QuestionAnalysis>,
      responseTrends: [], // fill as needed
      topResponses: topResponses as Record<string, TopResponse[]>,
    };
  };

  if (!isLoggedIn) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-600 mt-2">Sign in to view quiz analytics</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full"
                  />
                </div>

                {loginError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      {loginError}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                    size="lg"
                >
                  {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                  ) : (
                      'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quiz Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive analysis of quiz responses</p>
              </div>
              <div className="flex space-x-3">
                <Button
                    onClick={() => setShowPasswordDialog(true)}
                    variant="outline"
                    className="bg-gray-600 text-white hover:bg-gray-700 border-gray-600"
                >
                  Change Password
                </Button>
                <Button
                    onClick={handleLogout}
                    variant="destructive"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading analytics...</p>
              </div>
          ) : analyticsData ? (
              <div className="space-y-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="analytics-card analytics-card-hover rounded-xl p-6 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.totalSubmissions}</p>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-card analytics-card-hover rounded-xl p-6 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.completionRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-card analytics-card-hover rounded-xl p-6 bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analyticsData.averageCompletionTime > 0
                              ? `${Math.round(analyticsData.averageCompletionTime / 1000 / 60)}m`
                              : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="space-y-8">
                  {/* First Row - Completion Rate and Response Types */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CompletionRateChart
                        data={prepareChartData(analyticsData).completionTrend}
                        title="Completion Rate Trend"
                    />
                    <ResponseTypePieChart
                        data={prepareChartData(analyticsData).responseTypes}
                        title="Response Completion Status"
                    />
                  </div>

                  {/* Second Row - Question Responses and Time Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <QuestionResponseChart
                        data={prepareChartData(analyticsData).questionResponses}
                        title="Question Response Distribution"
                    />
                    <TimeAnalysisChart
                        data={prepareChartData(analyticsData).timeAnalysis}
                        title="Completion Time Analysis"
                    />
                  </div>

                  {/* Third Row - Satisfaction and Response Trends */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SatisfactionChart
                        data={prepareChartData(analyticsData).satisfactionData}
                        title="Satisfaction Ratings Distribution"
                    />
                    <ResponseTrendChart
                        data={prepareChartData(analyticsData).responseTrends}
                        title="Daily Response Trends"
                    />
                  </div>

                  {/* Fourth Row - Question Types */}
                  <div className="grid grid-cols-1 gap-6">
                    <QuestionTypeDoughnut
                        data={prepareChartData(analyticsData).questionTypes}
                        title="Question Types Distribution"
                    />
                  </div>
                </div>

                {/* Business Intelligence Section */}
                <BusinessInsights
                    businessInsights={businessInsights}
                    productInsights={productInsights}
                    salesOpportunities={salesOpportunities}
                />

                {/* Question Analysis */}
                <div className="analytics-card rounded-xl p-6 bg-white shadow-lg border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Question Response Analysis</h2>
                  <div className="space-y-6">
                    {Object.entries(analyticsData.questionAnalysis).map(([questionName, analysis]) => (
                        <div key={questionName} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3">{questionName}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Response Distribution</p>
                              <div className="space-y-2">
                                {analyticsData.topResponses[questionName]?.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700 truncate max-w-xs">
                                {item.response}
                              </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                          <div
                                              className="bg-blue-600 h-2 rounded-full"
                                              style={{
                                                width: `${(item.count / (analysis as { total: number, responses: Record<string, number>, type?: string }).total) * 100}%`
                                              }}
                                          ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 w-8 text-right">
                                  {item.count}
                                </span>
                                      </div>
                                    </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Summary</p>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Total Responses:</span> {(analysis as { total: number, responses: Record<string, number>, type?: string }).total}</p>
                                <p><span className="font-medium">Unique Answers:</span> {Object.keys((analysis as { total: number, responses: Record<string, number>, type?: string }).responses).length}</p>
                                <p><span className="font-medium">Question Type:</span> {(analysis as { total: number, responses: Record<string, number>, type?: string }).type}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Recent Submissions */}
                <div className="analytics-card rounded-xl p-6 bg-white shadow-lg border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Submissions</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 analytics-table rounded-lg overflow-hidden shadow-lg">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pages Completed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Agent
                        </th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.slice(0, 10).map((submission, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {submission.created_at ? new Date(submission.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              submission.submission_status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.submission_status}
                          </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {submission.completed_pages} / {submission.total_pages}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                              {submission.metadata?.user_agent || 'N/A'}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No analytics data available</p>
              </div>
          )}
        </div>

        <PasswordChangeDialog
            isOpen={showPasswordDialog}
            onClose={() => setShowPasswordDialog(false)}
        />
      </div>
  );
}
