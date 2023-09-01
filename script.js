// Obtém o elemento canvas e seu contexto 2D
var cnv = document.getElementById("cnv");
var ctx = cnv.getContext("2d"); // Obtém o contexto de renderização 2D do canvas

cnv.width = 800;
cnv.height = 580;

// Inicialização de variáveis
var xMouse, yMouse; // Variáveis para coordenadas do mouse
var placar = 0; // Contador de pontos
var totalMoscas = 0; // Contador de moscas
var moscas = []; // Array para armazenar as posições das moscas
var mosca = new Image(); // Elemento de imagem para mosca
var raquete = new Image(); // Elemento de imagem para raquete
var cenario = new Image(); // Elemento de imagem para cenário
var gameOver = new Image(); // Elemento de imagem para game over

// Define os URLs das imagens
mosca.src = "spr/mosca.png";
raquete.src = "spr/raquete.png";
cenario.src = "img/quarto.jpg";
gameOver.src = "img/gameover.png";

// Adiciona um ouvinte de evento para detectar clique do mouse
cnv.addEventListener('mousedown', function (e) {
    let mouseX = e.clientX - cnv.getBoundingClientRect().left;
    let mouseY = e.clientY - cnv.getBoundingClientRect().top;

    for (var i = 0; i < moscas.length; i++) {
        let moscaX = moscas[i].x;
        let moscaY = moscas[i].y;

        if (mouseX >= moscaX && mouseX <= moscaX + mosca.width &&
            mouseY >= moscaY && mouseY <= moscaY + mosca.height) {
            placar++;
            moscas.splice(i, 1); // Remove a mosca acertada do array
            i--; // Reduz o índice para ajustar a iteração
            totalMoscas--;
        }
    }
}, false);

// Adiciona um ouvinte de evento para detectar movimento do mouse
cnv.addEventListener('mousemove', function (e) {
    var rect = cnv.getBoundingClientRect(); // Obtém o retângulo de posicionamento do canvas
    xMouse = e.clientX - rect.left-55; // Ajusta a coordenada horizontal do mouse
    yMouse = e.clientY - rect.top-55; // Ajusta a coordenada vertical do mouse
}, false);

function novaPosicaoMosca() {
    return {
        x: Math.random() * (cnv.width - mosca.width),
        y: Math.random() * (cnv.height - mosca.height),
        velocidadeX: (Math.random() - 3) * 2, // Velocidade horizontal aleatória
        velocidadeY: (Math.random() - 3) * 2 // Velocidade vertical aleatória
    };
}

function atualizarPosicoesMoscas() {
    for (var i = 0; i < moscas.length; i++) {
        moscas[i].x += moscas[i].velocidadeX;
        moscas[i].y += moscas[i].velocidadeY;

        // Se a mosca sair do cenário, ajusta sua posição
        if (moscas[i].x < 0 || moscas[i].x > cnv.width - mosca.width) {
            moscas[i].velocidadeX *= -1;
        }
        if (moscas[i].y < 0 || moscas[i].y > cnv.height - mosca.height) {
            moscas[i].velocidadeY *= -1;
        }
    }
}
function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.drawImage(cenario, 0, 0, cnv.width, cnv.height);

    atualizarPosicoesMoscas(); // Atualiza as posições das moscas voando

    for (var i = 0; i < moscas.length; i++) {
        ctx.drawImage(mosca, moscas[i].x, moscas[i].y);
    }

    ctx.drawImage(raquete, xMouse, yMouse);

    ctx.font = "25px serif";
    ctx.fillText("Pontos: " + placar, 30, 30);
    ctx.fillText("Qtd Moscas: " + totalMoscas, 30, 60);

    if (totalMoscas > 20) {
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.drawImage(gameOver, 0, 0, cnv.width, cnv.height);
        return; // Encerra a função draw para finalizar o jogo
    }

    requestAnimationFrame(draw);
}

setInterval(function () {
    if (totalMoscas < 20) {
        moscas.push(novaPosicaoMosca()); // Adiciona uma nova mosca ao array
        totalMoscas++;
    }
}, 2000); // Intervalo para adicionar moscas (2 segundos)

draw(); // Inicia o loop de renderização


