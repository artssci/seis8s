////////////////Armonía en letra a notas explícitas /////////////////////////

// [String] -> [String], e.g.,  => ["C", "E", "E", "G"]
function obtenerNotasDelAcorde(acorde) {
  // Check if 'acorde' is an array and has elements - sometimes it is passed a null value I think
  if (Array.isArray(acorde) && acorde.length > 0) {
    const listaDeNotas = acorde.map((elemento) => Tonal.Chord.get(elemento)); 
    return listaDeNotas;
  }
}


// [[String]] -> [[Object]]
export function armoniaEnNotasExplicitas(armonia){
  const armoniaNotas = armonia.map((acorde) => obtenerNotasDelAcorde(acorde));
  return armoniaNotas
}


/////////////////// Línea del bajo //////////////////////

// :: {time, note dureation} -> {tonal chord} -> {time, note dureation}
function asignarNotasDelBajoSegunGradosDelAcorde(elementoParte, chordProperties, octavaAbsoluta) {
  const grados = {
    null: null,
    1: chordProperties.tonic,
    3: chordProperties.notes[1] || null,
    5: chordProperties.notes[2] || null,
    7: chordProperties.notes[3] || null
  };
  
  const grado = elementoParte.note;
  const octava = octavaAbsoluta + elementoParte.octavaRelativa;

  if (grados[grado] !== null) {
    elementoParte.note = grados[grado] + String(octava);  
  } 
  return elementoParte;
}

// :: [{time, note, duration} , ... ] -> [{tonal chord}] -> [{time, note duration}, ...]
function listaDeGradosDeAcordesAlistaDeNotasDelBajo(elementosParteList, chordPropertiesList, octavaAbsoluta) {
  return elementosParteList.map(elemento => {
    const chordProperties = chordPropertiesList[0];
    return asignarNotasDelBajoSegunGradosDelAcorde({ ...elemento }, chordProperties, octavaAbsoluta);
  });
} 


// :: [[{time, note, duration} , ... ], ... ] -> [[{tonal chord}], ... ] -> [{time, note, duration} , ... ]
export function lineaDelBajo(parte, armonia, octavaAbsoluta) {
  const result = parte.map((p, index) => {
    const harmonyForPart = armonia[index % armonia.length];  // Get the corresponding harmony
    return listaDeGradosDeAcordesAlistaDeNotasDelBajo(p, harmonyForPart, octavaAbsoluta);
  }).flat().filter(elemento => elemento.note !== null);
  console.log(result);
  return result
}


/////////////////// Acordes del teclado //////////////////////

// const parteTeclado = [{ "time": "0:2:0", "note": ['C4', 'E4', 'G4'], "duration": "4n" }, { "time": "0:4:0", "note": ['C4', 'E4', 'G4'], "duration": "4n" }]
 
// :: {time, note dureation} -> {tonal chord} -> [{time, note: [lista de notas del acorde] dureation}, ...]
// function asignarNotasSegunGradosDelAcordeTeclado(elementoParte, chordProperties, octavaAbsoluta) {

function asignarNotasDelTecladoSegunGradosDelAcorde(elementoParte, chordProperties, octavaAbsoluta) {
  const grados = {
    null: null,
    1: chordProperties.tonic,
    3: chordProperties.notes[1] || null,
    5: chordProperties.notes[2] || null,
    7: chordProperties.notes[3] || null
  };
  
  const grado = elementoParte.note;
  const octava = octavaAbsoluta + elementoParte.octavaRelativa;
  let chordNotes = [];

  if (grados[grado] !== null) {
    chordNotes.push(grados[grado] + String(octava));
    // Add other chord notes based on the initial degree
    if (grado === 1) {
      chordNotes.push(grados[3] + String(octava), grados[5] + String(octava));
    } else if (grado === 3) {
      chordNotes.push(grados[1] + String(octava), grados[5] + String(octava));
    } else if (grado === 5) {
      chordNotes.push(grados[1] + String(octava), grados[3] + String(octava));
    } else if (grado === 7) {
      chordNotes.push(grados[1] + String(octava), grados[3] + String(octava), grados[5] + String(octava));
    }
  }

  elementoParte.note = chordNotes;
  // console.log("elementoParte", elementoParte);
  return elementoParte;
}


// :: [{time, note, duration} , ... ] -> [{tonal chord}] -> [{time, note duration}, ...]
// function listaDeGradosAlistaDeNotasTeclado(elementosParteList, chordPropertiesList, octavaAbsoluta) {
function listaDeGradosDeAcordesAlistaDeNotasDelTeclado(elementosParteList, chordPropertiesList, octavaAbsoluta) {
  return elementosParteList.map(elemento => {
    const chordProperties = chordPropertiesList[0];
      // console.log("asignarNotas", asignarNotasDelTecladoSegunGradosDelAcorde({ ...elemento }, chordProperties, octavaAbsoluta));
    return asignarNotasDelTecladoSegunGradosDelAcorde({ ...elemento }, chordProperties, octavaAbsoluta);
  });
} 

// :: [[{time, note, duration} , ... ], ... ] -> [[{tonal chord}], ... ] -> [{time, note, duration} , ... ]
export function acordesDelTeclado(parte, armonia, octavaAbsoluta) {
  const result = parte.map((p, index) => {
    const harmonyForPart = armonia[index % armonia.length];  // Get the corresponding harmony
    // console.log("listaDeGrados", listaDeGradosDeAcordesAlistaDeNotasDelTeclado(p, harmonyForPart, octavaAbsoluta));

    return listaDeGradosDeAcordesAlistaDeNotasDelTeclado(p, harmonyForPart, octavaAbsoluta);
  }).flat().filter(elemento => elemento.note !== null);
      // console.log("result", result);
  return result
}



/////////////////// Contar número de compases //////////////////////


// :: [{time, note, duration} , ... ] -> Int
 export function numberOfMeasures(parte){ 
    let lastElement = parte[parte.length - 1];  // Step 1: Access the last element
    let timeValue = lastElement.time;      // Step 2: Get the 'time' value
    let timeParts = timeValue.split(':'); // Step 3: Split the 'time' value by ':'
   return parseInt(timeParts[0], 10);    // Step 4: Get the first element
  }


/////////////////// Crear acorde desde lista //////////////////////


export function crearAcordeDesdeLista(input) {
  const list1 = [];
  const list2 = [];
  const list3 = [];
  const list4 = [];
  const list5 = [];
  const listaFinal = [];

  input.forEach((item) => {
    let elements = []; // Initialize elements as an empty array to avoid any carry-over.

    if (Array.isArray(item)) {
      const nestedResult = crearAcordeDesdeLista(item);
      list1.push(nestedResult[0]);
      list2.push(nestedResult[1]);
      list3.push(nestedResult[2]);
      list4.push(nestedResult[3]);
      list5.push(nestedResult[4]);
    } else if (item === null) {
      elements = [null];
    } else {
      elements = item.trim().split(' ');
    }

    // Only push to the lists if `elements` exist
    if (elements.length > 0) {
      list1.push(elements[0] || null);
      list2.push(elements[1] || null);
      list3.push(elements[2] || null);
      list4.push(elements[3] || null);
      list5.push(elements[4] || null);
    }
  });

  listaFinal.push(list1, list2, list3, list4, list5);
  return listaFinal;
}


