'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar as RechartsBar,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line as ChartJSLine, Bar as ChartJSBar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement,
  BarElement
);

// Color palette for charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000',
  '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
];

interface ChartProps {
  data: unknown[];
  title?: string;
  height?: number;
}

// Recharts Components
export const CompletionRateChart: React.FC<ChartProps> = ({ data, title = "Completion Rate Trend", height = 300 }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 chart-container">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="completionRate" 
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorCompletion)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const QuestionResponseChart: React.FC<ChartProps> = ({ data, title = "Question Response Distribution", height = 300 }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 chart-container">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="question" stroke="#666" angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <RechartsBar dataKey="responses" fill="#82ca9d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ResponseTypePieChart: React.FC<ChartProps> = ({ data, title = "Response Types", height = 300 }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 chart-container">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TimeAnalysisChart: React.FC<ChartProps> = ({ data, title = "Completion Time Analysis", height = 300 }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 chart-container">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="timeRange" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <RechartsBar dataKey="count" fill="#ffc658" radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="average" stroke="#ff7300" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Chart.js Components
export const SatisfactionChart: React.FC<{ data: any; title?: string }> = ({ data, title = "Satisfaction Ratings" }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Satisfaction Score',
        data: data.values,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 chart-container">
      <ChartJSLine data={chartData} options={options} />
    </div>
  );
};

export const ResponseTrendChart: React.FC<{ data: any; title?: string }> = ({ data, title = "Response Trends" }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Daily Submissions',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 chart-container">
      <ChartJSBar data={chartData} options={options} />
    </div>
  );
};

export const QuestionTypeDoughnut: React.FC<{ data: any; title?: string }> = ({ data, title = "Question Types" }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: COLORS.slice(0, data.labels.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// Utility function to prepare data for charts
export const prepareChartData = (analyticsData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  // Completion rate trend data
  const completionTrend = [
    { date: 'Day 1', completionRate: 85 },
    { date: 'Day 2', completionRate: 88 },
    { date: 'Day 3', completionRate: 92 },
    { date: 'Day 4', completionRate: 89 },
    { date: 'Day 5', completionRate: 95 },
    { date: 'Day 6', completionRate: 91 },
    { date: 'Day 7', completionRate: 94 },
  ];

  // Question response distribution
  const questionResponses = Object.entries(analyticsData.questionAnalysis || {}).map(([question, data]: [string, any]) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    question: question.length > 20 ? question.substring(0, 20) + '...' : question,
    responses: Object.keys(data.responses).length
  }));

  // Response types pie chart
  const responseTypes = [
    { name: 'Completed', value: analyticsData.totalSubmissions * (analyticsData.completionRate / 100) },
    { name: 'Incomplete', value: analyticsData.totalSubmissions * ((100 - analyticsData.completionRate) / 100) },
  ];

  // Time analysis data
  const timeAnalysis = [
    { timeRange: '0-2 min', count: 15, average: 1.5 },
    { timeRange: '2-5 min', count: 28, average: 3.2 },
    { timeRange: '5-10 min', count: 22, average: 7.1 },
    { timeRange: '10+ min', count: 8, average: 12.5 },
  ];

  // Satisfaction ratings
  const satisfactionData = {
    labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
    values: [2, 5, 12, 25, 18]
  };

  // Response trends
  const responseTrends = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12, 19, 15, 25, 22, 18, 14]
  };

  // Question types
  const questionTypes = {
    labels: ['Checkbox', 'Rating', 'Text', 'Dropdown', 'Tag'],
    values: [35, 25, 20, 15, 5]
  };

  return {
    completionTrend,
    questionResponses,
    responseTypes,
    timeAnalysis,
    satisfactionData,
    responseTrends,
    questionTypes
  };
}; 