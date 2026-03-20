import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../../store/ElectionContext";
import { CANDIDATES, BOOTHS, STATIONS } from "../../data/mockData";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VoteBar from "../../components/VoteBar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

export default function APODashboard() {
  const navigate = useNavigate();
  const { booths, submitBooth } = useElection();
  const [section, setSection] = useState("entry");
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [issued, setIssued] = useState("");
  const [used, setUsed] = useState("");
  const [candVotes, setCandVotes] = useState({ 1: "", 2: "", 3: "", 4: "" });
  const [errors, setErrors] = useState([]);
  const [fraudWarn, setFraudWarn] = useState(false);
  const [officer, setOfficer] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentOfficer")),
  );

  if (!officer) {
    navigate("/officer/apo");
    return null;
  }

  const myBooths = booths.filter((b) => officer.booths.includes(b.id));
  const submittedBooths = myBooths.filter((b) => b.submitted);

  const validate = (issuedVal, usedVal, cvotes) => {
    const errs = [];
    const issuedN = parseInt(issuedVal) || 0;
    const usedN = parseInt(usedVal) || 0;
    const candTotal = Object.values(cvotes).reduce(
      (a, b) => a + (parseInt(b) || 0),
      0,
    );
    if (usedN > issuedN) errs.push("Votes used exceeds issued ballots");
    if (candTotal > usedN && usedN > 0)
      errs.push("Candidate total exceeds ballots used");
    if (candTotal !== usedN && usedN > 0 && candTotal > 0)
      errs.push(`Candidate votes (${candTotal}) ≠ ballots used (${usedN})`);
    return errs;
  };

  const handleValidate = () => {
    const errs = validate(issued, used, candVotes);
    setErrors(errs);
    // fraud detection: turnout deviation
    const submitted = myBooths.filter((b) => b.submitted);
    if (submitted.length > 0 && parseInt(issued) > 0) {
      const avg =
        submitted.reduce((a, b) => a + b.used / b.issued, 0) / submitted.length;
      const thisTurnout = parseInt(used) / parseInt(issued);
      setFraudWarn(Math.abs(thisTurnout - avg) > 0.2);
    }
  };

  const handleSubmit = () => {
    const errs = validate(issued, used, candVotes);
    if (errs.length > 0) return;
    const cv = {};
    CANDIDATES.forEach((c) => {
      cv[c.id] = parseInt(candVotes[c.id]) || 0;
    });
    submitBooth(selectedBooth.id, parseInt(used), cv, officer.name);
    setSelectedBooth(null);
    setIssued("");
    setUsed("");
    setCandVotes({ 1: "", 2: "", 3: "", 4: "" });
    setErrors([]);
    setFraudWarn(false);
    setSection("submitted");
  };

  const sidebarItems = [
    { id: "entry", icon: "📝", label: "Vote Entry" },
    { id: "booths", icon: "🏫", label: "My Booths" },
    { id: "submitted", icon: "✅", label: "Submitted" },
  ];

  const station = STATIONS.find((s) => s.id === officer.station);

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar
        title="ASST. PRESIDING OFFICER"
        subtitle={station?.name}
        backTo="/"
      />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          active={section}
          onSelect={setSection}
          accentColor="#e8b84b"
          officer={officer}
          onLogout={() => {
            sessionStorage.clear();
            toast.success("Logged out successfully");
            navigate("/");
          }}
        />

        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          {/* VOTE ENTRY */}
          {section === "entry" && (
            <div>
              <div className="text-2xl font-bold mb-1">📝 Booth Vote Entry</div>
              <div className="text-xs text-white/30 mb-6">
                Enter vote counts from physical ballot papers
              </div>

              {/* booth selector */}
              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-5 mb-5">
                <div className="text-[10px] tracking-widest text-yellow-400 mb-3">
                  SELECT BOOTH
                </div>
                <div className="flex flex-wrap gap-3">
                  {myBooths.map((b) => (
                    <button
                      key={b.id}
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
                          : selectedBooth?.id === b.id
                            ? "border-yellow-400 text-yellow-400 bg-yellow-500/15"
                            : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {b.submitted ? "✓ " : ""}
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

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="text-[10px] tracking-widest text-white/30 block mb-2">
                        BALLOTS ISSUED
                      </label>
                      <input
                        type="number"
                        value={issued}
                        onChange={(e) => {
                          setIssued(e.target.value);
                          handleValidate();
                        }}
                        placeholder="e.g. 800"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-yellow-500/50 transition-all placeholder:text-white/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-widest text-white/30 block mb-2">
                        BALLOTS USED
                      </label>
                      <input
                        type="number"
                        value={used}
                        onChange={(e) => {
                          setUsed(e.target.value);
                          handleValidate();
                        }}
                        placeholder="e.g. 642"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-yellow-500/50 transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] tracking-widest text-white/30 mb-3">
                    CANDIDATE VOTES
                  </div>
                  <div className="flex flex-col gap-3 mb-5">
                    {CANDIDATES.map((c) => (
                      <div key={c.id} className="flex items-center gap-4">
                        <span className="text-xl w-8">{c.symbol}</span>
                        <span className="flex-1 text-sm">{c.name}</span>
                        <input
                          type="number"
                          value={candVotes[c.id]}
                          onChange={(e) => {
                            const updated = {
                              ...candVotes,
                              [c.id]: e.target.value,
                            };
                            setCandVotes(updated);
                            handleValidate();
                          }}
                          placeholder="0"
                          className="w-28 px-3 py-2 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none focus:border-yellow-500/50 transition-all placeholder:text-white/20"
                        />
                      </div>
                    ))}
                  </div>

                  {/* validation errors */}
                  {errors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                      {errors.map((e, i) => (
                        <div key={i} className="text-red-400 text-xs">
                          ✗ {e}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* fraud warning */}
                  {fraudWarn && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 mb-4 text-orange-400 text-xs">
                      ⚠ Anomaly detected: turnout deviation exceeds 20% from
                      station average. Please double-check.
                    </div>
                  )}

                  {errors.length === 0 &&
                    used &&
                    Object.values(candVotes).some((v) => v) && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-4 text-green-400 text-xs">
                        ✓ All validations passed
                      </div>
                    )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIssued("");
                        setUsed("");
                        setCandVotes({ 1: "", 2: "", 3: "", 4: "" });
                        setErrors([]);
                      }}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        errors.length > 0 ||
                        !used ||
                        !Object.values(candVotes).some((v) => v)
                      }
                      className={`flex-[2] py-3 rounded-xl font-bold text-sm transition-all ${
                        errors.length === 0 &&
                        used &&
                        Object.values(candVotes).some((v) => v)
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:brightness-110"
                          : "bg-white/5 text-white/20 cursor-not-allowed"
                      }`}
                    >
                      Submit Booth Results →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MY BOOTHS */}
          {section === "booths" && (
            <div>
              <div className="text-2xl font-bold mb-6">
                🏫 My Assigned Booths
              </div>
              <div className="flex flex-col gap-4">
                {myBooths.map((b) => (
                  <div
                    key={b.id}
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
              <div className="text-2xl font-bold mb-6">
                ✅ Submitted Results
              </div>
              {submittedBooths.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  No booths submitted yet.
                </div>
              ) : (
                submittedBooths.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white/[0.03] border border-green-500/20 rounded-2xl p-5 mb-4"
                  >
                    <div className="font-bold text-base mb-4">✅ {b.name}</div>
                    <div className="grid grid-cols-2 gap-3">
                      {CANDIDATES.map((c) => (
                        <div key={c.id} className="text-sm">
                          {c.symbol} {c.name}:{" "}
                          <b className="text-yellow-400">
                            {b.candidateVotes[c.id]}
                          </b>
                        </div>
                      ))}
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
