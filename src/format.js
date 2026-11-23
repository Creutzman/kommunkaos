export const money = x => Math.round(x).toLocaleString('sv-SE') + ' Mkr';
export const taxLabel = tax => tax.toFixed(1).replace('.', ',') + ' kr';
