export const CANDIDATES = [
  { id: 1, name: "Farida Khanam", party: "Awami League", symbol: "🚢", color: "#2471a3" },
  { id: 2, name: "Kamal Hossain", party: "BNP", symbol: "🌾", color: "#922b21" },
  { id: 3, name: "Rina Akter", party: "Jatiya Party", symbol: "⚙️", color: "#1e8449" },
  { id: 4, name: "Zahir Uddin", party: "Independent", symbol: "⭐", color: "#7d3c98" },
];

export const CONSTITUENCIES = [
  { id: 1, name: "Dhaka-1 (Dohar-Nawabganj)", stations: [1, 2, 3] },
  { id: 2, name: "Dhaka-2 (Motijheel)", stations: [4, 5] },
];

export const STATIONS = [
  { id: 1, name: "Motijheel Govt. School", constituency: 1, booths: [1, 2, 3, 4], verified: false, submitted: false },
  { id: 2, name: "Farmgate Model High School", constituency: 1, booths: [5, 6], verified: true, submitted: true },
  { id: 3, name: "Gulshan Ideal School", constituency: 1, booths: [7, 8], verified: false, submitted: false },
];

export const BOOTHS = [
  { id: 1, name: "Booth A-1", station: 1, issued: 850, used: 0, candidateVotes: { 1: 0, 2: 0, 3: 0, 4: 0 }, submitted: false, flagged: false },
  { id: 2, name: "Booth A-2", station: 1, issued: 820, used: 0, candidateVotes: { 1: 0, 2: 0, 3: 0, 4: 0 }, submitted: false, flagged: false },
  { id: 3, name: "Booth A-3", station: 1, issued: 790, used: 0, candidateVotes: { 1: 0, 2: 0, 3: 0, 4: 0 }, submitted: false, flagged: false },
  { id: 4, name: "Booth A-4", station: 1, issued: 810, used: 0, candidateVotes: { 1: 0, 2: 0, 3: 0, 4: 0 }, submitted: false, flagged: false },
  { id: 5, name: "Booth B-1", station: 2, issued: 760, used: 580, candidateVotes: { 1: 250, 2: 190, 3: 88, 4: 52 }, submitted: true, flagged: false },
  { id: 6, name: "Booth B-2", station: 2, issued: 800, used: 612, candidateVotes: { 1: 280, 2: 175, 3: 101, 4: 56 }, submitted: true, flagged: false },
  { id: 7, name: "Booth C-1", station: 3, issued: 700, used: 0, candidateVotes: { 1: 0, 2: 0, 3: 0, 4: 0 }, submitted: false, flagged: false },
  { id: 8, name: "Booth C-2", station: 3, issued: 720, used: 0, candidateVotes: { 1: 0, 2: 0, 3: 0, 4: 0 }, submitted: false, flagged: false },
];

export const VOTERS = [
  { nid: "1234567890123", name: "Mohammad Alam", dob: "1985-03-12", district: "Dhaka", booth: 1, constituency: 1, voted: false },
  { nid: "9876543210123", name: "Fatema Begum", dob: "1990-07-22", district: "Chittagong", booth: 2, constituency: 1, voted: false },
  { nid: "1111222233334", name: "Rahim Khan", dob: "1978-11-05", district: "Rajshahi", booth: 3, constituency: 1, voted: false },
];

export const OFFICERS = [
  { id: "APO001", pin: "1111", name: "Nusrat Jahan", role: "apo", station: 1, booths: [1, 2, 3, 4] },
  { id: "PO001",  pin: "2222", name: "Abdur Rahman", role: "po",  station: 1 },
  { id: "ARO001", pin: "3333", name: "Dilruba Akter", role: "aro", constituency: 1 },
  { id: "RO001",  pin: "4444", name: "Justice Mahbub", role: "ro", constituency: 1 },
];

export const ELIGIBLE_VOTERS = 8200;

export const INITIAL_VOTES = { 1: 2341, 2: 1987, 3: 876, 4: 432 };

export const INITIAL_INCIDENTS = [
  { time: "09:14", center: "Motijheel Govt. School", type: "EVM Malfunction", desc: "EVM in Booth A-3 stalled — resolved in 12 min", status: "resolved" },
  { time: "10:42", center: "Farmgate Model School", type: "Identity Fraud Attempt", desc: "Voter attempted to cast vote with another's NID", status: "active" },
];

export const INITIAL_FRAUD_FLAGS = [
  { booth: "Booth B-1", station: "Farmgate", issue: "Vote count 8% below baseline", severity: "low" },
  { booth: "Booth A-4 (demo)", station: "Motijheel", issue: "Entered count exceeds issued ballots", severity: "high" },
];

export const INITIAL_AUDIT_LOG = [
  { time: "07:00:00", event: "Election polling opened nationally" },
  { time: "08:14:22", event: "APO001 submitted Booth B-1 results" },
  { time: "08:45:11", event: "APO001 submitted Booth B-2 results" },
  { time: "09:02:33", event: "PO Farmgate verified station result" },
];