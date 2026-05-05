import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../../store/ElectionContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VoteBar from "../../components/VoteBar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";
import { LayoutDashboard, Search, Users, AlertTriangle } from "lucide-react";
import { Vote, TrendingUp, Building2 } from "lucide-react";
import StatCard from "../../components/StatCard";
import api from "../../api";

export default function PODashboard() {
  const navigate = useNavigate();
  const {
    booths,
    stations,
    candidates,
    incidents,
    verifyStation,
    reportIncident,
    resolveIncident,
    fetchMyStation,
    fetchIncidents,
    fetchPublicResults,
    totalVotes,
    turnout,
  } = useElection();
  const [section, setSection] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [voterList, setVoterList] = useState([]);
  const [votersLoading, setVotersLoading] = useState(false);
  const [officer] = useState(() => JSON.parse(sessionStorage.getItem("currentOfficer")));

  useEffect(() => {
    if (!officer) { navigate("/officer/po"); return; }
    fetchMyStation();
    fetchIncidents();
    fetchPublicResults();
  }, []);

  if (!officer) return null;

  // officer.stationId is the field from backend
  const station = stations.find((s) => s.stationId === officer.stationId);
  const stationBooths = booths.filter((b) => b.stationId === officer.stationId);
  const submittedBooths = stationBooths.filter((b) => b.submitted);
  const stationTotal = submittedBooths.reduce(
    (a, b) => {
      const cv = b.candidateVotes;
      if (!cv) return a;
      const vals = cv instanceof Map
        ? Array.from(cv.values())
        : Object.values(cv);
      return a + vals.reduce((x, y) => x + Number(y), 0);
    },
    0,
  );

  const loadVoters = async () => {
    if (voterList.length > 0) return;
    setVotersLoading(true);
    try {
      const { data } = await api.get(`/api/voter/list?stationId=${officer.stationId}`);
      setVoterList(data.voters || []);
    } catch {
      // endpoint might not exist — show empty state gracefully
      setVoterList([]);
    } finally {
      setVotersLoading(false);
    }
  };

  const handleVerify = () => {
    if (station?.verified) { toast.error("Station already verified"); return; }
    setShowModal(true);
  };

  const confirmVerify = async () => {
    setVerifying(true);
    try {
      await verifyStation();
      await fetchMyStation();
      setShowModal(false);
      toast.success("Station result submitted to ARO");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify station");
      setShowModal(false);
    } finally {
      setVerifying(false);
    }
  };

  // incident form state
  const [incType, setIncType] = useState("");
  const [incDesc, setIncDesc] = useState("");
  const [reporting, setReporting] = useState(false);

  const handleReport = async () => {
    if (!incType || !incDesc.trim()) {
      toast.error("Please select a type and enter a description");
      return;
    }
    setReporting(true);
    try {
      await reportIncident(incType, incDesc.trim(), station?.name || `Station ${officer.stationId}`);
      await fetchIncidents();
      setIncType("");
      setIncDesc("");
      toast.success("Incident reported");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to report incident");
    } finally {
      setReporting(false);
    }
  };

  const sidebarItems = [
    { id: "overview", icon: <LayoutDashboard size={16} />, label: "Overview" },
    { id: "verify", icon: <Search size={16} />, label: "Verify Booths" },
    { id: "voters", icon: <Users size={16} />, label: "Voter List" },
    { id: "incidents", icon: <AlertTriangle size={16} />, label: "Incidents" },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar title="PRESIDING OFFICER" subtitle={station?.name || `Station ${officer.stationId}`} backTo="/" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          active={section}
          onSelect={(s) => {
            setSection(s);
            if (s === "voters") loadVoters();
          }}
          accentColor="#e67e22"
          officer={officer}
        />

        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          {/* OVERVIEW */}
          {section === "overview" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <LayoutDashboard size={24} className="text-orange-400" /> Station Overview
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
                  value={parseFloat(((stationTotal / (station?.eligibleVoters || 2400)) * 100).toFixed(1))}
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
                <div className="text-[10px] tracking-widest text-yellow-400 mb-4">STATION TALLY</div>
                <VoteBar />
              </div>
            </div>
          )}

          {/* VERIFY BOOTHS */}
          {section === "verify" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <Search size={24} className="text-orange-400" /> Verify Booth Results
              </div>

              {stationBooths.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  No booths found for this station.
                </div>
              ) : (
                <div className="flex flex-col gap-4 mb-6">
                  {stationBooths.map((b) => (
                    <div
                      key={b.boothId}
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
                      {b.submitted && candidates.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {candidates.map((c) => {
                            const cv = b.candidateVotes;
                            const val = cv instanceof Map
                              ? cv.get(String(c.candidateId))
                              : cv?.[c.candidateId] ?? cv?.[String(c.candidateId)] ?? 0;
                            return (
                              <div key={c.candidateId} className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                                <div className="text-base">{c.symbol}</div>
                                <div className="font-bold text-yellow-400 font-mono text-sm">{val}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!station?.verified ? (
                <div>
                  {stationBooths.length === 0 && (
                    <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-xs mb-4">
                      ✗ No booths assigned to this station. Cannot verify.
                    </div>
                  )}
                  {submittedBooths.length < stationBooths.length && stationBooths.length > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/25 rounded-xl px-4 py-3 text-orange-400 text-xs mb-4">
                      ⚠ {stationBooths.length - submittedBooths.length} booth(s) not yet submitted. Verifying with partial data.
                    </div>
                  )}
                  <button
                    onClick={handleVerify}
                    disabled={verifying || stationBooths.length === 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifying ? "Verifying..." : "✓ Verify & Submit Station Result →"}
                  </button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-green-400 text-sm">
                  ✓ Station result verified and submitted to Assistant Returning Officer.
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
              {votersLoading ? (
                <div className="text-center py-16 text-white/30">Loading voters...</div>
              ) : voterList.length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  No voter data available from server.
                </div>
              ) : (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-4 px-5 py-3 bg-orange-500/[0.07] text-[10px] tracking-widest text-orange-400">
                    <span>NAME</span>
                    <span>NID</span>
                    <span>BOOTH</span>
                    <span>STATUS</span>
                  </div>
                  {voterList.map((v) => (
                    <div
                      key={v.nid}
                      className="grid grid-cols-4 px-5 py-3.5 border-t border-white/5 text-sm hover:bg-white/[0.02]"
                    >
                      <span>{v.name}</span>
                      <span className="font-mono text-xs text-white/40">{v.nid}</span>
                      <span className="text-white/40">Booth {v.boothId}</span>
                      <span className={`text-xs font-bold ${v.voted ? "text-green-400" : "text-red-400"}`}>
                        {v.voted ? "✓ VOTED" : "⚪ PENDING"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INCIDENTS */}
          {section === "incidents" && (
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                <AlertTriangle size={24} className="text-orange-400" /> Incident Reports
              </div>
              <div className="flex flex-col gap-3 mb-8">
                {incidents.length === 0 && (
                  <div className="text-center py-8 text-white/30">No incidents reported.</div>
                )}
                {incidents.map((inc, i) => (
                  <div
                    key={inc._id || i}
                    className={`bg-white/[0.03] border rounded-2xl p-4 flex gap-4 items-center ${
                      inc.status === "active"
                        ? "border-red-500/20"
                        : "border-green-500/20"
                    }`}
                  >
                    <div className="font-mono text-yellow-400 text-xs w-20 flex-shrink-0">
                      {inc.createdAt ? new Date(inc.createdAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{inc.type}</div>
                      <div className="text-xs text-white/30 mt-0.5">{inc.center}</div>
                      <div className="text-xs text-white/50 mt-1">{inc.desc}</div>
                    </div>
                    {inc.status === "active" ? (
                      <button
                        onClick={async () => {
                          try {
                            await resolveIncident(inc._id);
                            toast.success("Incident resolved");
                          } catch (err) {
                            toast.error(err.response?.data?.message || "Failed to resolve");
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                          inc.status === "active"
                            ? "bg-red-500/15 border-red-500/25 text-red-400"
                            : "bg-green-500/15 border-green-500/25 text-green-400"
                        }`}
                      >
                        {inc.status?.toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <div className="text-xs text-white/30 mb-4 tracking-widest">REPORT NEW INCIDENT</div>
                <div className="flex flex-col gap-3">
                  <select
                    value={incType}
                    onChange={(e) => setIncType(e.target.value)}
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
                    value={incDesc}
                    onChange={(e) => setIncDesc(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm outline-none placeholder:text-white/20"
                  />
                  <button
                    onClick={handleReport}
                    disabled={reporting}
                    className="self-start px-5 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-all disabled:opacity-50"
                  >
                    {reporting ? "Reporting..." : "Report →"}
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
              This will lock the station results and forward to the Assistant Returning Officer.
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
                disabled={verifying}
                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
                {verifying ? "Submitting..." : "✓ Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
