import { createContext, useContext, useState, useCallback } from "react";
import api from "../api";

const ElectionContext = createContext();

export function ElectionProvider({ children }) {
  const [votes, setVotes] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [booths, setBooths] = useState([]);
  const [stations, setStations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [fraudFlags, setFraudFlags] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [constituencyCompiled, setConstituencyCompiled] = useState(false);
  const [resultsDeclaimed, setResultsDeclaimed] = useState(false);
  const [eligibleVoters, setEligibleVoters] = useState(8200);

  const fetchPublicResults = useCallback(async () => {
    try {
      const { data } = await api.get("/api/results/public");
      setCandidates(data.candidates);
      setVotes(data.votesMap);
      setFraudFlags(data.fraudFlags);
      setConstituencyCompiled(data.constituencyCompiled);
      setResultsDeclaimed(data.resultsDeclared);
      setEligibleVoters(data.eligibleVoters);
      return data;
    } catch (err) {
      console.error("fetchPublicResults error:", err);
    }
  }, []);

  const fetchMyBooths = useCallback(async () => {
    try {
      const { data } = await api.get("/api/booth/my");
      setBooths(data.booths);
      return data.booths;
    } catch (err) {
      console.error("fetchMyBooths error:", err);
    }
  }, []);

  const fetchMyStation = useCallback(async () => {
    try {
      const { data } = await api.get("/api/station/my");
      setStations([data.station]);
      return data.station;
    } catch (err) {
      console.error("fetchMyStation error:", err);
    }
  }, []);

  const fetchIncidents = useCallback(async () => {
    try {
      const { data } = await api.get("/api/incidents");
      setIncidents(data.incidents);
      return data.incidents;
    } catch (err) {
      console.error("fetchIncidents error:", err);
    }
  }, []);

  const fetchAuditLog = useCallback(async () => {
    try {
      const { data } = await api.get("/api/audit");
      setAuditLog(data.logs);
      return data.logs;
    } catch (err) {
      console.error("fetchAuditLog error:", err);
    }
  }, []);

  // const castVote = async (voterId, candidateId) => {
  //   const { data } = await api.post("/api/voter/vote", { candidateId });
  //   await fetchPublicResults();
  //   return data;
  // };
const castVote = async (voterId, candidateId) => {
  const { data } = await api.post("/api/voter/vote", { candidateId });
  await fetchPublicResults();
  return data; 
};

  const submitBooth = async (boothId, used, candidateVotes) => {
    const { data } = await api.post("/api/booth/submit", { boothId, used, candidateVotes });
    await fetchMyBooths();
    return data;
  };

  const verifyStation = async () => {
    const { data } = await api.post("/api/station/verify");
    await fetchMyStation();
    return data;
  };

  const compileConstituency = async () => {
    const { data } = await api.post("/api/constituency/compile");
    setConstituencyCompiled(true);
    return data;
  };

  const declareResults = async () => {
    const { data } = await api.post("/api/results/declare");
    setResultsDeclaimed(true);
    return data;
  };

  const reportIncident = async (type, desc, center) => {
    const { data } = await api.post("/api/incidents", { type, desc, center });
    await fetchIncidents();
    return data;
  };

  const totalVotes = () => Object.values(votes).reduce((a, b) => a + b, 0);
  const turnout = () => ((totalVotes() / eligibleVoters) * 100).toFixed(1);
  const pct = (id) => totalVotes() > 0 ? ((votes[id] / totalVotes()) * 100).toFixed(1) : 0;

  return (
    <ElectionContext.Provider value={{
      votes, candidates, booths, stations,
      incidents, fraudFlags, auditLog,
      constituencyCompiled, resultsDeclaimed, eligibleVoters,
      fetchPublicResults, fetchMyBooths, fetchMyStation,
      fetchIncidents, fetchAuditLog,
      castVote, submitBooth, verifyStation,
      compileConstituency, declareResults, reportIncident,
      totalVotes, turnout, pct,
    }}>
      {children}
    </ElectionContext.Provider>
  );
}

export const useElection = () => useContext(ElectionContext);
