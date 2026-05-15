import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../../store/ElectionContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";
import { PenSquare, Building2, CheckCircle, Check, X, AlertCircle } from "lucide-react";
import api from "../../api";

export default function APODashboard() {
  const navigate = useNavigate();
  const { booths, candidates, fetchMyBooths, fetchPublicResults, submitBooth } =
    useElection();
  const [section, setSection] = useState("entry");
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [used, setUsed] = useState("");
  const [candVotes, setCandVotes] = useState({});
  const [errors, setErrors] = useState([]);
  const [fraudWarn, setFraudWarn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [officer] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentOfficer")),
  );

  useEffect(() => {
    if (!officer) {
      navigate("/officer/apo");
      return;
    }
    fetchMyBooths();
    fetchPublicResults();
  }, []);

  // init candVotes keys when candidates load
  useEffect(() => {
    if (candidates.length > 0) {
      const init = {};
      candidates.forEach((c) => {
        init[c.candidateId] = "";
      });
      setCandVotes(init);
    }
  }, [candidates]);

  if (!officer) return null;

  // booth.boothId is number; officer.booths is array of numbers
  const myBooths = booths.filter((b) => officer.booths?.includes(b.boothId));
  const submittedBooths = myBooths.filter((b) => b.submitted);

  const validate = (issuedVal, usedVal, cvotes) => {
    const errs = [];
    const issuedN = parseInt(issuedVal) || 0;
    const usedN = parseInt(usedVal) || 0;
    const candTotal = Object.values(cvotes).reduce(
      (a, b) => a + (parseInt(b) || 0),
      0,
    );
    if (candTotal !== usedN && usedN > 0 && candTotal > 0)
      errs.push(`Candidate votes (${candTotal}) ≠ ballots used (${usedN})`);
    return errs;
  };

  const handleValidate = (
    issuedVal = selectedBooth?.issued || 0,
    usedVal = used,
    cvotes = candVotes,
  ) => {
    const errs = validate(issuedVal, usedVal, cvotes);
    setErrors(errs);

    const submitted = myBooths.filter((b) => b.submitted);
    if (submitted.length > 0 && parseInt(issuedVal) > 0) {
      const avg =
        submitted.reduce((a, b) => a + b.used / b.issued, 0) / submitted.length;
      const thisTurnout = parseInt(usedVal) / parseInt(issuedVal);
      setFraudWarn(Math.abs(thisTurnout - avg) > 0.2);
    }
  };

  const handleSubmit = async () => {
    const errs = validate(selectedBooth.issued, used, candVotes);
    if (errs.length > 0) return;
    const cv = {};
    candidates.forEach((c) => {
      cv[c.candidateId] = parseInt(candVotes[c.candidateId]) || 0;
    });
    setSubmitting(true);
    try {
      await submitBooth(selectedBooth.boothId, parseInt(used), cv);
      await fetchMyBooths();
      setSelectedBooth(null);
      setUsed("");
      const init = {};
      candidates.forEach((c) => {
        init[c.candidateId] = "";
      });
      setCandVotes(init);
      setErrors([]);
      setFraudWarn(false);
      setSection("submitted");
      toast.success("Booth submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit booth");
    } finally {
      setSubmitting(false);
    }
  };

  const sidebarItems = [
    { id: "entry", icon: <PenSquare size={16} />, label: "Vote Entry" },
    { id: "booths", icon: <Building2 size={16} />, label: "My Booths" },
    { id: "submitted", icon: <CheckCircle size={16} />, label: "Submitted" },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar
        title="ASST. PRESIDING OFFICER"
        subtitle={`Station ID: ${officer.stationId}`}
        backTo="/"
      />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          active={section}
          onSelect={setSection}
          accentColor="#e8b84b"
          officer={officer}
        />

        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          {/* VOTE ENTRY */}
          {section === "entry" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-1">
                <PenSquare size={24} className="text-yellow-400" /> Booth Vote
                Entry
              </div>
              <div className="text-xs text-white/30 mb-6">
                Enter vote counts from physical ballot papers
              </div>

              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-5 mb-5">
                <div className="text-[10px] tracking-widest text-yellow-400 mb-3">
                  SELECT BOOTH
                </div>
                <div className="flex flex-wrap gap-3">
                  {myBooths.map((b) => (
                    <button
                      key={b.boothId}
                      onClick={() => {
                        if (!b.submitted) {
                          setSelectedBooth(b);
                          setErrors([]);
                          setFraudWarn(false);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        b.submitted
                          ? "border-green-500/30 text-green-400 bg-green-500/10 cursor-not-allowed"
                          : selectedBooth?.boothId === b.boothId
                            ? "border-yellow-400 text-yellow-400 bg-yellow-500/15"
                            : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {b.submitted ? <Check size={16} className="inline mr-1" /> : ""}
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedBooth && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="text-[10px] tracking-widest text-white/30 mb-1">
                    ENTERING FOR
                  </div>
                  <div className="text-lg font-bold text-yellow-400 mb-5">
                    {selectedBooth.name}{" "}
                    <span className="text-white/30 text-sm font-normal">
                      (Issued: {selectedBooth.issued} ballots)
                    </span>
                  </div>

                  <div className="mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] tracking-widest text-white/30">
                          BALLOTS USED
                        </label>
                        <span className="text-yellow-400 font-bold">{used || 0}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={selectedBooth.issued}
                        value={used || 0}
                        onChange={(e) => {
                          const val = e.target.value;
                          setUsed(val);
                          handleValidate(selectedBooth.issued, val, candVotes);
                        }}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                      />
                      <div className="flex justify-between text-xs text-white/30 mt-1">
                        <span>0</span>
                        <span>{selectedBooth.issued}</span>
                      </div>
                    </div>

                  <div className="text-[10px] tracking-widest text-white/30 mb-3">
                    CANDIDATE VOTES
                  </div>
                  <div className="flex flex-col gap-3 mb-5">
                    {candidates.map((c) => (
                      <div
                        key={c.candidateId}
                        className="flex items-center gap-4"
                      >
                        <span className="text-xl w-8">{c.symbol}</span>
                        <span className="flex-1 text-sm">{c.name}</span>
                        <input
                          type="number"
                          value={candVotes[c.candidateId] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = {
                              ...candVotes,
                              [c.candidateId]: val,
                            };
                            setCandVotes(updated);
                            handleValidate(selectedBooth.issued, used, updated);
                          }}
                          placeholder="0"
                          className="w-28 px-3 py-2 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-yellow-500/50 transition-all placeholder:text-white/20"
                        />
                      </div>
                    ))}
                  </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                      {errors.map((e, i) => (
                        <div key={i} className="text-red-400 text-xs flex items-center gap-2">
                          <X size={14} /> {e}
                        </div>
                      ))}
                    </div>

                  {fraudWarn && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 mb-4 text-orange-400 text-xs flex items-center gap-2">
                      <AlertCircle size={14} />
                      Anomaly detected: turnout deviation exceeds 20% from
                      station average. Please double-check.
                    </div>
                  )}

                  {errors.length === 0 &&
                    used &&
                    Object.values(candVotes).some((v) => v) && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-4 text-green-400 text-xs flex items-center gap-2">
                        <Check size={14} /> All validations passed
                      </div>
                    )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setUsed("");
                        const init = {};
                        candidates.forEach((c) => {
                          init[c.candidateId] = "";
                        });
                        setCandVotes(init);
                        setErrors([]);
                      }}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        submitting ||
                        errors.length > 0 ||
                        !used ||
                        !Object.values(candVotes).some((v) => v)
                      }
                      className={`flex-[2] py-3 rounded-xl font-bold text-sm transition-all ${
                        !submitting &&
                        errors.length === 0 &&
                        used &&
                        Object.values(candVotes).some((v) => v)
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:brightness-110"
                          : "bg-white/5 text-white/20 cursor-not-allowed"
                      }`}
                    >
                      {submitting ? "Submitting..." : "Submit Booth Results →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MY BOOTHS */}
          {section === "booths" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <Building2 size={24} className="text-yellow-400" /> My Assigned
                Booths
              </div>
              <div className="flex flex-col gap-4">
                {myBooths.map((b) => (
                  <div
                    key={b.boothId}
                    className={`bg-white/[0.03] border rounded-2xl p-5 ${b.submitted ? "border-green-500/25" : "border-white/10"}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-base">{b.name}</div>
                        <div className="text-xs text-white/30 mt-1">
                          Issued: {b.issued} ballots
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          b.submitted
                            ? "bg-green-500/15 border-green-500/30 text-green-400"
                            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {b.submitted ? "SUBMITTED" : "PENDING"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMITTED */}
          {section === "submitted" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <CheckCircle size={24} className="text-yellow-400" /> Submitted
                Results
              </div>
              {submittedBooths.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  No booths submitted yet.
                </div>
              ) : (
                submittedBooths.map((b) => (
                  <div
                    key={b.boothId}
                    className="bg-white/[0.03] border border-green-500/20 rounded-2xl p-5 mb-4"
                  >
                    <div className="font-bold text-base mb-4 flex items-center gap-2">
                      <Check size={20} className="text-green-400" /> {b.name}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {candidates.map((c) => {
                        // candidateVotes from backend is a Map, might come as object
                        const cv =
                          b.candidateVotes instanceof Map
                            ? b.candidateVotes.get(String(c.candidateId))
                            : (b.candidateVotes?.[c.candidateId] ??
                              b.candidateVotes?.[String(c.candidateId)] ??
                              0);
                        return (
                          <div key={c.candidateId} className="text-sm">
                            {c.symbol} {c.name}:{" "}
                            <b className="text-yellow-400">{cv}</b>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-white/30 mt-3">
                      Used: {b.used} / Issued: {b.issued}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
