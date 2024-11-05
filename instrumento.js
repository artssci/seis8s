import * as a from "./armonia.js";
import * as r from "./ritmo.js";
import * as s from './sonidos.js';


///////////// linear transformation para normalizar/mapear 0 a -60db y 1 a 0db ///////////// 

// :: Number => Number
function normalizarVolumen(v){
  return ((60 * v) - 60)
}

///////////// Establecer Tempo ///////////// 

// :: number => Number
export function establecerTempo(t){
  if (Tone.Transport.state !== "started") {
  Tone.Transport.bpm.value = t; // Set the tempo to 120 BPM
  Tone.Transport.start();
} else {
  Tone.Transport.bpm.value = t; 
 }
}

///////////// Detener secuencia ///////////// 

export function stopSequence() {
  // Stop the transport
  Tone.Transport.stop();

  // Dispose of all samplers
  Object.keys(bomboSampler).forEach(id => {
    bomboSampler[id].dispose();
    delete bomboSampler[id];  // Remove reference
  });

  // Dispose of all channels
  Object.keys(canalDelBombo).forEach(id => {
    canalDelBombo[id].dispose();
    delete canalDelBombo[id];  // Remove reference
  });
  
   // Dispose of all samplers
  Object.keys(contrasSampler).forEach(id => {
    contrasSampler[id].dispose();
    delete contrasSampler[id];  // Remove reference
  });

  // Dispose of all channels
  Object.keys(canalDelContratiempo).forEach(id => {
    canalDelContratiempo[id].dispose();
    delete canalDelContratiempo[id];  // Remove reference
  });
  
  
    // Dispose of all samplers
  Object.keys(tecladoSampler).forEach(id => {
    tecladoSampler[id].dispose();
    delete tecladoSampler[id];  // Remove reference
  });

  // Dispose of all channels
  Object.keys(canalDelTeclado).forEach(id => {
    canalDelTeclado[id].dispose();
    delete canalDelTeclado[id];  // Remove reference
  });
  
    // Dispose of all samplers
  Object.keys(bajoSampler).forEach(id => {
    bajoSampler[id].dispose();
    delete bajoSampler[id];  // Remove reference
  });

  // Dispose of all channels
  Object.keys(canalDelBajo).forEach(id => {
    canalDelBajo[id].dispose();
    delete canalDelBajo[id];  // Remove reference
  });

 // Dispose of all sequences
  Object.keys(sequences).forEach(id => {
    sequences[id].stop();   // Stop the sequence
    sequences[id].dispose(); // Dispose of the sequence
    delete sequences[id];    // Remove reference
  });

  // Reset Transport position if needed
  Tone.Transport.position = 0;

  
}

export function desconectarPistasBorradas(id) {
        // Stop and dispose of any sequences if they exist
    if (sequences[id]) {
      sequences[id].stop();
      sequences[id].dispose();
      delete sequences[id];
      console.log(`Sequence ${id} disposed`);
    }
  
    if (bomboSampler[id]) {
      bomboSampler[id].releaseAll();
      bomboSampler[id].disconnect();
      bomboSampler[id].dispose();
      delete bomboSampler[id];
    }

    if (canalDelBombo[id]) {
      canalDelBombo[id].disconnect();
      canalDelBombo[id].dispose();
      delete canalDelBombo[id];
    }
  
   if (contrasSampler[id]) {
      contrasSampler[id].releaseAll();
      contrasSampler[id].disconnect();
      contrasSampler[id].dispose();
      delete contrasSampler[id];
    }

    if (canalDelContratiempo[id]) {
      canalDelContratiempo[id].disconnect();
      canalDelContratiempo[id].dispose();
      delete canalDelContratiempo[id];
    }
  
  if (tecladoSampler[id]) {
      tecladoSampler[id].releaseAll();
      tecladoSampler[id].disconnect();
      tecladoSampler[id].dispose();
      delete tecladoSampler[id];
    }

    if (canalDelTeclado[id]) {
      canalDelTeclado[id].disconnect();
      canalDelTeclado[id].dispose();
      delete canalDelTeclado[id];
    }
  
  if (bajoSampler[id]) {
      bajoSampler[id].releaseAll();
      bajoSampler[id].disconnect();
      bajoSampler[id].dispose();
      delete bajoSampler[id];
    }

    if (canalDelBajo[id]) {
      canalDelBajo[id].disconnect();
      canalDelBajo[id].dispose();
      delete canalDelBajo[id];
    }
}



///////////// Definiciones globales de instrumentos ///////////// 

// let seq1, seq2, seq3, seq4, seq5, canalDelTeclado2;
let sequences = {};  // Object to store sequences dynamically by id

///////////// Sampler de la conga ///////////// 


let congaSampler = {};  // Initialize bomboSampler as an object to store multiple samplers
let canalDeLaConga = {}; // Initialize canalDelBombo as an object to store multiple channels

function congaSamplerF(sonidoConga, id, volumen, paneo) {
  
  let newBaseUrl = "https://luisnavarrodelangel.github.io/sonidos-seis8s/" + sonidoConga;

  // Initialize the sampler if it's not already created  
  if (!congaSampler[id] || congaSampler[id].baseUrl !== newBaseUrl) {
    congaSampler[id] = new Tone.Sampler({
      urls: { 
        C4: "conga_abierta.wav",
        D4: "conga_muteado.wav",
        E4: "conga_tapado.wav",
        
      },
      release: 1,
      baseUrl: newBaseUrl
    });
  }

  // Initialize the channel if not created yet
  if (!canalDeLaConga[id]) {
    canalDeLaConga[id] = new Tone.Channel({
      volume: normalizarVolumen(volumen), // Initial volume
      pan: (paneo * 2) - 1,  // Initial pan
    }).toDestination();
  } else {
    // If the channel already exists, update its parameters
    canalDeLaConga[id].volume.value = normalizarVolumen(volumen);
    canalDeLaConga[id].pan.value = (paneo * 2) - 1;
  }

  // Connect the sampler to its corresponding channel
  congaSampler[id].connect(canalDeLaConga[id]);  // Connect the sampler to the channel
}



///////////// Sampler del bombo ///////////// 


let bomboSampler = {};  // Initialize bomboSampler as an object to store multiple samplers
let canalDelBombo = {}; // Initialize canalDelBombo as an object to store multiple channels

function bomboSamplerF(sonidoBombo, id, volumen, paneo) {
  
  let newBaseUrl = "https://luisnavarrodelangel.github.io/sonidos-seis8s/" + sonidoBombo;

  // Initialize the sampler if it's not already created  
  if (!bomboSampler[id] || bomboSampler[id].baseUrl !== newBaseUrl) {
    bomboSampler[id] = new Tone.Sampler({
      urls: { C4: "C2.wav" },
      release: 1,
      baseUrl: newBaseUrl
    });
  }

  // Initialize the channel if not created yet
  if (!canalDelBombo[id]) {
    canalDelBombo[id] = new Tone.Channel({
      volume: normalizarVolumen(volumen), // Initial volume
      pan: (paneo * 2) - 1,  // Initial pan
    }).toDestination();
  } else {
    // If the channel already exists, update its parameters
    canalDelBombo[id].volume.value = normalizarVolumen(volumen);
    canalDelBombo[id].pan.value = (paneo * 2) - 1;
  }

  // Connect the sampler to its corresponding channel
  bomboSampler[id].connect(canalDelBombo[id]);  // Connect the sampler to the channel
}



///////////// Sampler de los contratiempos /////
let contrasSampler = {};
let canalDelContratiempo = {};


function contrasSamplerF(sonidoContratiempos, id, volumen, paneo) {
  
  let newBaseUrl = "https://luisnavarrodelangel.github.io/sonidos-seis8s/" + sonidoContratiempos;

  // Initialize the sampler if it's not already created
  if (!contrasSampler[id] || contrasSampler[id].baseUrl !== newBaseUrl) {
  contrasSampler[id] = new Tone.Sampler({
      urls: { C4: "F#2.wav" },
      release: 1,
      baseUrl: newBaseUrl
    });
}

    // Initialize the channel if not created yet
    if (!canalDelContratiempo[id]) {
      canalDelContratiempo[id] = new Tone.Channel({
        volume: normalizarVolumen(volumen), // Initial volume
        pan: (paneo * 2) - 1,  // Initial pan
      }).toDestination();
    } else {
    // If the channel already exists, update its parameters
    canalDelContratiempo[id].volume.value = normalizarVolumen(volumen);
    canalDelContratiempo[id].pan.value = (paneo * 2) - 1;
  }
      
      contrasSampler[id].connect(canalDelContratiempo[id]);  // Connect once

}

   
   

///////////// Sampler del Teclado ///////////// 

let tecladoSampler = {};
let canalDelTeclado = {};

function tecladoSamplerF(sonidoTeclado, id, volumen, paneo) {
  
   let newBaseUrl = "https://luisnavarrodelangel.github.io/sonidos-seis8s/" + sonidoTeclado;

  
  if (!tecladoSampler[id] || tecladoSampler[id].baseUrl !== newBaseUrl) {
   tecladoSampler[id] = new Tone.Sampler({
        urls: {
          C5: "C5.wav"
        },
        release: 1, 
        baseUrl: newBaseUrl

      });
  }
  
  if (!canalDelTeclado[id]) {    
   canalDelTeclado[id] = new Tone.Channel({
    volume:  normalizarVolumen(volumen), // Volume in decibels
    pan: (paneo * 2) -1,    // Panning from 0 (left) to 1 (right)
  }).toDestination();
  } else {
    // If the channel already exists, update its parameters
    canalDelTeclado[id].volume.value = normalizarVolumen(volumen);
    canalDelTeclado[id].pan.value = (paneo * 2) - 1;
  }

   tecladoSampler[id].connect(canalDelTeclado[id]);

}

///////////// Sampler del Bajo ///////////// 

let bajoSampler = {};
let canalDelBajo = {};

function bajoSamplerF(sonidoBajo, id, volumen, paneo) {
    
  // Check if the sound has changed
  let newBaseUrl = "https://luisnavarrodelangel.github.io/sonidos-seis8s/" + sonidoBajo;

  // Initialize or update the sampler if the sound has changed
  if (!bajoSampler[id] || bajoSampler[id].baseUrl !== newBaseUrl) {
    
     bajoSampler[id] = new Tone.Sampler({
        urls: {
          C4: "C4.wav"
        },
        release: 1, 
        baseUrl: newBaseUrl // Set the new sound URL
      });
    } 
  
  if (!canalDelBajo[id]) {
   canalDelBajo[id] = new Tone.Channel({
    volume:  normalizarVolumen(volumen), // Volume in decibels
    pan: (paneo * 2) -1,    // Panning from 0 (left) to 1 (right)
  }).toDestination();
  } else {
    // If the channel already exists, update its parameters
    canalDelBajo[id].volume.value = normalizarVolumen(volumen);
    canalDelBajo[id].pan.value = (paneo * 2) - 1;
  }

   bajoSampler[id].connect(canalDelBajo[id]);
}



///////////// Toca secuencia ///////////// 

  // let seq;

export function tocaSecuencia(armonia, instrumento, id, volumen, paneo, indiceSonido, cuantizar, notas, parte, octavaAbsoluta) {
  
  // const id = instrumento + "_" + identificador; //bajo_default

  if (sequences[id]) {
    sequences[id].stop();
    sequences[id].dispose();
    // sequences[id] = null;
    delete sequences[id];  // Remove the reference to the old sequence

  }

  ///////////// Bajo /////////////

  if (instrumento === "bajo") {

    let sonidoBajo = s.sonidos.bajo[indiceSonido].nombre;
    bajoSamplerF(sonidoBajo, id, volumen, paneo)

     
      if (parte.length == 0 ) {  
        console.log("¡Comenzando secuencia del bajo!");

        // Create and start the sequence
          
      Tone.loaded().then(() => {
      console.log("Sampler fully loaded!");
        sequences[id] = new Tone.Sequence((time, note) => {
        const letterNote = typeof note === "number" 
        ? Tone.Frequency(note, "midi").toNote()  // condition ? expressionIfTrue : expressionIfFalse;
        : note;
          bajoSampler[id].triggerAttackRelease(letterNote, 0.1, time);
        }, notas, '1m');   // '1m' represents one measure as the interval

        sequences[id].start(0);

      });

      //  bajo (n [[@], [𝅗𝅥 𝅗𝅥], [𝅘𝅥 𝅘𝅥 𝅘𝅥 𝅘𝅥], []])   
  } else if (parte.length > 0) {
     console.log("¡Comenzando tumbao del bajo!")

     let _armonia = a.armoniaEnNotasExplicitas(armonia);    
     let _parte = a.lineaDelBajo(parte, _armonia, octavaAbsoluta);

     Tone.loaded().then(() => {
       sequences[id] = new Tone.Part((time, value) => {
        bajoSampler[id].triggerAttackRelease(value.note, value.duration, time);
    }, _parte).start(0);
       
       
      console.log('Sequence created for bajo', id, sequences[id]);

       sequences[id].loop = true; // Enable looping
  
       let numeroDeCompases = a.numberOfMeasures(_parte);
       sequences[id].loopEnd = numeroDeCompases + 1 + "m"
              

     })
  }
}
    
///////////// Teclado /////////////

  if (instrumento === "teclado"){
      
    let sonidoTeclado = s.sonidos.teclado[indiceSonido].nombre;  
    tecladoSamplerF(sonidoTeclado, id, volumen, paneo);
    
     if (parte.length  == 0) {  // Logical operator corrected
        console.log("¡Comenzando secuencia del teclado!");
  
// let secuenciaDeNotasYacordes = crearAcordeDesdeLista(['E4', 'C4 D5 E5   ']); 
//     let secuenciaDeNotasYacordes = a.crearAcordeDesdeLista(notas); 
//    console.log("sec de notas y acordes", secuenciaDeNotasYacordes)

//        Tone.loaded().then(() => {
//       secuenciaDeNotasYacordes.forEach(function (n, index){            
//         new Tone.Sequence((time, note) => {
//          tecladoSampler[id].triggerAttackRelease(note, 0.1, time);
// }, n, '1m').start(0);
//       });
//    });
       
 
    Tone.loaded().then(() => {
       sequences[id] =  new Tone.Sequence((time, note) => {
         const letterNote = typeof note === "number" 
        ? Tone.Frequency(note, "midi").toNote()  // condition ? expressionIfTrue : expressionIfFalse;
        : note;
         tecladoSampler[id].triggerAttackRelease(letterNote, 0.1, time);
    }, notas, '1m').start(0);
      });

       
                    
} else if (parte.length > 0) {
     console.log("¡Comenzando acompañamiento del teclado!")
    
    // const parteTeclado = [{ "time": "0:1:0", "note": ['C4', 'E4', 'G4'], "duration": "4n" }, { "time": "0:3:0", "note": ['G4', 'B4', 'D4'], "duration": "4n" }]
//  // :: [{time, note, duration} , ... ] -> [{tonal chord}] -> [{time, note duration}, ...]

    let armoniaT = a.armoniaEnNotasExplicitas(armonia);    
    let eParte = { "time": "0:0:0", "note": 1, "duration": "4n", "octavaRelativa": 0 }
    let acorde = Tonal.Chord.get('Cmaj')
    
    // let parteTeclado_ =  a.asignarNotasSegunGradosDelAcordeTeclado(eParte, acorde, octavaAbsoluta);
    let parteTeclado_ =  a.acordesDelTeclado(parte, armoniaT, octavaAbsoluta);
    
    // :: [{time, note, duration} , ... ] -> [{tonal chord}] -> [{time, note duration}, ...]
 // function listaDeGradosAlistaDeNotasTeclado(elementosParteList, chordPropertiesList, octavaAbsoluta)
          
     Tone.loaded().then(() => {
       sequences[id] = new Tone.Part((time, value) => {
        tecladoSampler[id].triggerAttackRelease(value.note, value.duration, time);  
         // console.log("acorde", value.note);
    }, parteTeclado_).start(0);

       console.log('Sequence created for teclado' + id.toString(), id, sequences[id]);

      sequences[id].loop = true; // Enable looping
  
       let numeroDeCompases = a.numberOfMeasures(parteTeclado_);
       sequences[id].loopEnd = numeroDeCompases + 1 + "m"
     });
  } 
}
  
  
  
  ///////////// Bombo /////////////


   if (instrumento === "bombo") {   
     
     

    let sonidoBombo = s.sonidos.bombo[indiceSonido].nombre;
     bomboSamplerF(sonidoBombo, id, volumen, paneo);
     
     if (parte.length == 0 ) {  
        console.log("¡Comenzando secuencia del bombo!");

        // Create and start the sequence
        
      Tone.loaded().then(() => {
      console.log("Sampler fully loaded!");
        sequences[id] = new Tone.Sequence((time, note) => {
          bomboSampler[id].triggerAttackRelease(note, 0.1, time);
        }, notas, '1m');   // '1m' represents one measure as the interval

        sequences[id].start(0);

      });

  } else if (parte.length > 0) {
     console.log("¡Comenzando ritmo del bombo!")

      let parteDelBombo =  r.filtrarYaplanarParte(parte)

      Tone.loaded().then(() => {
       sequences[id] = new Tone.Part((time, value) => {
        bomboSampler[id].triggerAttackRelease(value.note, value.duration, time);
    }, parteDelBombo).start(0);
        
      console.log('Sequence created for bombo' + id.toString(), id, sequences[id]);

      sequences[id].loop = true; // Enable looping
  
       let numeroDeCompases = a.numberOfMeasures(parteDelBombo);
       sequences[id].loopEnd = numeroDeCompases + 1 + "m"
     })
   }
   }
  
  
  
  
  ///////////////contratiempos
  
  
  if (instrumento === "contratiempo" || instrumento === "contratiempos" || instrumento === "contras")  {
    
    let sonidoContratiempos = s.sonidos.contratiempo[indiceSonido].nombre;
    contrasSamplerF(sonidoContratiempos, id, volumen, paneo);     
  
    if (parte.length == 0 ) {  
        console.log("¡Comenzando secuencia del contratiempo!");

        // Create and start the sequence
        
      Tone.loaded().then(() => {
      console.log("Sampler fully loaded!");
        sequences[id] = new Tone.Sequence((time, note) => {
          contrasSampler[id].triggerAttackRelease(note, 0.1, time);
        }, notas, '1m');   // '1m' represents one measure as the interval

        sequences[id].start(0);

      });

  } else if (parte.length > 0) {
     console.log("¡Comenzando ritmo del contratiempo!")

    
    let parteDelContratiempo =  r.filtrarYaplanarParte(parte)
     
      Tone.loaded().then(() => {
       sequences[id] = new Tone.Part((time, value) => {
        contrasSampler[id].triggerAttackRelease(value.note, value.duration, time);
    }, parteDelContratiempo).start(0);
        
      console.log('Sequence created for contras' + id.toString(), id, sequences[id]);

      sequences[id].loop = true; // Enable looping
  
       let numeroDeCompases = a.numberOfMeasures(parteDelContratiempo);
       sequences[id].loopEnd = numeroDeCompases + 1 + "m"
     });
   }
  }
  
  
  ///////////////conga///////////////
  
  
  if (instrumento === "conga")  {
    
    let sonidoConga = s.sonidos.conga[indiceSonido].nombre;
    congaSamplerF(sonidoConga, id, volumen, paneo);     
  
    if (parte.length == 0 ) {  
        console.log("¡Comenzando secuencia del conga!");

        // Create and start the sequence
        
      Tone.loaded().then(() => {
      console.log("Sampler fully loaded!");
        sequences[id] = new Tone.Sequence((time, note) => {
          congaSampler[id].triggerAttackRelease(note, 0.1, time);
        }, notas, '1m');   // '1m' represents one measure as the interval

        sequences[id].start(0);

      });

  } else if (parte.length > 0) {
     console.log("¡Comenzando ritmo del conga!")

    
    let parteDeLaConga =  r.filtrarYaplanarParte(parte)
     
      Tone.loaded().then(() => {
       sequences[id] = new Tone.Part((time, value) => {
        congaSampler[id].triggerAttackRelease(value.note, value.duration, time);
    }, parteDeLaConga).start(0);
        
      console.log('Sequence created for conga' + id.toString(), id, sequences[id]);

      sequences[id].loop = true; // Enable looping
  
       let numeroDeCompases = a.numberOfMeasures(parteDeLaConga);
       sequences[id].loopEnd = numeroDeCompases + 1 + "m"
     });
   }
  }
  
}
  



