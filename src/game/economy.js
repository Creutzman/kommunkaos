export const areas = [["Skola och förskola",1050],["Äldreomsorg",850],["Socialtjänst",500],["Infrastruktur",400],["Kultur och fritid",200],["Administration",350]];

export function calculateBalance(tax, changes) {
  return -150 + tax * 95 - changes.reduce((a, b) => a + b, 0);
}

export function budgetEffects({ tax, changes, balance }) {
  return [
    changes[0] * .055 + changes[4] * .012 - tax * 3,
    changes[1] * .06 - tax * 2,
    -tax * 7 + changes[3] * .018,
    changes[0] * .02 + changes[1] * .025 + changes[2] * .015,
    changes[0] * .018 + changes[4] * .04 - tax * 2,
    balance * .018 - tax * 2,
  ];
}
