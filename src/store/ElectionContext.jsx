import { createContext, useContext, useState } from "react";
import {
  INITIAL_VOTES,
  VOTERS,
  BOOTHS,
  STATIONS,
  INITIAL_INCIDENTS,
  INITIAL_FRAUD_FLAGS,
  INITIAL_AUDIT_LOG,
  ELIGIBLE_VOTERS,
} from "../data/mockData";

const ElectionContext = createContext();

export function ElectionProvider({ children }) {
  const [votes, setVotes] = useState({ ...INITIAL_VOTES });
  const [voters, setVoters] = useState([...VOTERS]);
  const [booths, setBooths] = useState([...BOOTHS]);
  const [stations, setStations] = useState([...STATIONS]);
  const [incidents, setIncidents] = useState([...INITIAL_INCIDENTS]);
  const [fraudFlags] = useState([...INITIAL_FRAUD_FLAGS]);
  const [auditLog, setAuditLog] = useState([...INITIAL_AUDIT_LOG]);
  const [constituencyCompiled, setConstituencyCompiled] = useState(false);
  const [resultsDeclaimed, setResultsDeclaimed] = useState(false);

  // utils
  const totalVotes = () => Object.values(votes).reduce((a, b) => a + b, 0);
  const turnout = () => ((totalVotes() / ELIGIBLE_VOTERS) * 100).toFixed(1);
  const pct = (id) => totalVotes() > 0 ? ((votes[id] / totalVotes()) * 100).toFixed(1) : 0;

  const logAudit = (msg) => {
    const time = new Date().toLocaleTimeString("en-BD");
    setAuditLog((prev) => [{ time, event: msg }, ...prev]);
  };

  // voter casts a vote
  const castVote = (voterId, candidateId) => {
    setVotes((prev) => ({ ...prev, [candidateId]: prev[candidateId] + 1 }));
    setVoters((prev) =>
      prev.map((v) => v.nid === voterId ? { ...v, voted: true } : v)
    );
    logAudit(`Voter cast vote (NID ending ${voterId.slice(-4)})`);
  };

  // APO submits booth results
  const submitBooth = (boothId, used, candidateVotes, officerName) => {
    setBooths((prev) =>
      prev.map((b) =>
        b.id === boothId ? { ...b, used, candidateVotes, submitted: true } : b
      )
    );
    setVotes((prev) => {
      const updated = { ...prev };
      Object.entries(candidateVotes).forEach(([cid, count]) => {
        updated[cid] = (updated[cid] || 0) + count;
      });
      return updated;
    });
    logAudit(`${officerName} submitted Booth ${boothId} results`);
  };

  // PO verifies station
  const verifyStation = (stationId, officerName) => {
    setStations((prev) =>
      prev.map((s) =>
        s.id === stationId ? { ...s, verified: true, submitted: true } : s
      )
    );
    const station = stations.find((s) => s.id === stationId);
    logAudit(`PO ${officerName} verified station: ${station?.name}`);
  };

  // ARO compiles
  const compileConstituency = (officerName) => {
    setConstituencyCompiled(true);
    logAudit(`ARO ${officerName} compiled constituency and forwarded to RO`);
  };

  // RO declares
  const declareResults = (officerName) => {
    setResultsDeclaimed(true);
    logAudit(`RO ${officerName} officially declared results`);
  };

  // report incident
  const reportIncident = (type, desc, center) => {
    const time = new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" });
    setIncidents((prev) => [{ time, center, type, desc, status: "active" }, ...prev]);
    logAudit(`Incident reported: ${type}`);
  };

  return (
    <ElectionContext.Provider value={{
      votes, voters, booths, stations, incidents, fraudFlags, auditLog,
      constituencyCompiled, resultsDeclaimed,
      totalVotes, turnout, pct,
      castVote, submitBooth, verifyStation,
      compileConstituency, declareResults, reportIncident,
      logAudit,
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

// custom hook so every component just does useElection()
export const useElection = () => useContext(ElectionContext);