"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getAgeGroup } from "@/config/ageGroups";
import { getQuestionnaireByAge } from "@/config/questionnaires";
import { generateId } from "@/lib/utils";
import { use } from "react";

export default function ScreeningPage({ params }) {
  const router = useRouter();
  const { user } = useUser();
  const { childId } = use(params);
  const [child, setChild] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState({});

  useEffect(() => {
    async function fetchChild() {
      try {
        const res = await fetch("/api/children");
        const children = await res.json();
        const found = children.find((c) => c.id === childId);
        if (!found) {
          toast.error("Child not found");
          router.push("/dashboard/parent");
          return;
        }
        setChild(found);
      } catch {
        toast.error("Failed to load child data");
        router.push("/dashboard/parent");
      }
    }
    fetchChild();
  }, [childId, router]);

  const questionnaire = (() => {
    if (!child) return null;
    try {
      const ageGroup = getAgeGroup(child.dateOfBirth);
      if (!ageGroup) return null;
      return getQuestionnaireByAge(ageGroup);
    } catch {
      return null;
    }
  })();

  if (!child || !questionnaire) {
    if (child && !questionnaire) {
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/parent")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-8 text-center">
              <p className="text-yellow-800 font-medium">
                Screening is available for children aged 6 months to 5 years.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const totalSections = questionnaire.sections.length + 1;
  const progress = ((currentSection + 1) / totalSections) * 100;
  const currentSectionData = questionnaire.sections[currentSection];
  const isCurrentSectionComplete =
    currentSection < questionnaire.sections.length &&
    currentSectionData.questions.every((q) => responses[q.id]);

  function handleAnswerChange(questionId, answer, points) {
    setResponses({
      ...responses,
      [questionId]: { questionId, answer, points },
    });
  }

  function handleNextSection() {
    if (currentSection < questionnaire.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setCurrentSection(questionnaire.sections.length);
    }
  }

  function handlePreviousSection() {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  }

  async function handleVideoUpload(e, category) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video too large. Maximum size is 100MB");
      return;
    }

    setUploadingVideos((prev) => ({ ...prev, [category]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "autism_screening");
      formData.append("folder", `autism-screening/${user.id}/${childId}`);
      formData.append("resource_type", "video");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const metadata = {
        id: generateId("video"),
        name: file.name,
        type: file.type,
        size: file.size,
        duration: data.duration || 0,
        uploadedAt: new Date().toISOString(),
        category,
        url: data.secure_url,
        publicId: data.public_id,
      };

      // Replace if same category already uploaded
      setVideos((prev) => [
        ...prev.filter((v) => v.category !== category),
        metadata,
      ]);
      toast.success(`${category} video uploaded!`);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(`Failed to upload ${category} video`);
    } finally {
      setUploadingVideos((prev) => ({ ...prev, [category]: false }));
    }
  }

  function calculateResults() {
    const allResponses = Object.values(responses);
    const totalScore = allResponses.reduce((sum, r) => sum + r.points, 0);

    const criticalItemsCount = allResponses.filter((r) => {
      const question = questionnaire.sections
        .flatMap((s) => s.questions)
        .find((q) => q.id === r.questionId);
      return question?.isCritical && r.points > 0;
    }).length;

    let riskLevel = "low";
    if (totalScore >= questionnaire.riskThresholds.high) {
      riskLevel = "high";
    } else if (totalScore >= questionnaire.riskThresholds.medium) {
      riskLevel = "medium";
    } else if (criticalItemsCount >= questionnaire.criticalItemsThreshold) {
      riskLevel = "medium";
    }

    return { responses: allResponses, totalScore, criticalItemsCount, riskLevel };
  }

  function getRecommendations(riskLevel) {
    switch (riskLevel) {
      case "low":
        return [
          "Your child is showing typical developmental patterns",
          "Continue regular developmental monitoring",
          "You can repeat this screening in 3-6 months if desired",
        ];
      case "medium":
        return [
          "Some responses indicate areas to monitor",
          "Discuss these results with your pediatrician",
          "Consider repeating this screening in 1-2 months",
          "Early intervention can be beneficial",
        ];
      case "high":
        return [
          "Multiple responses indicate need for further evaluation",
          "Schedule an appointment with your pediatrician soon",
          "Request a referral to a developmental specialist",
          "Early intervention services can begin before formal diagnosis",
        ];
    }
  }

  async function handleSubmit() {
    if (!user || !child) return;

    if (Object.values(uploadingVideos).some(Boolean)) {
      toast.error("Please wait for videos to finish uploading");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = calculateResults();
      const screening = {
        id: generateId("screening"),
        childId: child.id,
        parentId: user.id,
        status: "submitted",
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        questionnaireResponses: result.responses,
        questionnaireScore: result.totalScore,
        videos,
        riskAssessment: {
          level: result.riskLevel,
          score: result.totalScore,
          questionnaireScore: result.totalScore,
          videoScore: 0,
          breakdown: { questionnaireWeight: 1.0, videoWeight: 0 },
          recommendations: getRecommendations(result.riskLevel),
          generatedAt: new Date().toISOString(),
        },
      };

      const res = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(screening),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Screening submitted successfully!");
      router.push(`/dashboard/parent/screening/result/${screening.id}`);
    } catch (err) {
      toast.error("Failed to submit screening");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Questionnaire Section ──
  if (currentSection < questionnaire.sections.length) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/parent")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div>
          <h1 className="text-3xl font-bold mb-2">
            Screening for {child.name}
          </h1>
          <p className="text-gray-600">{questionnaire.name}</p>
        </div>

        <Progress value={progress} className="w-full" />

        <Card>
          <CardHeader>
            <CardTitle>{currentSectionData.title}</CardTitle>
            <CardDescription>
              Section {currentSection + 1} of {questionnaire.sections.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSectionData.questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-gray-700">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900">{question.text}</p>
                    {question.isCritical && (
                      <Badge variant="outline" className="mt-2">
                        Critical Item
                      </Badge>
                    )}
                  </div>
                </div>
                <RadioGroup
                  value={responses[question.id]?.answer}
                  onValueChange={(value) => {
                    const option = question.options.find(
                      (o) => o.value === value
                    );
                    if (option)
                      handleAnswerChange(question.id, value, option.points);
                  }}
                  className="ml-6"
                >
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${question.id}-${option.value}`}
                      />
                      <Label
                        htmlFor={`${question.id}-${option.value}`}
                        className="cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousSection}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNextSection}
            disabled={!isCurrentSectionComplete}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Video Upload Section ──
  const videoCategories = ["social", "play", "free"];
  const videoLabels = {
    social: {
      title: "Social Interaction Video",
      desc: "30-60 seconds of your child interacting with you",
    },
    play: {
      title: "Play Activity Video",
      desc: "30-60 seconds of your child playing with toys",
    },
    free: {
      title: "Free Play Video",
      desc: "30-60 seconds of your child playing independently",
    },
  };

  const anyUploading = Object.values(uploadingVideos).some(Boolean);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => setCurrentSection(currentSection - 1)}
        disabled={anyUploading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Questions
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2">Video Upload (Optional)</h1>
        <p className="text-gray-600">
          Upload videos to enhance screening accuracy
        </p>
      </div>

      <Progress value={100} className="w-full" />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Videos are optional but recommended. They help analyze behavioral
          patterns more accurately using AI.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {videoCategories.map((category) => {
          const isUploaded = videos.find((v) => v.category === category);
          const isUploading = uploadingVideos[category];

          return (
            <Card
              key={category}
              className={`transition-all duration-300 ${
                isUploaded ? "border-emerald-200 bg-emerald-50/30" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {videoLabels[category].title}
                  {isUploaded && (
                    <span className="text-xs font-normal text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Uploaded
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{videoLabels[category].desc}</CardDescription>
              </CardHeader>
              <CardContent>
                {isUploading ? (
                  // ── Uploading state ──
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-violet-600">
                      <div className="w-5 h-5 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin flex-shrink-0" />
                      <span className="text-sm font-medium">
                        Uploading video to cloud...
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-1.5 rounded-full bg-violet-400 animate-pulse w-3/4" />
                    </div>
                    <p className="text-xs text-gray-400">
                      This may take a moment for large files. Please don&apos;t
                      close the page.
                    </p>
                  </div>
                ) : isUploaded ? (
                  // ── Uploaded state ──
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-emerald-600">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">
                          Video uploaded successfully
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {isUploaded.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(e) => handleVideoUpload(e, category)}
                        className="hidden"
                        id={`${category}-video-replace`}
                      />
                      <label
                        htmlFor={`${category}-video-replace`}
                        className="text-xs text-gray-400 hover:text-violet-600 cursor-pointer underline"
                      >
                        Replace
                      </label>
                    </div>
                  </div>
                ) : (
                  // ── Default upload state ──
                  <div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => handleVideoUpload(e, category)}
                      className="hidden"
                      id={`${category}-video`}
                    />
                    <label
                      htmlFor={`${category}-video`}
                      className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-violet-400 hover:bg-violet-50 cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center transition-all">
                        <Upload className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-all" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 group-hover:text-violet-600">
                          Click to upload video
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          MP4, WebM, MOV up to 100MB
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={isSubmitting || anyUploading}
        >
          Skip Videos &amp; Submit
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || anyUploading}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analyzing &amp; Submitting...
            </span>
          ) : anyUploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Waiting for uploads...
            </span>
          ) : (
            "Submit Screening"
          )}
        </Button>
      </div>
    </div>
  );
}