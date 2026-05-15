import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Galaxy from "../reactbits/Galaxy";
import toast from "react-hot-toast";
import { AlertTriangle, ChevronUp, MapPin, Clock, User, Radio } from "lucide-react";
import api from "../api";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ReportFeed() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const voter = (() => {
    try { return JSON.parse(sessionStorage.getItem("currentVoter")); }
    catch { return null; }
  })();
  const token = sessionStorage.getItem("token");

  const fetchReports = useCallback(async () => {
    try {
      const { data } = await api.get("/api/reports");
      setReports(data.reports || []);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleUpvote = async (reportId) => {
    if (!voter || !token) {
      toast.error("Login as a voter to upvote");
      return;
    }
    setUpvoting(reportId);
    try {
      const { data } = await api.post(
        `/api/reports/${reportId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(prev =>
        prev
          .map(r => r._id === reportId ? { ...r, upvotes: data.upvotes } : r)
          .sort((a, b) => b.upvotes - a.upvotes)
      );
      toast.success("Upvoted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upvote");
    } finally {
      setUpvoting(null);
    }
  };

  const credibilityLabel = (upvotes) => {
    if (upvotes >= 10) return { text: "High Credibility", color: "#22c55e" };
    if (upvotes >= 5)  return { text: "Gaining Traction", color: "#f59e0b" };
    return { text: "Unverified", color: "#6b7280" };
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col relative">
      <div className="relative z-10">
        <Navbar
          title="FIELD REPORTS"
          subtitle="Citizen Incident Feed"
          backTo="/"
        />
      </div>

      {/* galaxy full page background */}
      <div className="fixed inset-0 opacity-40 pointer-events-none z-0">
        <Galaxy
          hueShift={200}
          density={1.2}
          glowIntensity={0.25}
          rotationSpeed={0.03}
          twinkleIntensity={0.4}
          transparent={true}
        />
      </div>

      {/* hero text */}
      <div className="relative z-10 flex flex-col items-center justify-center py-12 px-4">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={18} className="text-red-400 animate-pulse" />
          <span className="text-[10px] tracking-widest text-red-400">LIVE CITIZEN REPORTS</span>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-center">Voting Center Watch</div>
        <div className="text-xs text-white/40 mt-2 text-center max-w-md">
          Reports are ranked by community upvotes. More upvotes = more credible.
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
          <span><b className="text-white">{reports.length}</b> reports</span>
          {voter && (
            <span className="text-green-400">✓ Logged in as {voter.name}</span>
          )}
          {!voter && (
            <button
              onClick={() => navigate("/voter/login")}
              className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
            >
              Login to upvote
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-12">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-24">
            <AlertTriangle size={48} className="text-white/20 mx-auto mb-4" />
            <div className="text-white/40 text-lg">No reports yet</div>
            <div className="text-white/20 text-sm mt-1">Login as a voter to submit the first report</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map((r, idx) => {
              const cred = credibilityLabel(r.upvotes);
              const isExpanded = expanded === r._id;
              return (
                <div
                  key={r._id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20"
                >
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* upvote column */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleUpvote(r._id)}
                          disabled={upvoting === r._id}
                          className="flex flex-col items-center gap-0.5 group"
                        >
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                            upvoting === r._id
                              ? "border-white/10 text-white/20"
                              : "border-white/15 text-white/40 hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/10"
                          }`}>
                            <ChevronUp size={18} />
                          </div>
                          <span className="text-sm font-bold text-white/70">{r.upvotes}</span>
                        </button>
                        {idx === 0 && r.upvotes > 0 && (
                          <span className="text-[9px] text-yellow-400 tracking-wider">TOP</span>
                        )}
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                            style={{ color: cred.color, borderColor: cred.color + "44", background: cred.color + "15" }}
                          >
                            {cred.text}
                          </span>
                        </div>

                        <p className="text-sm text-white/80 leading-relaxed mb-3">
                          {r.description}
                        </p>

                        <div className="flex flex-wrap gap-3 text-xs text-white/30">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {r.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={11} /> {r.voterName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {timeAgo(r.createdAt)}
                          </span>
                        </div>

                        {r.photo && (
                          <button
                            onClick={() => setExpanded(isExpanded ? null : r._id)}
                            className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-all"
                          >
                            {isExpanded ? "Hide photo ↑" : "View photo ↓"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* photo expand */}
                    {isExpanded && r.photo && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black">
                        <img
                          src={r.photo}
                          alt="Report evidence"
                          className="w-full max-h-96 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
