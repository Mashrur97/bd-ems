import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../../store/ElectionContext";
import { CANDIDATES, STATIONS, BOOTHS, CONSTITUENCIES } from "../../data/mockData";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VoteBar from "../../components/VoteBar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

export default function ARODashboard() {
  const navigate = useNavigate();
  const { booths, stations, fraudFlags, totalVotes, compileConstituency, constituencyCompiled } = useElection();
  const [section, setSection] = useState("compile");
  const [officer] = useState(() => JSON.parse(sessionStorage.getItem("currentOfficer")));

  if (!officer) { navigate("/officer/aro"); return null; }

  const myConstituency = CONSTITUENCIES.find((c) => c.id === officer.constituency);
  const myStations = stations.filter((s) => myConstituency?.stations.includes(s.id));
  const verifiedStations = myStations.filter((s) => s.verified);

  const handleCompile = () => {
    if (constituencyCompiled) { toast.error("Already compiled"); return; }
    compileConstituency(officer.name);
    toast.success("Compiled and forwarded to Returning Officer");
  };

  const sidebarItems = [
    { id: "compile", icon: "📊", label: "Compile Results" },
    { id: "stations", icon: "🏫", label: "All Stations" },
    { id: "flags", icon: "🚨", label: "Fraud Flags" },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar title="ASST. RETURNING OFFICER" subtitle={myConstituency?.name} backTo="/" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          active={section}
          onSelect={setSection}
          accentColor="#9b59b6"
          officer={officer}
          onLogout={() => { sessionStorage.clear(); toast.success("Logged out successfully"); navigate("/"); }}
        />

        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">

          {/* COMPILE */}
          {section === "compile" && (
            <div>
              <div className="text-2xl font-bold mb-1">📊 Constituency Compilation</div>
              <div className="text-xs text-white/30 mb-6">Aggregate verified station results</div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: "🏫", val: `${verifiedStations.length}/${myStations.length}`, label: "STATIONS VERIFIED", color: "text-purple-400", border: "border-purple-500/20" },
                  { icon: "🗳️", val: totalVotes().toLocaleString(), label: "TOTAL VOTES", color: "text-yellow-400", border: "border-yellow-500/20" },
                  { icon: "🚨", val: fraudFlags.length.toString(), label: "ACTIVE FLAGS", color: "text-red-400", border: "border-red-500/20" },
                ].map((s) => (
                  <div key={s.label} className={`bg-white/[0.03] border ${s.border} rounded-2xl p-5 text-center`}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className={`font-mono text-2xl font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] text-white/30 tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.03] border border-purple-500/20 rounded-2xl p-6 mb-5">
                <div className="text-[10px] tracking-widest text-purple-400 mb-4">CONSTITUENCY TALLY</div>
                <VoteBar />
              </div>

              {!constituencyCompiled ? (
                <div>
                  {verifiedStations.length < myStations.length && (
                    <div className="bg-orange-500/10 border border-orange-500/25 rounded-xl px-4 py-3 text-orange-400 text-xs mb-4">
                      ⚠ {myStations.length - verifiedStations.length} station(s) pending verification. Compilation will be partial.
                    </div>
                  )}
                  <button
                    onClick={handleCompile}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-sm hover:brightness-110 transition-all"
                  >Compile & Forward to Returning Officer →</button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-green-400 text-sm">
                  ✓ Compiled and forwarded to Returning Officer for final approval.
                </div>
              )}
            </div>
          )}

          {/* STATIONS */}
          {section === "stations" && (
            <div>
              <div className="text-2xl font-bold mb-6">🏫 Polling Stations</div>
              <div className="flex flex-col gap-4">
                {myStations.map((s) => {
                  const sBooths = booths.filter((b) => b.station === s.id && b.submitted);
                  return (
                    <div key={s.id} className={`bg-white/[0.03] border rounded-2xl p-5 ${s.verified ? "border-green-500/20" : "border-white/10"}`}>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-bold text-base">{s.name}</div>
                          <div className="text-xs text-white/30 mt-0.5">
                            {sBooths.length}/{booths.filter(b => b.station === s.id).length} booths submitted
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          s.verified
                            ? "bg-green-500/15 border-green-500/30 text-green-400"
                            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        }`}>{s.verified ? "VERIFIED" : "PENDING"}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {CANDIDATES.map((c) => {
                          const total = sBooths.reduce((a, b) => a + (b.candidateVotes[c.id] || 0), 0);
                          return (
                            <div key={c.id} className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                              <div className="text-base">{c.symbol}</div>
                              <div className="font-bold text-yellow-400 font-mono text-sm">{total}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FRAUD FLAGS */}
          {section === "flags" && (
            <div>
              <div className="text-2xl font-bold mb-6">🚨 Fraud & Anomaly Flags</div>
              {fraudFlags.length === 0
                ? <div className="text-center py-16 text-white/30">No active flags.</div>
                : fraudFlags.map((f, i) => (
                  <div key={i} className={`bg-white/[0.03] border rounded-2xl p-5 mb-3 ${f.severity === "high" ? "border-red-500/25" : "border-orange-500/20"}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className={`font-bold text-sm mb-1 ${f.severity === "high" ? "text-red-400" : "text-orange-400"}`}>
                          ⚠ {f.booth} — {f.station}
                        </div>
                        <div className="text-xs text-white/40">{f.issue}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        f.severity === "high"
                          ? "bg-red-500/15 border-red-500/25 text-red-400"
                          : "bg-orange-500/15 border-orange-500/25 text-orange-400"
                      }`}>{f.severity.toUpperCase()}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}