'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, Download, AlertCircle, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { use } from 'react';

export default function ResultsPage({ params }) {
  const router = useRouter();
  const { screeningId } = use(params);
  const [screening, setScreening] = useState(null);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching screening:', screeningId); // Debug log

        const sRes = await fetch(`/api/screenings/${screeningId}`);
        console.log('Screening response status:', sRes.status); // Debug log

        if (!sRes.ok) {
          console.log('Screening not ok, redirecting'); // Debug log
          router.push('/dashboard/parent');
          return;
        }
        const screeningData = await sRes.json();
        console.log('Screening data:', screeningData); // Debug log
        setScreening(screeningData);

        // Fetch child via children API
        const cRes = await fetch('/api/children');
        const children = await cRes.json();
        console.log('Children:', children); // Debug log
        const found = children.find((c) => c.id === screeningData.childId);
        console.log('Found child:', found); // Debug log
        setChild(found || null);
      } catch {
        console.log('Error:', err); // Debug log
        router.push('/dashboard/parent');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [screeningId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!screening || !child) return null;

  const { riskAssessment } = screening;
  if (!riskAssessment) return null;


  const getRiskIcon = () => {
    switch (riskAssessment.level) {
      case 'low': return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'medium': return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case 'high': return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getRiskColor = () => {
    switch (riskAssessment.level) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-red-50 border-red-200';
    }
  };

  const getRiskBadgeColor = () => {
    switch (riskAssessment.level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  const scorePercentage = (riskAssessment.score / 15) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/parent">
        <Button variant="ghost">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold mb-2">Screening Results</h1>
        <p className="text-gray-600">
          {child.name} • Completed {formatDate(screening.submittedAt || screening.createdAt)}
        </p>
      </div>

      {/* Risk Level */}
      <Card className={getRiskColor()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getRiskIcon()}
              <div>
                <CardTitle className="text-2xl">
                  {riskAssessment.level.charAt(0).toUpperCase() + riskAssessment.level.slice(1)} Risk
                </CardTitle>
                <CardDescription>Score: {riskAssessment.score.toFixed(1)} / 15</CardDescription>
              </div>
            </div>
            <Badge className={getRiskBadgeColor()}>{riskAssessment.level.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={scorePercentage} className="mb-4" />
          <p className="text-sm text-gray-700">
            Based on questionnaire responses
            {screening.videos?.length > 0 ? ' and uploaded videos' : ''}.
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Next steps based on screening results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskAssessment.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <p className="text-gray-700">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Questionnaire Summary</CardTitle>
          <CardDescription>
            {screening.questionnaireResponses?.length ?? 0} questions answered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {screening.questionnaireResponses?.length ?? 0}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{screening.questionnaireScore}</div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{screening.videos?.length ?? 0}</div>
              <div className="text-sm text-gray-600">Videos Uploaded</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Medical Disclaimer</AlertTitle>
        <AlertDescription>
          This screening tool provides preliminary assessment only and does not constitute a medical
          diagnosis. Always consult with qualified healthcare professionals for comprehensive
          evaluation and diagnosis of autism spectrum disorder.
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button onClick={() => router.push('/dashboard/parent')}>Return to Dashboard</Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" />
          Print Results
        </Button>
      </div>
    </div>
  );
}