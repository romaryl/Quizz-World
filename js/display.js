//// FONCTIONS D'AFFICHAGE DES DIFFERENTES PAGES ////
// chaque fonction d'affichage renvoit le HTML à injecter

// page d'accueil
// 'json' doit être le JSON entier de chaque quizz
// 'img_url' doit être l'URL de l'image liée au JSON
function print_homepage(json, img_url) {
    let html = `
        <div class="d-flex flex-column card p-2" id="${json.id}"> 
            <h3 class="text-center">${json.titre}</h2>
            <img src="${img_url}" class="h-100">
            <div class="text-center mt-1 d-flex flex-row flex-sm-column flex-lg-row">
                <div class="col-4 p-0 ms-1 flex-lg-column d-flex flex-row radio">
                    <input type="radio" id="${json.id + 1}" name="${json.titre}" value="débutant">
                    <label for="${json.id + 1}">Débutant</label>
                </div>
                <div class="col-4 p-0 ms-1 d-flex flex-lg-column flex-row radio">
                    <input type="radio" id="${json.id + 2}" name="${json.titre}" value="confirmé">
                    <label for="${json.id + 2}">Confirmé</label>
                </div>
                <div class="col-4 p-0 ms-1 d-flex flex-lg-column flex-row radio">
                    <input type="radio" id="${json.id + 3}" name="${json.titre}" value="expert">
                    <label for="${json.id + 3}">Expert</label>
                </div>
            </div>
        </div>    
    `;
    return html;
}

// page de confirmation
// 'json' doit être le JSON entier de chaque quizz
// 'difficulty' doit être la string du niveau de difficulté
// 'user' doit être l'input de l'user ou sa valeur par défaut
function print_confirm(json, difficulty, user) {
    let html = `
    <h2 class="text-center">${json.titre} - Niveau ${difficulty}</h2>
    <div id="quizz_zone" class="text-center">
        <h3 class=""><span id="username">${user}</span>, vous allez pouvoir démarrer ce Quizz !!</h3>
        <img class="w-50 m-4" id="confirm_img" src="${urls[json.id - 1].img}">
    </div>
    <input class="m-auto" id="start" type="button" value="Démarrez le Quizz"></input>
    `
    return html;
}

// affichage d'une question
// 'question' doit être l'objet entier d'une unique question
function print_question(question) {
    let html = `
        <div id="question"><span class="text-white">Question ${question_counter+1} : </span>${question.question}</div>
        <div id="anecdote">${question.anecdote}</div>
        <div id="responses" class="row justify-content-between m-5">
            <span id="r1" class="response" draggable="true">${question.propositions[0]}</span>
            <span id="r2" class="response" draggable="true">${question.propositions[1]}</span>
            <span id="r3" class="response" draggable="true">${question.propositions[2]}</span>
            <span id="r4" class="response" draggable="true">${question.propositions[3]}</span>
        </div>
        <div class="m-5">
            <span id="choice" class="col-10 col-sm-4 m-3 text-muted">Posez votre réponse ici !!!</span>
            <input id="next" class="align-top" type="button" value="Suivant"></input>
        </div>
    `
    return html;
}

// affichage de la page de scure
// 'user' doit être le nom d'utilisateur ou sa valeur par défaut
// 'score' doit être le score de l'utilisateur
function print_score(user, score){
    let html = `
        <h3>Quizz Terminé !!</h3>

        <h3 class="m-5"><span id="username">${user}</span>, vous avez obtenu le score de <span id=score>${score}/10</span></h3>
        <input type="button" id="reset" class="m-5" value="Accueil">
    `
    return html;
}