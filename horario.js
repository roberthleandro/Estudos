const container = document.querySelector("#container-horas");
const totalHorasEl = document.querySelector(".totalhoras");
const totalDiasEl = document.querySelector(".totaldias");
const leticiaEl = document.querySelector(".leticia");
const resetBtn = document.querySelector(".extra button");

const VERDE = "rgb(138, 233, 138)";
const STORAGE_KEY = "horasApp";

// ===== ESTADO PADRÃO =====
const defaultState = {
  totalMin: 0,
  diasRestantes: 30,
  leticia: 0,
  dias: Array.from({ length: 30 }, () => ({
    time: "",
    confirmado: false,
  })),
};

// ===== LOAD / SAVE =====
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : structuredClone(defaultState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// ===== UTIL =====
function timeToMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function renderTotais() {
  const h = Math.floor(state.totalMin / 60);
  const m = state.totalMin % 60;

  totalHorasEl.innerText = `${h}:${String(m).padStart(2, "0")}`;
  totalDiasEl.innerText = state.diasRestantes;
  leticiaEl.innerText = state.leticia;
}

// ===== RESET PARCIAL (MANTÉM LETICIA) =====
function resetHoras() {
  state.totalMin = 0;
  state.diasRestantes = 30;
  state.dias = Array.from({ length: 30 }, () => ({
    time: "",
    confirmado: false,
  }));
  saveState();
  location.reload();
}

// ===== CRIA CARDS =====
renderTotais();

for (let i = 0; i < 30; i++) {
  const card = document.createElement("div");
  card.classList.add("horas", "campo");

  const block = document.createElement("div");
  block.classList.add("block");

  const titulo = document.createElement("h3");
  titulo.innerText = `Dia ${i + 1}`;

  const label = document.createElement("label");
  label.innerText = "Horas:";

  const input = document.createElement("input");
  input.type = "time";

  const btn = document.createElement("button");
  btn.classList.add("verde");

  block.append(label, input);
  card.append(titulo, block, btn);
  container.appendChild(card);

  // ===== RESTAURA ESTADO =====
  const dia = state.dias[i];

  input.value = dia.time;

  if (dia.confirmado) {
    card.style.background = VERDE;
    input.disabled = true;
    btn.innerText = "Desconfirmar";
  } else {
    btn.innerText = "Confirmar";
  }

  // ===== CLICK =====
  btn.addEventListener("click", () => {
    // CONFIRMAR
    if (!dia.confirmado) {
      if (!input.value) return;

      const min = timeToMin(input.value);

      state.totalMin += min;
      state.diasRestantes--;
      dia.time = input.value;
      dia.confirmado = true;

      // UI
      card.style.background = VERDE;
      input.disabled = true;
      btn.innerText = "Desconfirmar";
    }
    // DESCONFIRMAR
    else {
      const min = timeToMin(dia.time);

      state.totalMin -= min;
      state.diasRestantes++;
      dia.time = "";
      dia.confirmado = false;

      // UI
      card.style.background = "";
      input.disabled = false;
      input.value = "";
      btn.innerText = "Confirmar";
    }

    // ===== REGRA DO HAMBÚRGUER =====
    if (state.totalMin >= 40 * 60) {
      alert("🎉 Você ganhou 1 hambúrguer! 🍔");
      state.leticia += 1;
      saveState();
      resetHoras();
      return;
    }

    saveState();
    renderTotais();
  });
}
resetBtn.addEventListener("click", () => {
  const saved = JSON.parse(localStorage.getItem("horasApp"));
  const leticiaAtual = saved?.leticia || 0;

  const novoEstado = {
    totalMin: 0,
    diasRestantes: 30,
    leticia: 0,
    dias: Array.from({ length: 30 }, () => ({
      time: "",
      confirmado: false,
    })),
  };

  localStorage.setItem("horasApp", JSON.stringify(novoEstado));
  location.reload();
});
