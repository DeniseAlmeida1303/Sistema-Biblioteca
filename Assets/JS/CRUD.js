// Seleciona o botão "Adicionar Livro"
const adicionarLivroBtn = document.querySelector('#cadastrarlivro');
adicionarLivroBtn.addEventListener("click", cadastrar);

// Seleciona o botão "Buscar"
const buscarBtn = document.querySelector(".btn-outline-warning");
buscarBtn.addEventListener("click", filtrarLivros);


let tabelaLivro = [];

window.addEventListener("load", () => {
  
  tabelaLivro = JSON.parse(localStorage.getItem("tabelaLivro")) || [];
  atualizar();
});

function atualizar() {
  document.querySelector("#tabela-livros").innerHTML = "";
  tabelaLivro.forEach(livro => {
    if (!livro.excluido) {
      document.querySelector("#tabela-livros").innerHTML += criarlivro(livro);
    }
  });
}

function criarlivro(livro) {
  const novolivro = `
    <tr>
      <td>${livro.CodLivro}</td>
      <td>${livro.titulo}</td>
      <td>${livro.autor}</td>
      <td>${livro.numPaginas}</td>
      <td>${livro.editora}</td>
      <td>${livro.genero}</td>
      <td>${livro.ano}</td>
      <td>${livro.idioma}</td>
      <td><button class="excluir-livro" data-codlivro="${livro.CodLivro}" onClick="apagar(event)">Excluir</button></td>
      <td><button class="editar-livro" data-codlivro="${livro.CodLivro}" onClick="editar(event)">Editar</button></td>
    </tr>`;
  return novolivro;
}

function apagar(event) {
  const botao = event.target;
  const tr = botao.closest("tr");
  if (!tr) return;

  const codigoLivro = tr.querySelector("td:first-child").textContent;
  const index = tabelaLivro.findIndex(livro => livro.CodLivro === codigoLivro);
  if (index !== -1) {
    tabelaLivro.splice(index, 1);
    localStorage.setItem("tabelaLivro", JSON.stringify(tabelaLivro));
    atualizar();
  }
}


function cadastrar() {
  const CodLivro = document.querySelector("#CodLivro").value;
  const titulo = document.querySelector("#titulo").value;
  const autor = document.querySelector("#autor").value;
  const numPaginas = document.querySelector("#numpaginas").value;
  const editora = document.querySelector("#editora").value;
  const genero = document.querySelector("#genero").value;
  const ano = document.querySelector("#ano").value;
  const idioma = document.querySelector("#idioma").value;

  const livro = {
    CodLivro,
    titulo,
    autor,
    numPaginas,
    editora,
    genero,
    ano,
    idioma,
    excluido: false
  };

  if (!isValid(livro.titulo, document.querySelector("#titulo"))) return;
  if (!isValid(livro.CodLivro, document.querySelector("#CodLivro"))) return;

  tabelaLivro.push(livro);
  localStorage.setItem("tabelaLivro", JSON.stringify(tabelaLivro));

  atualizar();
}

function isValid(valor, campo) {
  if (valor.length == 0) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    return false;
  } else {
    campo.classList.add("is-valid");
    campo.classList.remove("is-invalid");
    return true;
  }
}


const filtroInput = document.querySelector("#filtro");
filtroInput.addEventListener("input", filtrarLivros);



function filtrarLivros(event) {
  event.preventDefault(); // Impede o envio do formulário

  const filtro = filtroInput.value.trim();

  if (filtro === "") {
    atualizar();
    return;
  }

  const livrosFiltrados = tabelaLivro.filter(livro => livro.CodLivro.includes(filtro));

  atualizarLivrosFiltrados(livrosFiltrados);
}



function atualizarLivrosFiltrados(livros) {
  const tabelaLivros = document.querySelector("#tabela-livros");
  tabelaLivros.innerHTML = ""; // Limpa o conteúdo da tabela

  livros.forEach(livro => {
    if (!livro.excluido) {
      tabelaLivros.innerHTML += criarlivro(livro);
    }
  });
}

function editar(event) {
  
  const botaoEditar = event.target;
  const tr = botaoEditar.closest("tr");
  if (!tr) return;

  const codigoLivro = tr.querySelector("td:first-child").textContent;
  const livro = tabelaLivro.find(livro => livro.CodLivro === codigoLivro);
  if (!livro) return;
  localStorage.setItem("livroEditado", JSON.stringify(livro));

  // Cria a caixa de diálogo
  const dialog = document.createElement("div");
  dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(211, 211, 211);
    padding: 20px;
    border: 1px solid black;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    max-width: 500px;
  `;

  // Cria os campos de entrada para cada propriedade do livro
  const inputs = [];
  for (const propriedade in livro) {
    if (propriedade !== "excluido") {
      const label = document.createElement("label");
      label.textContent = propriedade;
      label.style.cssText = `
        font-weight: bold;
        text-decoration: underline;
      `;

      const input = document.createElement("input");
      input.type = "text";
      input.value = livro[propriedade];

      inputs.push(input);

      const campoContainer = document.createElement("div");
      campoContainer.style.cssText = `
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 10px;
        align-items: center;
      `;
      campoContainer.appendChild(label);
      campoContainer.appendChild(input);

      dialog.appendChild(campoContainer);
    }
  }

  // Cria o botão "Salvar"
  const botaoSalvar = document.createElement("button");
  botaoSalvar.textContent = "Salvar";
  botaoSalvar.style.cssText = `
    background-color: blue;
    color: white;
  `;
  botaoSalvar.addEventListener("click", () => {
    // Atualiza as propriedades do livro com os valores dos campos de entrada
    inputs.forEach((input, index) => {
      const propriedade = Object.keys(livro)[index];
      livro[propriedade] = input.value;
    });

    // Fecha a caixa de diálogo
    dialog.remove();

    // Atualiza a exibição da tabela
    atualizarLocalStorage()
    atualizar();
  });

  // Cria o botão "Cancelar"
  const botaoCancelar = document.createElement("button");
  botaoCancelar.textContent = "Cancelar";
  botaoCancelar.style.cssText = `
    background-color: red;
    color: white;
  `;
  botaoCancelar.addEventListener("click", () => {
    // Fecha a caixa de diálogo sem fazer nenhuma alteração
    dialog.remove();
  });

  const buttonsContainer = document.createElement("div");
  buttonsContainer.style.cssText = `
    grid-column: 1 / span 2;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  `;
  buttonsContainer.appendChild(botaoSalvar);
  buttonsContainer.appendChild(botaoCancelar);

  dialog.appendChild(buttonsContainer);

  // Adiciona a caixa de diálogo ao corpo do documento
  document.body.appendChild(dialog);

  
}
function atualizarLocalStorage() {
  localStorage.setItem("tabelaLivro", JSON.stringify(tabelaLivro));
  }
