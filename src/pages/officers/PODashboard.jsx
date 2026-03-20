import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../../store/ElectionContext";
import { CANDIDATES, BOOTHS, STATIONS, VOTERS } from "../../data/mockData";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VoteBar from "../../components/VoteBar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";
import { LayoutDashboard, Search, Users, AlertTriangle } from "lucide-react";
import { Vote, TrendingUp, Building2 } from "lucide-react";
import StatCard from "../../components/StatCard";
export default function PODashboard() {
  const navigate = useNavigate();
  const {
    booths,
    stations,
    incidents,
    verifyStation,
    reportIncident,
    totalVotes,
    turnout,
  } = useElection();
  const [section, setSection] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [officer] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentOfficer")),
  );

  if (!officer) {
    navigate("/officer/po");
    return null;
  }

  const station = stations.find((s) => s.id === officer.station);
  const stationBooths = booths.filter((b) => b.station === officer.station);
  const submittedBooths = stationBooths.filter((b) => b.submitted);
  const stationTotal = submittedBooths.reduce(
    (a, b) => a + Object.values(b.candidateVotes).reduce((x, y) => x + y, 0),
    0,
  );

  const handleVerify = () => {
    if (station?.verified) {
      toast.error("Station already verified");
      return;
    }
    setShowModal(true);
  };

  const confirmVerify = () => {
    verifyStation(officer.station, officer.name);
    setShowModal(false);
    toast.success("Station result submitted to ARO");
  };

  const sidebarItems = [
    { id: "overview", icon: <LayoutDashboard size={16} />, label: "Overview" },
    { id: "verify", icon: <Search size={16} />, label: "Verify Booths" },
    { id: "voters", icon: <Users size={16} />, label: "Voter List" },
    { id: "incidents", icon: <AlertTriangle size={16} />, label: "Incidents" },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar title="PRESIDING OFFICER" subtitle={station?.name} backTo="/" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          active={section}
          onSelect={setSection}
          accentColor="#e67e22"
          officer={officer}
          onLogout={() => {
            sessionStorage.clear();
            toast.success("Logged out successfully");
            navigate("/");
          }}
        />

        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          {/* OVERVIEW */}
          {section === "overview" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <LayoutDashboard size={24} className="text-orange-400" />{" "}
                Station Overview
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                  icon={<Vote size={22} className="text-yellow-400" />}
                  value={stationTotal}
                  label="STATION VOTES"
                  color="text-yellow-400"
                  border="border-yellow-500/20"
                />
                <StatCard
                  icon={<TrendingUp size={22} className="text-green-400" />}
                  value={parseFloat(((stationTotal / 2400) * 100).toFixed(1))}
                  label="TURNOUT"
                  color="text-green-400"
                  border="border-green-500/20"
                  isPercent
                />
                <StatCard
                  icon={<Building2 size={22} className="text-blue-400" />}
                  value={`${submittedBooths.length}/${stationBooths.length}`}
                  label="BOOTHS DONE"
                  color="text-blue-400"
                  border="border-blue-500/20"
                  isString
                />
              </div>
              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-6">
                <div className="text-[10px] tracking-widest text-yellow-400 mb-4">
                  STATION TALLY
                </div>
                <VoteBar />
              </div>
            </div>
          )}

          {/* VERIFY BOOTHS */}
          {section === "verify" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <Search size={24} className="text-orange-400" /> Verify Booth
                Results
              </div>
              <div className="flex flex-col gap-4 mb-6">
                {stationBooths.map((b) => (
                  <div
                    key={b.id}
                    className={`bg-white/[0.03] border rounded-2xl p-5 ${b.submitted ? "border-green-500/20" : "border-white/10"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold">{b.name}</div>
                        <div className="text-xs text-white/30 mt-0.5">
                          Issued: {b.issued} · Used: {b.used || "—"}
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
                    {b.submitted && (
                      <div className="grid grid-cols-4 gap-2">
                        {CANDIDATES.map((c) => (
                          <div
                            key={c.id}
                            className="bg-white/[0.04] rounded-xl p-2.5 text-center"
                          >
                            <div className="text-base">{c.symbol}</div>
                            <div className="font-bold text-yellow-400 font-mono text-sm">
                              {b.candidateVotes[c.id]}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!station?.verified ? (
                <div>
                  {submittedBooths.length < stationBooths.length && (
                    <div className="bg-orange-500/10 border border-orange-500/25 rounded-xl px-4 py-3 text-orange-400 text-xs mb-4">
                      ⚠ {stationBooths.length - submittedBooths.length} booth(s)
                      not yet submitted. Verifying with partial data.
                    </div>
                  )}
                  <button
                    onClick={handleVerify}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold text-sm hover:brightness-110 transition-all"
                  >
                    ✓ Verify & Submit Station Result →
                  </button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-green-400 text-sm">
                  ✓ Station result verified and submitted to Assistant Returning
                  Officer.
                </div>
              )}
            </div>
          )}

          {/* VOTER LIST */}
          {section === "voters" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <Users size={24} className="text-orange-400" /> Voter List
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 px-5 py-3 bg-orange-500/[0.07] text-[10px] tracking-widest text-orange-400">
                  <span>NAME</span>
                  <span>NID</span>
                  <span>BOOTH</span>
                  <span>STATUS</span>
                </div>
                {VOTERS.map((v) => (
                  <div
                    key={v.nid}
                    className="grid grid-cols-4 px-5 py-3.5 border-t border-white/5 text-sm hover:bg-white/[0.02]"
                  >
                    <span>{v.name}</span>
                    <span className="font-mono text-xs text-white/40">
                      {v.nid}
                    </span>
                    <span className="text-white/40">Booth {v.booth}</span>
                    <span
                      className={`text-xs font-bold ${v.voted ? "text-green-400" : "text-red-400"}`}
                    >
                      {v.voted ? "✓ VOTED" : "⚪ PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INCIDENTS */}
          {section === "incidents" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <AlertTriangle size={24} className="text-orange-400" /> Incident
                Reports
              </div>
              <div className="flex flex-col gap-3 mb-8">
                {incidents.map((inc, i) => (
                  <div
                    key={i}
                    className={`bg-white/[0.03] border rounded-2xl p-4 flex gap-4 items-center ${
                      inc.status === "active"
                        ? "border-red-500/20"
                        : inc.status === "pending"
                          ? "border-orange-500/20"
                          : "border-green-500/20"
                    }`}
                  >
                    <div className="font-mono text-yellow-400 text-sm w-12 flex-shrink-0">
                      {inc.time}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{inc.type}</div>
                      <div className="text-xs text-white/30 mt-0.5">
                        {inc.center}
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        {inc.desc}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                        inc.status === "active"
                          ? "bg-red-500/15 border-red-500/25 text-red-400"
                          : inc.status === "pending"
                            ? "bg-orange-500/15 border-orange-500/25 text-orange-400"
                            : "bg-green-500/15 border-green-500/25 text-green-400"
                      }`}
                    >
                      {inc.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <div className="text-xs text-white/30 mb-4 tracking-widest">
                  REPORT NEW INCIDENT
                </div>
                <div className="flex flex-col gap-3">
                  <select
                    id="inc-type"
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm outline-none"
                  >
                    <option value="">Select type...</option>
                    <option>EVM Malfunction</option>
                    <option>Identity Fraud Attempt</option>
                    <option>Crowd Disturbance</option>
                    <option>Missing Ballots</option>
                    <option>Other</option>
                  </select>
                  <input
                    id="inc-desc"
                    placeholder="Brief description..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none placeholder:text-white/20"
                  />
                  <button
                    onClick={() => {
                      const type = document.getElementById("inc-type").value;
                      const desc = document
                        .getElementById("inc-desc")
                        .value.trim();
                      if (!type || !desc) {
                        toast.error(
                          "Please select a type and enter a description",
                        );
                        return;
                      }
                      reportIncident(type, desc, station?.name);
                      document.getElementById("inc-type").value = "";
                      document.getElementById("inc-desc").value = "";
                      toast.success("Incident reported");
                    }}
                    className="self-start px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-all"
                  >
                    Report →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0d1117] border border-orange-500/25 rounded-2xl p-9 max-w-sm w-[90%] text-center">
            <div className="text-4xl mb-3">🏛️</div>
            <div className="text-xl font-bold mb-2">Submit Station Result?</div>
            <div className="text-xs text-white/30 mb-6">
              This will lock the station results and forward to the Assistant
              Returning Officer.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmVerify}
                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold text-sm hover:brightness-110 transition-all"
              >
                ✓ Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
