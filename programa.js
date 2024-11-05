import * as a from "./armonia.js";
import * as i from "./instrumento.js";


let stateHistory = []; // Array to store different states

function updateState(newList) {
  stateHistory.push([...newList]); // Store a copy of the new state

  // Keep only the last two states
  if (stateHistory.length > 2) {
    stateHistory.shift();
  }
}

function findDeletedItems() {
  if (stateHistory.length === 2) {
    const [previousState, currentState] = stateHistory;

    // Log the states for verification
    console.log("Previous state:", previousState);
    console.log("Current state:", currentState);

    // Identify items in previousState not in currentState by comparing `name` and `id`
    const deletedItems = previousState.filter(prevItem => 
      !currentState.some(currItem => 
        currItem.name === prevItem.name && currItem.id === prevItem.id
      )
    );

    console.log("Deleted items:", deletedItems);
    return deletedItems;
  }
  return [];
}


// Main function that manages state updates and deletion tracking
export function programa(estadoGlobal, pistas) {
  console.log("estado global", estadoGlobal)
 pistas.forEach((pista) => {
    pista.id = pista.name + "_" + pista.id; // Adjust according to actual property names
  });

  updateState(pistas);
  const deletedItems = findDeletedItems();
  
// Iterate over deleted items and call desconectarPistasBorradas for each
  deletedItems.forEach(item => {
    // Assuming each item has an id property
    const id = item.id; // Extract the id from the item
    i.desconectarPistasBorradas(id); // Call the function with the individual id
  });
  // Update tempo and harmony
  i.establecerTempo(estadoGlobal.tempo);
  let arm = a.armoniaEnNotasExplicitas(estadoGlobal.armonia);

  // Process the current pistas
  if (pistas.length !== 0) {
    pistas.forEach(function (pista) {
      i.tocaSecuencia(
        estadoGlobal.armonia,
        pista.name,
        pista.id,
        pista.volumen,
        pista.paneo,
        pista.sonido,
        '1m',
        pista.notas,
        pista.parte.parteList,
        pista.octavaAbsoluta
      );
    });
  } else {
    i.stopSequence();
  }
}
