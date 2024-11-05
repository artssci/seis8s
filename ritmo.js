///////////// Filtrar silencios (valores null) y aplana la lista de listas a lista - Funcion de ayuda para instrumentos con ritmo //////////////


export function filtrarYaplanarParte(parteNonFlattened) {
      let parteFlattened = parteNonFlattened.flat();
      let filteredParte = parteFlattened.filter(e => e.note !== null);
      filteredParte.forEach(e => e.note = 'C4');
      return filteredParte;
    }


export function filtrarYaplanarParteCongas(parteNonFlattened) {
  let parteFlattened = parteNonFlattened.flat();
  let filteredParte = parteFlattened.filter(e => e.note !== null);
  
  filteredParte.forEach(e => {
    if (e.note === 1) {
      e.note = 'C4';
    }
  });

  return filteredParte;
}
