import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../../store/ElectionContext";
import { CANDIDATES, CONSTITUENCIES } from "../../data/mockData";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VoteBar from "../../components/VoteBar";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

export default function RODashboard() {
  const navigate = useNavigate();
  const { votes, totalVotes, turnout, auditLog, constituencyCompiled, resultsDeclaimed, declareResults } = useElection();
  const [section, setSection] = useState("approval");
  const [showModal, setShowModal] = useState(false);
  const [officer] = useState(() => JSON.parse(sessionStorage.getItem("currentOfficer")));

  if (!officer) { navigate("/officer/ro"); return null; }

  const sorted = [...CANDIDATES].sort((a, b) => votes[b.id] - votes[a.id]);

  const handleDeclare = () => {
    if (!constituencyCompiled) { toast.error("Awaiting ARO compilation first"); return; }
    if (resultsDeclaimed) { toast.error("Results already declared"); return; }
    setShowModal(true);
  };

  const confirmDeclare = () => {
    declareResults(officer.name);
    setShowModal(false);
    toast.success("Results officially declared!");
  };

  const sidebarItems = [
    { id: "approval", icon: "✅", label: "Final Approval" },
    { id: "national", icon: "🌐", label: "National View" },
    { id: "winners", icon: "🏆", label: "Winners" },
    { id: "audit", icon: "🔎", label: "Audit Log" },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      <Navbar title="RETURNING OFFICER" subtitle="Final Constituency Approval" backTo="/" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          active={section}
          onSelect={setSection}
          accentColor="#e74c3c"
          officer={officer}
          onLogout={() => { sessionStorage.clear(); toast.success("Logged out successfully"); navigate("/"); }}
        />

        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">

          {/* FINAL APPROVAL */}
          {section === "approval" && (
            <div>
              <div className="text-2xl font-bold mb-1">✅ Final Constituency Approval</div>
              <div className="text-xs text-white/30 mb-6">Review compiled results and officially declare</div>

              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-6 mb-5">
                <div className="text-[10px] tracking-widest text-yellow-400 mb-2">PENDING APPROVAL</div>
                <div className="text-sm text-white/40 mb-5">
                  Status: <span className={constituencyCompiled ? "text-green-400" : "text-orange-400"}>
                    {constituencyCompiled ? "✓ Compiled by ARO · Awaiting your approval" : "⚪ Awaiting ARO compilation"}
                  </span>
                </div>

                {CONSTITUENCIES.map((con) => (
                  <div key={con.id} className="mb-5">
                    <div className="font-bold mb-4">{con.name}</div>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {sorted.map((c) => (
                        <div key={c.id} className="rounded-xl p-3 border" style={{ background: c.color + "18", borderColor: c.color + "33" }}>
                          <div className="text-xs text-white/40 mb-1">{c.symbol} {c.name}</div>
                          <div className="font-mono text-xl font-bold" style={{ color: c.color }}>{votes[c.id].toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {!resultsDeclaimed ? (
                  <button
                    onClick={handleDeclare}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm hover:brightness-110 transition-all"
                  >⚖️ Declare Official Results →</button>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3 text-green-400 text-sm">
                    🎉 Results officially declared and published to public feed.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NATIONAL VIEW */}
          {section === "national" && (
            <div>
              <div className="text-2xl font-bold mb-6">🌐 National Overview</div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { icon: "🗳️", val: totalVotes().toLocaleString(), label: "TOTAL VOTES", color: "text-yellow-400", border: "border-yellow-500/20" },
                  { icon: "📈", val: turnout() + "%", label: "TURNOUT", color: "text-green-400", border: "border-green-500/20" },
                  { icon: "🏫", val: "847", label: "STATIONS", color: "text-blue-400", border: "border-blue-500/20" },
                  { icon: "🚨", val: "2", label: "FLAGS", color: "text-red-400", border: "border-red-500/20" },
                ].map((s) => (
                  <div key={s.label} className={`bg-white/[0.03] border ${s.border} rounded-2xl p-5 text-center`}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className={`font-mono text-2xl font-bold ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] text-white/30 tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.03] border border-yellow-500/20 rounded-2xl p-6">
                <div className="text-[10px] tracking-widest text-yellow-400 mb-4">NATIONAL TALLY</div>
                <VoteBar />
              </div>
            </div>
          )}

          {/* WINNERS */}
          {section === "winners" && (
            <div>
              <div className="text-2xl font-bold mb-6">🏆 Constituency Winners</div>
              <div className="flex flex-col gap-4">
                {sorted.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-5 rounded-2xl p-5 border"
                    style={{ background: c.color + "12", borderColor: c.color + "33" }}>
                    <div className="font-mono text-2xl font-black" style={{ color: i === 0 ? "#e8b84b" : "rgba(255,255,255,0.2)" }}>
                      #{i + 1}
                    </div>
                    <span className="text-3xl">{c.symbol}</span>
                    <div className="flex-1">
                      <div className="font-bold text-base">{c.name} {i === 0 ? "👑" : ""}</div>
                      <div className="text-xs text-white/40">{c.party}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold" style={{ color: c.color }}>{votes[c.id].toLocaleString()}</div>
                      <div className="text-xs text-white/30">{totalVotes() > 0 ? ((votes[c.id] / totalVotes()) * 100).toFixed(2) : 0}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUDIT LOG */}
          {section === "audit" && (
            <div>
              <div className="text-2xl font-bold mb-6">🔎 System Audit Log</div>
              <div className="flex flex-col gap-2">
                {auditLog.map((e, i) => (
                  <div key={i} className="flex gap-4 items-center px-4 py-3 bg-white/[0.02] rounded-xl text-sm border border-white/[0.04]">
                    <span className="font-mono text-yellow-400 text-xs flex-shrink-0">{e.time}</span>
                    <span className="text-white/50">{e.event}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DECLARE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0d1117] border border-red-500/25 rounded-2xl p-9 max-w-sm w-[90%] text-center">
            <div className="text-4xl mb-3">⚖️</div>
            <div className="text-xl font-bold mb-2">Officially Declare Results?</div>
            <div className="text-xs text-white/30 mb-6">This will publish results to the public feed and cannot be reversed without an official review process.</div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={confirmDeclare} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm hover:brightness-110 transition-all">⚖️ Declare</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}