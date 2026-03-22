import { useNavigate } from "react-router-dom";
import { useElection } from "../store/ElectionContext";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Particles from "../reactbits/Particles";
import BlurText from "../reactbits/BlurText";
import DecryptedText from "../reactbits/DecryptedText";
import {
  Radio,
  UserCheck,
  PenLine,
  ShieldCheck,
  ClipboardList,
  Scale,
  Vote,
  BarChart2,
  Building2,
  AlertTriangle,
} from "lucide-react";

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────
function HowItWorks() {
  const [active, setActive] = useState("voter");

  const tabs = [
    {
      id: "voter",
      label: "ভোটার",
      shortLabel: "ভোটার",
      icon: <UserCheck size={14} />,
      color: "text-green-400",
      border: "border-green-500/40",
      bg: "bg-green-500/15",
    },
    {
      id: "apo",
      label: "সহকারী প্রিসাইডিং অফিসার",
      shortLabel: "স.প্র.অ.",
      icon: <PenLine size={14} />,
      color: "text-yellow-400",
      border: "border-yellow-500/40",
      bg: "bg-yellow-500/15",
    },
    {
      id: "po",
      label: "প্রিসাইডিং অফিসার",
      shortLabel: "প্র.অ.",
      icon: <ShieldCheck size={14} />,
      color: "text-orange-400",
      border: "border-orange-500/40",
      bg: "bg-orange-500/15",
    },
    {
      id: "aro",
      label: "সহকারী রিটার্নিং অফিসার",
      shortLabel: "স.রি.অ.",
      icon: <ClipboardList size={14} />,
      color: "text-purple-400",
      border: "border-purple-500/40",
      bg: "bg-purple-500/15",
    },
    {
      id: "ro",
      label: "রিটার্নিং অফিসার",
      shortLabel: "রি.অ.",
      icon: <Scale size={14} />,
      color: "text-red-400",
      border: "border-red-500/40",
      bg: "bg-red-500/15",
    },
    {
      id: "guest",
      label: "অতিথি",
      shortLabel: "অতিথি",
      icon: <Radio size={14} />,
      color: "text-blue-400",
      border: "border-blue-500/40",
      bg: "bg-blue-500/15",
    },
  ];

  const steps = {
    voter: [
      {
        n: "০১",
        title: "লগইন করুন",
        desc: "আপনার জাতীয় পরিচয়পত্র (NID) নম্বর এবং জন্ম তারিখ দিয়ে ভোটার পোর্টালে প্রবেশ করুন।",
      },
      {
        n: "০২",
        title: "প্রার্থী বাছাই করুন",
        desc: "আপনার পছন্দের প্রার্থী নির্বাচন করুন। প্রতিটি প্রার্থীর নাম, দল ও প্রতীক দেখা যাবে।",
      },
      {
        n: "০৩",
        title: "ভোট নিশ্চিত করুন",
        desc: "আপনার বাছাই করা প্রার্থীকে নিশ্চিত করুন। একবার ভোট দিলে পরিবর্তন করা যাবে না।",
      },
      {
        n: "০৪",
        title: "রসিদ সংগ্রহ করুন",
        desc: "ভোট প্রদানের পর আপনার অফিশিয়াল ভোটিং রসিদ ডাউনলোড করুন।",
      },
    ],
    apo: [
      {
        n: "০১",
        title: "লগইন করুন",
        desc: "আপনার অফিসার আইডি ও পিন দিয়ে সহকারী প্রিসাইডিং অফিসার পোর্টালে প্রবেশ করুন।",
      },
      {
        n: "০২",
        title: "বুথ নির্বাচন করুন",
        desc: "আপনার নির্ধারিত বুথগুলো থেকে একটি বুথ বাছাই করুন এবং ভোট গণনা শুরু করুন।",
      },
      {
        n: "০৩",
        title: "ভোট সংখ্যা প্রবেশ করুন",
        desc: "প্রতিটি প্রার্থীর ভোট সংখ্যা, বিতরণকৃত ব্যালট এবং ব্যবহৃত ব্যালটের সংখ্যা লিখুন।",
      },
      {
        n: "০৪",
        title: "যাচাই ও জমা দিন",
        desc: "সিস্টেম স্বয়ংক্রিয়ভাবে ভোট সংখ্যা যাচাই করবে। সঠিক হলে জমা দিন।",
      },
    ],
    po: [
      {
        n: "০১",
        title: "লগইন করুন",
        desc: "আপনার অফিসার আইডি ও পিন দিয়ে প্রিসাইডিং অফিসার পোর্টালে প্রবেশ করুন।",
      },
      {
        n: "০২",
        title: "বুথ ফলাফল পর্যালোচনা করুন",
        desc: "সকল বুথের সহকারী প্রিসাইডিং অফিসারের জমা দেওয়া ফলাফল পর্যালোচনা করুন।",
      },
      {
        n: "০৩",
        title: "ঘটনা রিপোর্ট করুন",
        desc: "কোনো অনিয়ম বা ঘটনা ঘটলে তাৎক্ষণিকভাবে রিপোর্ট করুন।",
      },
      {
        n: "০৪",
        title: "ফলাফল যাচাই ও জমা দিন",
        desc: "সকল বুথের ফলাফল সঠিক হলে স্টেশনের ফলাফল যাচাই করে সহকারী রিটার্নিং অফিসারের কাছে পাঠান।",
      },
    ],
    aro: [
      {
        n: "০১",
        title: "লগইন করুন",
        desc: "আপনার অফিসার আইডি ও পিন দিয়ে সহকারী রিটার্নিং অফিসার পোর্টালে প্রবেশ করুন।",
      },
      {
        n: "০২",
        title: "স্টেশন যাচাই পর্যালোচনা করুন",
        desc: "সকল পোলিং স্টেশনের প্রিসাইডিং অফিসারের যাচাইকৃত ফলাফল দেখুন।",
      },
      {
        n: "০৩",
        title: "জালিয়াতি পতাকা পর্যালোচনা করুন",
        desc: "সিস্টেম কর্তৃক চিহ্নিত যেকোনো অস্বাভাবিকতা বা জালিয়াতির সতর্কতা পর্যালোচনা করুন।",
      },
      {
        n: "০৪",
        title: "সংকলন ও পাঠান",
        desc: "নির্বাচনী এলাকার সকল ফলাফল সংকলন করে রিটার্নিং অফিসারের কাছে চূড়ান্ত অনুমোদনের জন্য পাঠান।",
      },
    ],
    ro: [
      {
        n: "০১",
        title: "লগইন করুন",
        desc: "আপনার অফিসার আইডি ও পিন দিয়ে রিটার্নিং অফিসার পোর্টালে প্রবেশ করুন।",
      },
      {
        n: "০২",
        title: "সংকলিত ফলাফল পর্যালোচনা করুন",
        desc: "সহকারী রিটার্নিং অফিসারের পাঠানো সংকলিত নির্বাচনী এলাকার ফলাফল পর্যালোচনা করুন।",
      },
      {
        n: "০৩",
        title: "জাতীয় ফলাফল দেখুন",
        desc: "সারা দেশের সকল নির্বাচনী এলাকার ফলাফল ও পরিসংখ্যান দেখুন।",
      },
      {
        n: "০৪",
        title: "ফলাফল আনুষ্ঠানিকভাবে ঘোষণা করুন",
        desc: "সকল ফলাফল সঠিক হলে আনুষ্ঠানিকভাবে নির্বাচনের ফলাফল ঘোষণা করুন এবং জনগণের জন্য প্রকাশ করুন।",
      },
    ],
    guest: [
      {
        n: "০১",
        title: "সরাসরি ফলাফল দেখুন",
        desc: "কোনো লগইন ছাড়াই সরাসরি ফলাফল পোর্টালে প্রবেশ করুন এবং রিয়েল-টাইম ভোট গণনা দেখুন।",
      },
      {
        n: "০২",
        title: "প্রার্থীদের ফলাফল দেখুন",
        desc: "প্রতিটি প্রার্থীর মোট ভোট সংখ্যা ও শতকরা হার দেখুন।",
      },
      {
        n: "০৩",
        title: "নির্বাচনী এলাকার তথ্য দেখুন",
        desc: "বিভিন্ন নির্বাচনী এলাকার ফলাফল ও রিপোর্টিং স্ট্যাটাস দেখুন।",
      },
      {
        n: "০৪",
        title: "জালিয়াতি সতর্কতা দেখুন",
        desc: "সিস্টেম কর্তৃক চিহ্নিত যেকোনো অস্বাভাবিকতা বা জালিয়াতির সতর্কতা দেখুন।",
      },
    ],
  };

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      <div className="text-center mb-8 md:mb-10">
        <div className="text-sm tracking-widest text-white/30 mb-2">
          ব্যবহার নির্দেশিকা
        </div>
        <div className="text-xl md:text-3xl font-bold">
          কীভাবে ব্যবহার করবেন?
        </div>
      </div>

      {/* tabs — icons only on mobile, full label on desktop */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              active === t.id
                ? `${t.bg} ${t.border} ${t.color}`
                : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white/70"
            }`}
          >
            {t.icon}
            <span className="inline md:hidden">{t.shortLabel}</span>
            <span className="hidden md:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {steps[active].map((step, i) => (
          <div
            key={`${active}-${i}`}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 md:p-5 flex gap-3 md:gap-4"
          >
            <div
              className={`text-xl md:text-2xl font-black font-mono flex-shrink-0 ${activeTab.color} opacity-40`}
            >
              {step.n}
            </div>
            <div>
              <div className={`font-bold text-sm mb-1.5 ${activeTab.color}`}>
                <DecryptedText
                  key={`title-${active}-${i}`}
                  text={step.title}
                  animateOn="view"
                  revealDirection="start"
                  sequential
                  speed={15}
                  characters="০১২৩৪৫৬৭৮৯!?#"
                  useOriginalCharsOnly={false}
                />
              </div>
              <div className="text-xs text-white/50 leading-relaxed">
                <DecryptedText
                  key={`desc-${active}-${i}`}
                  text={step.desc}
                  animateOn="view"
                  revealDirection="start"
                  sequential
                  speed={5}
                  characters="০১২৩৪৫৬৭৮৯!?#"
                  useOriginalCharsOnly={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const { totalVotes, turnout } = useElection();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const portals = [
    {
      icon: <Radio size={36} className="text-blue-400" />,
      title: "Live Results",
      subtitle: "সরাসরি ফলাফল · Guest Mode",
      desc: "Real-time national vote count. No login needed.",
      link: "/guest",
      border: "border-blue-500/20",
      bg: "hover:bg-blue-500/10",
      text: "text-blue-400",
    },
    {
      icon: <UserCheck size={36} className="text-green-400" />,
      title: "Voter Portal",
      subtitle: "ভোটার পোর্টাল · NID Login",
      desc: "Search your booth, cast vote, view results & slip.",
      link: "/voter/login",
      border: "border-green-500/20",
      bg: "hover:bg-green-500/10",
      text: "text-green-400",
    },
  ];

  const officerPortals = [
    {
      icon: <PenLine size={20} className="text-yellow-400" />,
      title: "Asst. Presiding Officer",
      subtitle: "Booth vote entry",
      link: "/officer/apo",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
      bg: "hover:bg-yellow-500/10",
    },
    {
      icon: <ShieldCheck size={20} className="text-orange-400" />,
      title: "Presiding Officer",
      subtitle: "Verify station results",
      link: "/officer/po",
      text: "text-orange-400",
      border: "border-orange-500/20",
      bg: "hover:bg-orange-500/10",
    },
    {
      icon: <ClipboardList size={20} className="text-purple-400" />,
      title: "Asst. Returning Officer",
      subtitle: "Compile constituency",
      link: "/officer/aro",
      text: "text-purple-400",
      border: "border-purple-500/20",
      bg: "hover:bg-purple-500/10",
    },
    {
      icon: <Scale size={20} className="text-red-400" />,
      title: "Returning Officer",
      subtitle: "Final approval",
      link: "/officer/ro",
      text: "text-red-400",
      border: "border-red-500/20",
      bg: "hover:bg-red-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white">
      <Navbar />

      {/* particles bg */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Particles
          particleColors={["#ffffff", "#e8b84b"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      {/* all content above particles */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* hero */}
        <div className="text-center pt-12 md:pt-16 pb-8 md:pb-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 tracking-widest font-bold">
              ELECTION IN PROGRESS
            </span>
          </div>

          <div className="flex justify-center mb-3 gradient-text">
            <BlurText
              text="জাতীয় সংসদ নির্বাচন ২০২৬"
              delay={200}
              animateBy="words"
              direction="top"
              className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-center"
            />
          </div>

          <p className="text-white/40 text-base md:text-lg mb-6">
            12th National Parliamentary Election · February 12, 2026
          </p>

          {/* ticker */}
          <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8 px-5 md:px-8 py-3 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl md:rounded-full text-xs md:text-sm mb-10 md:mb-14">
            <span className="flex items-center gap-1.5">
              <Vote size={14} className="text-yellow-400" />
              <b className="text-yellow-400 font-mono">
                {totalVotes().toLocaleString()}
              </b>{" "}
              votes
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart2 size={14} className="text-green-400" />
              <b className="text-green-400">{turnout()}%</b> turnout
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 size={14} className="text-blue-400" />
              <b className="text-blue-400">847/1,200</b> stations
            </span>
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-orange-400" />
              <b className="text-orange-400">2</b> flags
            </span>
          </div>
        </div>

        {/* portal cards */}
        <div className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portals.map((p) => (
              <div
                key={p.title}
                onClick={() => navigate(p.link)}
                className={`rounded-2xl p-6 md:p-7 cursor-pointer border ${p.border} ${p.bg} bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className="mb-4">{p.icon}</div>
                <div className={`text-xl font-bold ${p.text} mb-1`}>
                  {p.title}
                </div>
                <div className="text-xs text-white/30 mb-3">{p.subtitle}</div>
                <div className="text-sm text-white/50 leading-relaxed">
                  {p.desc}
                </div>
                <div className={`mt-4 text-xs ${p.text}`}>Enter →</div>
              </div>
            ))}

            <div className="flex flex-col gap-3">
              {officerPortals.map((p) => (
                <div
                  key={p.title}
                  onClick={() => navigate(p.link)}
                  className={`rounded-xl px-4 py-3.5 cursor-pointer border ${p.border} ${p.bg} bg-white/[0.03] transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3`}
                >
                  <span>{p.icon}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${p.text}`}>
                      {p.title}
                    </div>
                    <div className="text-xs text-white/30">{p.subtitle}</div>
                  </div>
                  <span className={`text-xs ${p.text}`}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* how it works */}
        <HowItWorks />

        <Footer />
      </div>
    </div>
  );
}
