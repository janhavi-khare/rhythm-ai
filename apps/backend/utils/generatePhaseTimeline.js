function generatePhaseTimeline(cycleLength = 28, cycleDay = 1, currentPhaseName = "Follicular") {
  const cl = Number(cycleLength);
  const cd = Number(cycleDay);

  // Calculate dynamic boundaries proportional to cycle length
  const mEnd = Math.max(4, Math.round(cl * 0.18));
  const fEnd = Math.max(mEnd + 3, Math.round(cl * 0.46));
  const oEnd = Math.max(fEnd + 2, Math.round(cl * 0.57));
  const elEnd = Math.max(oEnd + 4, Math.round(cl * 0.78));
  const llEnd = cl;

  const phases = [
    { key: "menstrual", name: "Menstrual", start: 1, end: mEnd, label: `Days 1–${mEnd}` },
    { key: "follicular", name: "Follicular", start: mEnd + 1, end: fEnd, label: `Days ${mEnd + 1}–${fEnd}` },
    { key: "ovulation", name: "Ovulation", start: fEnd + 1, end: oEnd, label: `Days ${fEnd + 1}–${oEnd}` },
    { key: "early_luteal", name: "Early Luteal", start: oEnd + 1, end: elEnd, label: `Days ${oEnd + 1}–${elEnd}` },
    { key: "late_luteal", name: "Late Luteal", start: elEnd + 1, end: llEnd, label: `Days ${elEnd + 1}–${llEnd}` },
  ];

  // Determine active phase
  const pName = String(currentPhaseName).toLowerCase();
  let activeIdx = -1;

  if (pName.includes("follicular")) activeIdx = 1;
  else if (pName.includes("ovulat")) activeIdx = 2;
  else if (pName.includes("late luteal")) activeIdx = 4;
  else if (pName.includes("luteal") || pName.includes("early luteal")) activeIdx = 3;
  else if (pName.includes("menstru")) activeIdx = 0;

  if (activeIdx === -1) {
    activeIdx = phases.findIndex((ph) => cd >= ph.start && cd <= ph.end);
    if (activeIdx === -1) activeIdx = 1;
  }

  const activePhase = phases[activeIdx];
  const nextIdx = (activeIdx + 1) % phases.length;
  const nextPhase = phases[nextIdx];

  const daysUntilNext = Math.max(1, activePhase.end - cd + 1);

  const phaseTimeline = phases.map((ph, idx) => ({
    ...ph,
    active: idx === activeIdx,
  }));

  return {
    cycleLength: cl,
    cycleDay: cd,
    currentPhase: activePhase.name,
    nextPhase: {
      name: nextPhase.name,
      daysUntil: daysUntilNext,
    },
    phaseTimeline,
  };
}

module.exports = generatePhaseTimeline;
