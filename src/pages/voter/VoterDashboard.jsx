import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useElection } from "../../store/ElectionContext";
import { CANDIDATES, BOOTHS, STATIONS } from "../../data/mockData";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VoteBar from "../../components/VoteBar";
import toast from "react-hot-toast";
import { Vote, BarChart2, FileText, MapPin, Home, User, CheckCircle, AlertCircle, Inbox } from "lucide-react";

export default function VoterDashboard() {
  const navigate = useNavigate();
  const { votes, castVote, totalVotes, turnout } = useElection();
  const [voter, setVoter] = useState(null);
  const [tab, setTab] = useState("home");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("currentVoter");
    if (!stored) { navigate("/voter/login"); return; }
    setVoter(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("currentVoter");
    if (stored) setVoter(JSON.parse(stored));
  }, [votes]);

  if (!voter) return null;

  const booth = BOOTHS.find((b) => b.id === voter.booth);
  const station = STATIONS.find((s) => s.id === booth?.station);

  const handleCastVote = () => {
    castVote(voter.nid, selected);
    const updated = { ...voter, voted: true };
    sessionStorage.setItem("currentVoter", JSON.stringify(updated));
    setVoter(updated);
    setShowModal(false);
    setSelected(null);
    setTab("slip");
  };

  const tabs = ["home", "vote", "results", "slip"];

  return (
    <div className="min-h-screen bg-[#06090f] text-white flex flex-col">
      {/* desktop navbar */}
      <div className="hidden md:block">
        <Navbar
          title="VOTER PORTAL"
          subtitle="জাতীয় নির্বাচন ২০২৪"
          rightContent={
            <div className="flex items-center gap-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                    tab === t
                      ? "bg-green-500/15 border border-green-500/40 text-green-400"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >{t}</button>
              ))}
              <div className="w-px h-4 bg-white/10 mx-1" />
              <span className="text-xs text-white/30">{voter.name}</span>
              <button
                onClick={() => { sessionStorage.clear(); toast.success("Logged out successfully"); navigate("/"); }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20 transition-all"
              >Logout</button>
            </div>
          }
        />
      </div>

      {/* mobile navbar */}
      <div className="md:hidden">
        <Navbar
          title="VOTER PORTAL"
          subtitle="জাতীয় নির্বাচন ২০২৪"
          rightContent={
            <button
              onClick={() => { sessionStorage.clear(); toast.success("Logged out successfully"); navigate("/"); }}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs"
            >Logout</button>
          }
        />
      </div>

      {/* mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-white/10 backdrop-blur">
        <div className="flex">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[10px] capitalize transition-all flex flex-col items-center gap-1 ${
                tab === t ? "text-green-400" : "text-white/30"
              }`}
            >
              {t === "home" ? <Home size={18} /> : t === "vote" ? <Vote size={18} /> : t === "results" ? <BarChart2 size={18} /> : <FileText size={18} />}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-6 pb-24 md:pb-8">

        {/* HOME TAB */}
        {tab === "home" && (
          <div>
            <div className="bg-green-500/[0.07] border border-green-500/20 rounded-2xl p-4 md:p-6 mb-6">
              <div className="flex gap-4 md:gap-5 items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-800 to-green-700 flex items-center justify-center flex-shrink-0">
                  <User size={28} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg md:text-2xl font-bold text-green-400 truncate">{voter.name}</div>
                  <div className="text-xs text-white/40 mt-1">NID: {voter.nid}</div>
                  <div className="text-xs text-white/40">District: {voter.district}</div>
                  <div className="text-xs text-white/30 truncate">Center: {station?.name}</div>
                </div>
                <span className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 ${
                  voter.voted
                    ? "bg-red-500/15 border-red-500/40 text-red-400"
                    : "bg-green-500/15 border-green-500/40 text-green-400"
                }`}>
                  {voter.voted ? "✓ VOTED" : "NOT VOTED"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: <Vote size={28} className="text-green-400" />, title: "Cast Your Vote", desc: voter.voted ? "Already voted" : "Exercise your right", tab: "vote", color: "green", disabled: voter.voted },
                { icon: <BarChart2 size={28} className="text-blue-400" />, title: "Live Results", desc: "National vote count", tab: "results", color: "blue", disabled: false },
                { icon: <FileText size={28} className="text-yellow-400" />, title: "Vote Slip", desc: "Official receipt", tab: "slip", color: "yellow", disabled: !voter.voted },
                { icon: <MapPin size={28} className="text-purple-400" />, title: "My Booth", desc: booth?.name + " · " + station?.name, tab: null, color: "purple", disabled: false },
              ].map((card) => (
                <div
                  key={card.title}
                  onClick={() => card.tab && !card.disabled && setTab(card.tab)}
                  className={`bg-white/[0.03] border border-${card.color}-500/20 rounded-2xl p-4 md:p-5 transition-all duration-200 ${
                    card.disabled ? "opacity-40 cursor-not-allowed" : card.tab ? "cursor-pointer hover:bg-white/[0.06] hover:-translate-y-0.5" : ""
                  }`}
                >
                  <div className="mb-2 md:mb-3">{card.icon}</div>
                  <div className={`text-sm md:text-base font-bold text-${card.color}-400 mb-1`}>{card.title}</div>
                  <div className="text-xs text-white/40 leading-tight">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VOTE TAB */}
        {tab === "vote" && (
          <div>
            <div className="text-center mb-6 md:mb-8">
              <div className="text-[10px] tracking-widest text-yellow-400/70 mb-2">জাতীয় সংসদ নির্বাচন ২০২৪</div>
              <div className="text-xl md:text-2xl font-bold">Select Your Candidate</div>
              <div className="text-xs text-white/30 mt-1">{station?.name} · {booth?.name}</div>
            </div>

            {voter.voted ? (
              <div className="text-center py-16">
                <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
                <div className="text-xl font-bold text-green-400">Vote Successfully Cast!</div>
                <div className="text-sm text-white/40 mt-2">Thank you for participating in democracy.</div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 mb-5">
                  {CANDIDATES.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelected(c.id)}
                      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
                      style={{
                        background: selected === c.id ? c.color + "18" : "rgba(255,255,255,0.03)",
                        borderColor: selected === c.id ? c.color : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0 border-2"
                        style={{ background: c.color + "33", borderColor: c.color }}>
                        {c.symbol}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm md:text-base">{c.name}</div>
                        <div className="text-xs text-white/40">{c.party}</div>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 transition-all"
                        style={{
                          borderColor: selected === c.id ? c.color : "rgba(255,255,255,0.2)",
                          background: selected === c.id ? c.color : "transparent",
                        }}>
                        {selected === c.id && "✓"}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => selected && setShowModal(true)}
                  disabled={!selected}
                  className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                    selected
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:brightness-110"
                      : "bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
                >CAST VOTE →</button>
              </>
            )}
          </div>
        )}

        {/* RESULTS TAB */}
        {tab === "results" && (
          <div>
            <div className="flex items-center gap-2 text-xl md:text-2xl font-bold mb-1">
              <BarChart2 size={24} className="text-green-400" /> Live Results
            </div>
            <div className="text-xs text-white/30 mb-5">Updates in real time</div>
            <div className="bg-white/[0.03] border border-green-500/20 rounded-2xl p-4 md:p-6">
              <div className="flex justify-between text-xs text-white/30 mb-4">
                <span>Total: <b className="text-yellow-400 font-mono">{totalVotes().toLocaleString()}</b></span>
                <span>Turnout: <b className="text-green-400">{turnout()}%</b></span>
              </div>
              <VoteBar />
            </div>
          </div>
        )}

        {/* SLIP TAB */}
        {tab === "slip" && (
          <div>
            {!voter.voted ? (
              <div className="text-center py-16">
                <Inbox size={56} className="text-white/20 mx-auto mb-4" />
                <div className="text-lg text-white/40">No receipt yet</div>
                <div className="text-sm text-white/20 mt-2">Cast your vote first.</div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-yellow-500/25 rounded-2xl p-6 md:p-10 text-center">
                <div className="text-[10px] tracking-widest text-yellow-400 mb-1">OFFICIAL VOTING RECEIPT</div>
                <div className="text-[10px] text-white/20 tracking-wider mb-5">BANGLADESH ELECTION COMMISSION</div>
                <Vote size={52} className="text-green-400 mx-auto mb-4" />
                <div className="text-xl font-bold text-green-400 mb-5">Vote Successfully Recorded</div>
                <div className="max-w-sm mx-auto text-left space-y-2">
                  {[
                    ["Voter Name", voter.name],
                    ["NID", voter.nid],
                    ["District", voter.district],
                    ["Polling Station", station?.name],
                    ["Booth", booth?.name],
                    ["Timestamp", new Date().toLocaleString("en-BD")],
                    ["Reference", "BD-2024-" + voter.nid.slice(-6)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-white/30">{k}</span>
                      <span className="font-medium text-right ml-4">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-white/20 mt-5 italic">
                  Your individual choice remains secret. This slip confirms participation only.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONFIRM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-yellow-500/25 rounded-2xl p-7 md:p-9 max-w-sm w-full">
            <div className="flex justify-center mb-3">
              <AlertCircle size={44} className="text-yellow-400" />
            </div>
            <div className="text-xl font-bold text-center mb-2">Confirm Your Vote</div>
            {selected && (() => {
              const c = CANDIDATES.find((x) => x.id === selected);
              return (
                <div className="rounded-xl p-4 my-4 text-center border"
                  style={{ background: c.color + "18", borderColor: c.color + "44" }}>
                  <div className="text-3xl mb-2">{c.symbol}</div>
                  <div className="font-bold text-yellow-400">{c.name}</div>
                  <div className="text-xs text-white/40">{c.party}</div>
                </div>
              );
            })()}
            <div className="text-xs text-white/30 text-center mb-5">This cannot be undone. Your choice is final.</div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button onClick={handleCastVote}
                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-sm hover:brightness-110 transition-all">
                ✓ Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}