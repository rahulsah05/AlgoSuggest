import { DashboardLayout } from "@/components/DashboardLayout";
import { Upload, FileUp, Loader2, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LOADING_STEPS = [
  "Uploading dataset...",
  "Cleaning and preprocessing...",
  "Detecting features...",
  "Training models...",
  "Evaluating results...",
];

const UploadPage = () => {
  const [file, setFile]         = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const navigate = useNavigate();

  // Cycle through loading step messages so the user sees progress
  const startLoadingCycle = () => {
    setLoadingStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < LOADING_STEPS.length) {
        setLoadingStep(step);
      } else {
        clearInterval(interval);
      }
    }, 3500);
    return interval;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleAnalyze = async () => {
    if (!file || isLoading) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    const interval = startLoadingCycle();

    try {
      const res = await axios.post("http://localhost:8000/train", formData, {
        // Long timeout — large datasets can take a while
        timeout: 120_000,
      });

      clearInterval(interval);
      const data = res.data;

      if (data.error) {
        navigate("/result", { state: { error: data.error, debug: data.debug } });
        return;
      }

      navigate("/result", { state: data });

    } catch (error: any) {
      clearInterval(interval);

      const msg = error?.code === "ECONNABORTED"
        ? "Request timed out. Your dataset may be too large — try a smaller sample."
        : error?.response?.data?.detail
          ?? "Failed to connect to backend. Make sure the server is running on port 8000.";

      navigate("/result", { state: { error: msg } });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Upload Dataset">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Upload Dataset
          </h2>
          <p className="text-muted-foreground text-sm">
            Upload your CSV file to begin analysis
          </p>
        </div>

        {/* Drop zone — disabled while loading */}
        <div
          onDragOver={(e) => { if (!isLoading) { e.preventDefault(); setDragging(true); } }}
          onDragLeave={() => setDragging(false)}
          onDrop={isLoading ? undefined : handleDrop}
          className={`glass-card p-12 flex flex-col items-center justify-center text-center transition-colors
            ${isLoading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-muted-foreground/30"
            }
            ${dragging ? "border-primary bg-primary/5" : ""}
          `}
          onClick={() => {
            if (!isLoading) document.getElementById("file-input")?.click();
          }}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.json,.txt,.parquet"
            disabled={isLoading}
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />

          <Upload className="h-8 w-8 text-primary mb-4" />

          <p className="text-foreground font-medium mb-1">
            {file ? file.name : "Drag & drop your file here"}
          </p>

          <p className="text-sm text-muted-foreground">
            {file
              ? `${(file.size / 1024).toFixed(1)} KB`
              : "or click to browse — CSV, Excel, JSON, Parquet"
            }
          </p>
        </div>

        {/* File info + Analyze button */}
        {file && !isLoading && (
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileUp className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Clear file */}
              <button
                onClick={() => setFile(null)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                onClick={handleAnalyze}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {/* Loading state card — replaces the file card while running */}
        {isLoading && (
          <div className="glass-card p-5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground mb-1">
                  {LOADING_STEPS[loadingStep]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {file?.name} · {(file?.size ?? 0 / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            {/* Animated progress bar */}
            <div className="mt-4 bg-secondary rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-[3500ms] ease-in-out"
                style={{
                  width: `${Math.min(95, ((loadingStep + 1) / LOADING_STEPS.length) * 100)}%`
                }}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              This may take up to 30 seconds for large datasets
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
