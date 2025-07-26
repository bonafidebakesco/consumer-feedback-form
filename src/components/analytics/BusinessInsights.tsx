'use client';

import React from 'react';
import { BusinessInsight, ProductInsight, SalesOpportunity } from '@/lib/businessAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BusinessInsightsProps {
  businessInsights: BusinessInsight[];
  productInsights: ProductInsight[];
  salesOpportunities: SalesOpportunity[];
}

export const BusinessInsights: React.FC<BusinessInsightsProps> = ({
  businessInsights,
  productInsights,
  salesOpportunities
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRevenueColor = (revenue: string) => {
    switch (revenue) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Business Insights Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Key Business Insights
            </CardTitle>
            <CardDescription>
              Actionable intelligence from customer feedback analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getImpactColor(insight.impact)}>
                    {insight.impact.toUpperCase()} IMPACT
                  </Badge>
                  <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}% confidence
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{insight.category}</h4>
                <p className="text-sm text-gray-600 mb-3">{insight.insight}</p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <p className="text-sm text-blue-800 font-medium">Recommendation:</p>
                  <p className="text-sm text-blue-700">{insight.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="chart-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sales Opportunities
            </CardTitle>
            <CardDescription>
              Revenue-generating opportunities identified from customer feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesOpportunities.slice(0, 3).map((opportunity, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-purple-100 text-purple-800">
                    {opportunity.type.toUpperCase()}
                  </Badge>
                  <Badge className={getRevenueColor(opportunity.potentialRevenue)}>
                    {opportunity.potentialRevenue.toUpperCase()} REVENUE
                  </Badge>
                  <Badge className={getEffortColor(opportunity.effort)}>
                    {opportunity.effort.toUpperCase()} EFFORT
                  </Badge>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{opportunity.description}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Target:</span> {opportunity.targetSegment}</p>
                  <p><span className="font-medium">Timeframe:</span> {opportunity.timeframe}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Analysis */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Product Performance Analysis
          </CardTitle>
          <CardDescription>
            Detailed insights for each product category and specific products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productInsights.map((product, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 capitalize">{product.productName}</h4>
                  <Badge className={
                    product.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    product.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {product.sentiment}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Satisfaction Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= product.satisfaction ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{product.satisfaction}/5</span>
                    </div>
                  </div>

                  {product.painPoints.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Pain Points</p>
                      <div className="flex flex-wrap gap-1">
                        {product.painPoints.map((point, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.opportunities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Opportunities</p>
                      <div className="flex flex-wrap gap-1">
                        {product.opportunities.map((opportunity, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                            {opportunity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.competitiveAdvantage.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Competitive Advantages</p>
                      <div className="flex flex-wrap gap-1">
                        {product.competitiveAdvantage.map((advantage, idx) => (
                          <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items Dashboard */}
      <Card className="chart-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Priority Action Items
          </CardTitle>
          <CardDescription>
            Immediate actions to improve business performance based on insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High Impact Actions */}
            <div>
              <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                High Priority (Immediate Action Required)
              </h4>
              <div className="space-y-3">
                {businessInsights
                  .filter(insight => insight.impact === 'high')
                  .slice(0, 3)
                  .map((insight, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800">{insight.category}</p>
                      <p className="text-sm text-red-700 mt-1">{insight.recommendation}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Medium Impact Actions */}
            <div>
              <h4 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Medium Priority (Plan for Next Quarter)
              </h4>
              <div className="space-y-3">
                {businessInsights
                  .filter(insight => insight.impact === 'medium')
                  .slice(0, 3)
                  .map((insight, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-800">{insight.category}</p>
                      <p className="text-sm text-yellow-700 mt-1">{insight.recommendation}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 