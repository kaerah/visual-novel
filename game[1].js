document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://wkhuahnayminyjmpweig.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraHVhaG5heW1pbnlqbXB3ZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNTYzMzYsImV4cCI6MjA2MTgzMjMzNn0.AV_fZoLgl5GggmV5Vu7-N8CK9KzIjMu4bpCh0RAO0pY";
  window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log(" inicializado!");
});

window.submitScore = async function (name, score) {
  console.log("submitScore chamada com:", { name, score });

  const { error: insertError } = await supabase
    .from("scores")
    .insert([{ name, score }]);

  if (insertError) {
    console.error("Erro ao inserir pontuação:", insertError.message);
    showModal("Erro ao salvar pontuação. Tente novamente.");
  } else {
    console.log("Pontuação salva com sucesso!");
    showModal("Pontuação salva com sucesso! 🎉");
  }
};

  // Função para obter o ranking
  window.getRanking = async function () {
    console.log("Obtendo ranking...");
    const { data, error } = await supabase
      .from("scores")
      .select("name, score")
      .order("score", { ascending: false })
      .limit(10);
  
    if (error) {
      console.error("Erro ao obter ranking:", error.message);
      showModal("Erro ao obter ranking. Tente novamente.");
      return;
    }
  
    console.log("Ranking recebido:", data);
  
    if (!data || data.length === 0) {
      showModal("Nenhum dado encontrado no ranking.");
      return;
    }
  
    // Gera o conteúdo do ranking
    let rankingContent = `
      <h2>Ranking Global</h2>
      <ol style="text-align: left; padding-left: 20px;">
        ${data
          .map(
            (entry, index) =>
              `<li><strong>${index + 1}.</strong> ${entry.name} - <span style="color: #ff4081;">${entry.score} pontos</span></li>`
          )
          .join("")}
      </ol>
    `;
  
    // Exibe o ranking no modal
    showModal(rankingContent);
  };


async function updatePlayerStats(playerId, score, timePlayed) {
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .eq("player_id", playerId)
    .single();

  if (error) {
    console.error("Erro ao buscar estatísticas:", error.message);
    return;
  }

  //stats
  const stats = data || { games_played: 0, high_score: 0, total_time_played: 0 };
  stats.games_played++;
  stats.high_score = Math.max(stats.high_score, score);
  stats.total_time_played += timePlayed;

  const { error: updateError } = await supabase
    .from("stats")
    .upsert({ ...stats, player_id: playerId });

  if (updateError) {
    console.error("Erro ao atualizar estatísticas:", updateError.message);
  } else {
    console.log("Estatísticas atualizadas:", stats);
  }
}





window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    loadingScreen.style.display = "none"; // Oculta a tela de carregamento
  }
});

    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let heartInterval;
    let hueShift = 0;

    const frases = [
      "Você é meu ponto fraco 😳",
      "Mais um e meu coração é seu 💘",
      "Tô ficando boba com isso 😍",
      "Ai ai... 💓",
      "Você sabe que eu te adoro, né?",
      "Assim você me ganha! 😚",
      "Não para não 💞",
      "Você tá me fazendo ficar vermelha! 😳",
      "Coração acelerado! 💓",
      "Coraçãozinho batendo forte! 💓",

    ];

    const spiderFrases = [
      "Ai que susto!",
      "Tá se sabotando... 😖",
      "Se ligaaaa!",
      "Explosões não ajudam no amor",
      "Você tá jogando contra?",
      "Não acaba com o climaaa!"
    ];

    const menuScreen = document.getElementById("menuScreen");
    const gameScreen = document.getElementById("gameScreen");
    const gameOverScreen = document.getElementById("gameOverScreen");
    const scoreDisplay = document.getElementById("score");
    const timerDisplay = document.getElementById("timer");
    const finalScoreDisplay = document.getElementById("finalScore");
    const loveLevel = document.getElementById("loveLevel");
    const gameArea = document.getElementById("gameArea");
    const bgMusic = document.getElementById("bgMusic");
    const clickSound = document.getElementById("clickSound");


    function startGame() {
      score = 0;
      timeLeft = 30;
      hueShift = 0;
      scoreDisplay.textContent = "0";
      timerDisplay.textContent = "30";
      menuScreen.classList.remove("active");
      gameOverScreen.classList.remove("active");
      gameScreen.classList.add("active");
      bgMusic.volume = 0.2;
  
  // Exibe a barra de progresso
  const progressContainer = document.getElementById("progressContainer");
  progressContainer.style.display = "block";

      // Fix for iOS autoplay restrictions
      bgMusic.play().catch(() => {
        const playButton = document.createElement("button");
        playButton.textContent = "Tocar Música 🎵";
        playButton.style.position = "absolute";
        playButton.style.top = "10px";
        playButton.style.left = "50%";
        playButton.style.transform = "translateX(-50%)";
        playButton.style.zIndex = "1000";
        playButton.addEventListener("click", () => {
          bgMusic.play();
          playButton.remove();
        });
        document.body.appendChild(playButton);
      });
  
      gameInterval = setInterval(updateTimer, 1000);
      heartInterval = setInterval(spawnHeart, 800);
      spawnPoop(); // Para tempos aleatórios
      spawnSpider(); // Para tempos aleatórios
    
      updateProgressBar(score); // Reseta a barra de progresso

    }

    function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `⏰ ${timeLeft}`;

  // Adiciona a classe 'blink' quando faltam 3 segundos ou menos
  if (timeLeft <= 5) {
    timerDisplay.classList.add("blink");
  } else {
    timerDisplay.classList.remove("blink"); // Remove o efeito se o tempo for maior que 3
  }

  if (timeLeft <= 0) {
    endGame();
  }
}


//coracao
function spawnHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.top = Math.floor(Math.random() * 490) + "px";
  heart.style.left = Math.floor(Math.random() * 310) + "px";
  heart.style.filter = `hue-rotate(${hueShift}deg)`;

  heart.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    heart.remove();
    clickSound.play();

    // Toca som especial em corações aleatórios
    if (Math.random() < 0.5) {
      const voice = Math.random() < 0.5 ? document.getElementById("voz1") : document.getElementById("voz2");
      voice.play();
    }

    messageBubble(frases[Math.floor(Math.random() * frases.length)]);
    hueShift += 40;

    // Aumenta a dificuldade ao reduzir o intervalo de aparição
    if (score % 10 === 0 && heartIntervalTime > 400) {
      heartIntervalTime -= 50; // Reduz o intervalo em 50ms a cada 10 pontos
      clearInterval(heartInterval);
      heartInterval = setInterval(spawnHeart, heartIntervalTime);
    }
    updateProgressBar(score); // Atualiza a barra de progresso

  });

  gameArea.appendChild(heart);

  // Reduz o tempo de permanência com base na pontuação
  const heartLifetime = Math.max(1500 - score * 10, 500); // Tempo mínimo de 500ms
  setTimeout(() => {
    if (heart.parentElement) heart.remove();
  }, heartLifetime);
}

    //reloginho
    function spawnTimePowerUp() {
      const timePowerUp = document.createElement("div");
      timePowerUp.textContent = "⏰"; // Emoji de relógio
      timePowerUp.style.position = "absolute";
      timePowerUp.style.fontSize = "3em";
      timePowerUp.style.top = Math.floor(Math.random() * 490) + "px";
      timePowerUp.style.left = Math.floor(Math.random() * 310) + "px";
      timePowerUp.style.cursor = "pointer";
      timePowerUp.style.zIndex = "10";
      timePowerUp.style.animation = "pulse 1.2s infinite"; // Animação para destacar o power-up
    
      timePowerUp.addEventListener("click", () => {
        timeLeft += 5; // Adiciona 5 segundos ao cronômetro
        timerDisplay.textContent = `⏰ ${timeLeft}`;
        messageBubble("Mais tempo pra me conquistar!");
        timePowerUp.remove(); // Remove o power-up após o clique
      });
    
      gameArea.appendChild(timePowerUp);
    
      // Remove o power-up após 4 segundos se não for clicado
      setTimeout(() => {
        if (timePowerUp.parentElement) timePowerUp.remove();
      }, 2000); // Tempo ajustado para 4 segundos
    }
    
    // Faz o power-up aparecer com mais frequência (a cada 5 segundos, por exemplo)
    setInterval(() => {
      if (Math.random() < 0.3) spawnTimePowerUp(); // 20% de chance de aparecer
    }, 5000); // Intervalo reduzido para 5 segundos


    //coco
    function startPoopSpawner() {
      setInterval(() => {
        // Gera múltiplos cocôs simultaneamente
        for (let i = 0; i < poopCount; i++) {
          spawnPoop();
        }
      }, poopIntervalTime);
    
      // Aumenta a dificuldade gradualmente
      setInterval(() => {
        if (poopCount < 7) {
          poopCount++; // Aumenta o número de cocôs a cada 10 segundos
        }
        if (poopIntervalTime > 500) {
          poopIntervalTime -= 100; // Reduz o intervalo entre gerações
        }
      }, 10000); // Ajusta a dificuldade a cada 10 segundos
    }
  // Modify the startGame function to spawn poops periodically

  const poopFrases = [
    "Eca! 💩",
    "Isso não é um coração! 😖",
    "Cuidado onde clica! 🤢",
    "Que nojo! 💩",
    "Você perdeu pontos! 😔",
    "Não era isso que você queria, né? 😅"
  ];

  function spawnPoop() {
    const poop = document.createElement("div");
    poop.textContent = "💩";
    poop.style.position = "absolute";
    poop.style.fontSize = "2.5em";
    poop.style.top = Math.floor(Math.random() * 490) + "px";
    poop.style.left = Math.floor(Math.random() * 310) + "px";
    poop.style.cursor = "pointer";
    poop.style.zIndex = "10";
    poop.style.animation = "pulse 1.2s infinite"; // Add the same animation as the heart

    // Decrease score when the poop is clicked
    poop.addEventListener("click", () => {
      score--;
      scoreDisplay.textContent = score;
      poop.remove();
      clickSound.play(); // Optional: Play the same click sound
      messageBubble(poopFrases[Math.floor(Math.random() * poopFrases.length)]); // Show a random poop phrase
      updateProgressBar(score); // Atualiza a barra de progresso
    });

    gameArea.appendChild(poop);

    // Remove the poop after 2 seconds if not clicked
    setTimeout(() => {
      if (poop.parentElement) poop.remove();
    }, 2000);

      // Chama a função novamente após um tempo aleatório
  setTimeout(spawnPoop, Math.random() * 3000 + 1000); // Entre 1 e 4 segundos

  }


//bombinhas
function spawnSpider() {
  const spider = document.createElement("div");
  spider.textContent = "💣"; // Emoji de bomba
  spider.style.position = "absolute";
  spider.style.fontSize = "2.5em";
  spider.style.top = Math.floor(Math.random() * 490) + "px";
  spider.style.left = Math.floor(Math.random() * 310) + "px";
  spider.style.cursor = "pointer";
  spider.style.zIndex = "10";
  spider.style.animation = "pulse 1.2s infinite"; // Animação para destacar a aranha

  spider.addEventListener("click", () => {
    score -= 2; // Perde 2 pontos ao clicar na aranha
    scoreDisplay.textContent = score;
    spider.remove();
    clickSound.play();
    messageBubble(spiderFrases[Math.floor(Math.random() * spiderFrases.length)]); // Mostra uma frase aleatória
    updateProgressBar(score); // Atualiza a barra de progresso
  });

  gameArea.appendChild(spider);

  // Remove a aranha após 2 segundos se não for clicada
  setTimeout(() => {
    if (spider.parentElement) spider.remove();
  }, 2000);

    // Chama a função novamente após um tempo aleatório
    setTimeout(spawnSpider, Math.random() * 4000 + 2000); // Entre 2 e 6 segundos

}
//==============================================
//super coração
  function spawnSuperHeart() {
  const superHeart = document.createElement("div");
  superHeart.textContent = "💛";
  superHeart.style.position = "absolute";
  superHeart.style.fontSize = "3em";
  superHeart.style.top = Math.floor(Math.random() * 490) + "px";
  superHeart.style.left = Math.floor(Math.random() * 310) + "px";
  superHeart.style.cursor = "pointer";
  superHeart.style.zIndex = "10";
  superHeart.style.animation = "pulse 1.2s infinite";

  superHeart.addEventListener("click", () => {
    score += 5;
    scoreDisplay.textContent = score;
    superHeart.remove();
    clickSound.play();
    messageBubble("Você ganhou 5 pontos! 🌟");
    updateProgressBar(score); // Atualiza a barra de progresso
  });

  gameArea.appendChild(superHeart);

  setTimeout(() => {
    if (superHeart.parentElement) superHeart.remove();
  }, 3000);
}

setInterval(spawnSuperHeart, 10000); // Aparece a cada 10 segundos

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(100); // Vibra por 100ms
  }
}

// Exemplo: Vibração ao clicar em um coração
heart.addEventListener("click", () => {
  vibrate();
});
function endGame() {
  clearInterval(gameInterval);
  clearInterval(heartInterval);
  gameScreen.classList.remove("active");
  gameOverScreen.classList.add("active");

  // Esconde a barra de progresso
  const progressContainer = document.getElementById("progressContainer");
  progressContainer.style.display = "none";
  
  // Atualiza a pontuação final
  const finalScoreDisplay = document.getElementById("finalScoreDisplay");
  finalScoreDisplay.textContent = score;

  // Solicita o nome do jogador usando o modal
  showNameModal(async (playerName) => {
    await submitScore(playerName, score); // Salva no ranking
  });

  // Define a Thay correspondente
  const thayImage = document.getElementById("thayImage");
  if (score < 20) {
    thayImage.src = "./assets/thay_0.png"; // Nível tímido
  } else if (score < 40) {
    thayImage.src = "./assets/thay_1.png"; // Nível aquecendo os corações
  } else if (score < 60) {
    thayImage.src = "./assets/thay_2.png"; // Nível apaixonada
  } else {
    thayImage.src = "./assets/thay_3.png"; // Nível quer casar
  }

  // Define o nível de amor
  const loveLevelDisplay = document.getElementById("loveLevelDisplay");
  loveLevelDisplay.textContent = getLoveLevel(score);

  // Limpa a área do jogo
  gameArea.innerHTML = "";

  // Salva o recorde local
  saveHighScore();
}


  // Define o nível de amor
  const loveLevelDisplay = document.getElementById("loveLevelDisplay");
  loveLevelDisplay.textContent = getLoveLevel(score); // Exibe o nível de amor

  // Limpa a área do jogo
  gameArea.innerHTML = "";

  // Salva o recorde se for maior
  saveHighScore();

    function getLoveLevel(score) {
      if (score < 20) return "Nível de amor: 💔 tímido ainda...";
      if (score < 40) return "Nível de amor: 💗 tá aquecendo os corações!";
      if (score < 60) return "Nível de amor: 💖 apaixonou a Thay!";
      return "Nível de amor: 💘 Thay quer casar contigo!";
    }

    function messageBubble(text) {
      const bubble = document.createElement("div");
      bubble.textContent = "Thay: " + text;
      bubble.style.position = "absolute";
      bubble.style.bottom = "10px";
      bubble.style.left = "50%";
      bubble.style.transform = "translateX(-50%)";
      bubble.style.background = "rgba(255,255,255,0.8)";
      bubble.style.color = "#000";
      bubble.style.padding = "8px 14px";
      bubble.style.borderRadius = "12px";
      bubble.style.fontSize = "1em";
      bubble.style.zIndex = "999";
      gameScreen.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2000);
    }


    function saveHighScore() {
  const highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    showModal("Novo recorde! 🏆");
  }
}

function showHighScore() {
  const highScore = localStorage.getItem("highScore") || 0;
  showModal("Recorde atual: " + highScore + " pontos! 🏅");
}
    function goToMenu() {
      gameOverScreen.classList.remove("active");
      menuScreen.classList.add("active");
    }

    function showCredits() {
      const creditsModal = document.getElementById("creditsModal");
      const closeCreditsButton = document.getElementById("closeCreditsButton");
    
      creditsModal.style.display = "flex";
    
      closeCreditsButton.onclick = () => {
        creditsModal.style.display = "none";
      };
    }


    function showModal(message, callback) {
  const modal = document.getElementById("customModal");
  const modalText = document.getElementById("modalText");
  const modalButton = document.getElementById("modalButton");

  modalText.innerHTML = message; // Substitua textContent por innerHTML
  modal.style.display = "flex";

  modalButton.onclick = () => {
    modal.style.display = "none";
    if (callback) callback(); // Executa uma função opcional após fechar o modal
  };
}

function showNameModal(callback) {
  const nameModal = document.getElementById("nameModal");
  const playerNameInput = document.getElementById("playerNameInput");
  const saveNameButton = document.getElementById("saveNameButton");

  nameModal.style.display = "flex";

  saveNameButton.onclick = () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
      nameModal.style.display = "none";
      callback(playerName); // Passa o nome para a função de callback
    } else {
      alert("Por favor, insira um nome válido.");
    }
  };
}

function showTutorial() {
  const tutorialModal = document.getElementById("tutorialModal");
  const closeTutorialButton = document.getElementById("closeTutorialButton");

  tutorialModal.style.display = "flex";

  closeTutorialButton.onclick = () => {
    tutorialModal.style.display = "none";
  };

  // Fecha o modal automaticamente após 30 segundos
  setTimeout(() => {
    tutorialModal.style.display = "none";
  }, 30000);
}



function updateProgressBar(score) {
  const progressBar = document.getElementById("progressBar");
  const maxScore = 100; // Pontuação máxima para encher a barra
  const progress = Math.min((score / maxScore) * 100, 100); // Calcula a porcentagem (máximo de 100%)
  progressBar.style.width = progress + "%";

  // Altera a cor da barra conforme o progresso
  if (progress < 30) {
    progressBar.style.background = "linear-gradient(90deg, #ff0000, #ff8080)"; // Vermelho
  } else if (progress < 70) {
    progressBar.style.background = "linear-gradient(90deg, #ffcc00, #ffe680)"; // Amarelo
  } else {
    progressBar.style.background = "linear-gradient(90deg, #4caf50, #80e27e)"; // Verde
  }
}

