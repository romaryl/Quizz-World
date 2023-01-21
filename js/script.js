// le fichier display.js recense toutes les fonctions d'injection de HTML

let urls = [
    { img: "img/web.jpg", json: "json/quizzweb.json" },
    { img: "img/javascript.png", json: "json/quizzjavascript.json" },
    { img: "img/dates20.jpg", json: "json/quizzdates20.json" },
    { img: "img/nintendo.jpg", json: "json/quizznintendo.json" },
    { img: "img/nombres.jpg", json: "json/quizznombres.json" },
    { img: "img/microsoft.jpg", json: "json/quizzmicrosoft.json" },
    { img: "img/PHP.jpg", json: "json/quizzphp.json" },
    { img: "img/internet.jpg", json: "json/quizzinternet.json" }];

// déclaration du score, du compteur de questions et
// de l'username, leur portée doit être globale
let score = 0,
    question_counter = 0,
    user = "";

// début d'exécution de l'application
window.addEventListener("load", function () {
    console.log(urls)
    front_page(urls)
})

// initialisation de la page d'accueil
function front_page(urls) {
    score = 0;
    question_counter = 0;
    user = "";
    document.getElementById("quizz").innerHTML = "";
    urls.forEach(line => {
        // affichage des cards des différents quizz
        display_cards(line.img, line.json)
    })
}

// affichage des cards des questionnaires
async function display_cards(img_url, json_url) {
    let quizz = document.getElementById("quizz");

    const response = await fetch(json_url)
    if (response.ok) {
        let json = await response.json();
        // injection de toutes les cards des quizz
        quizz.innerHTML += print_homepage(json, img_url)
        radio_input()
    }
}

// procédure d'ajout des évènements sur les boutons radios
function radio_input() {
    let radios = Array.from(document.getElementsByTagName("input"));
    radios.forEach(radio => {
        radio.addEventListener("click", function () {
            // l'user doit saisir son prénom ou une valeur par défaut sera utilisée
            user = prompt("Saisissez votre prénom : ", "user")

            if (user != null) {
                // l'index du JSON vaut la valeur du premier chiffre de l'ID
                // du bouton radio moins 1
                let json_id = this.id.slice(0, 1) - 1,
                    difficulty_id = this.value;
                // recherche du JSON lié au bouton radio
                find_the_json(json_id, difficulty_id, user)
            } else this.checked = false; // le bouton radio est décoché si l'utilisateur annule
        })
    })
}

// fonction de recherche de la liste de question en fonction de l'ID du JSON et de la difficulté
// 'json_id' doit être un chiffre représentant l'index du json dans le tableau urls
// 'difficulty_id' doit être une string correspondant à "débutant", "confirmé" ou "expert"
// 'user' doit être l'input de l'user ou sa valeur par défaut
async function find_the_json(json_id, difficulty_id, user) {

    // recherche de l'url du JSON du quizz
    let json_url = urls[json_id].json;

    let response = await fetch(json_url);
    if (response.ok) {
        let json = await response.json();

        // affichage de la page de confirmation
        quizz.innerHTML = print_confirm(json, difficulty_id, user);

        // le bouton lance le début du quizz
        let button = document.getElementById("start");
        button.addEventListener("click", function () {
            let difficulty = json.quizz[difficulty_id]
            quizz_process(difficulty, user);
            document.getElementById("quizz").removeChild(button);
        })
    }
}

// programme principal du quizz
// 'questions' doit être la liste de questions correspondants à la difficulté choisie
function quizz_process(questions) {

    if (question_counter < 10) {
        // résolution de la question
        drag_and_resolve(questions)

        let next = document.getElementById("next"); // bouton "suivant"
        next.addEventListener("click", function () {
            // relance du quizz
            quizz_process(questions);
        })
    } else {
        // affichage du score
        document.getElementById("quizz_zone").innerHTML = print_score(user, score);
        // retour à la page d'accueil
        document.getElementById("reset").addEventListener("click", function () {
            front_page(urls);
        });
    }
}

// ajout des fonctionnalités glisser-déposer, résolution de question
function drag_and_resolve(questions) {
    let question = questions[question_counter],
        response = question["réponse"],
        anecdote = question["anecdote"];

    console.clear();
    console.table({
        "score : ": score, "question_counter : ": question_counter,
        "response : ": response, "anecdote : ": anecdote
    })

    // la question est injectée dans la div #quizz_zone
    let quizz_zone = document.getElementById("quizz_zone");
    quizz_zone.innerHTML = print_question(questions[question_counter]);

    let choice = document.getElementById("choice"); // zone de réception du drag

    // cette partie, gérant le glisser-déposer, est issu de : 
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
    //#region
    let responses = Array.from(document.getElementsByClassName("response"));
    responses.forEach(quizz_response => {

        quizz_response.addEventListener("dragstart", (ev) => {
            console.log("dragStart");
            // changement de la couleur d'arrière plan pour montrer que le glissement a commencé
            ev.currentTarget.setAttribute("style", "background-color : #ac5b19")
            // réinitialisation du cache
            ev.dataTransfer.clearData();
            // précision du format de données déplacées,
            // l'ID de l'objet déplacé sert ensuite à le retrouver
            ev.dataTransfer.setData("text/plain", ev.target.id);
        })

        quizz_response.addEventListener("dragend", (ev) =>
            // la couleur d'arrière plan est réinitialisée en cas de drop de l'objet
            ev.currentTarget.setAttribute("style", "background-color : #e17722")
        );
    })

    choice.addEventListener("dragover", (ev) => {
        console.log("dragOver");
        ev.preventDefault();
    });

    choice.addEventListener("drop", function (ev) {
        // l'attribut "draggable" des réponses est retiré
        responses.forEach(quizz_response => {
            quizz_response.setAttribute("draggable", "false");
        })
        // gestion d'affichage du texte
        choice.innerText = "";
        choice.classList.toggle("text-muted");

        console.log("Drop");
        ev.preventDefault();
        // le data correspond à l'ID de l'élément source
        const data = ev.dataTransfer.getData("text");
        // récupération de l'élément source par son ID
        const source = document.getElementById(data);

        let newNode = document.createElement("div");
        source.parentNode.insertBefore(newNode, source).classList.toggle("empty"); // petit bricolage pour l'affichage des questions
        // déplacement de l'élément source dans la zone de drop
        ev.target.appendChild(source);

        // conditions de réponse
        if (source.innerText == response) {
            score++;
            console.log(score);
            // changement de couleur de la zone de drop en cas de succès
            choice.setAttribute("style", "background-color : #17ff02");
            // affichage de l'anecdote
            document.getElementById("anecdote").setAttribute("style", "opacity : 1");
        } else {
            // changement de couleur de la zone de drop en cas d'erreur
            choice.setAttribute("style", "background-color : #c40c05");
        }

        // création d'une array contenant toutes les réponses, itère dessus
        // pour trouver la bonne réponse et la colore en vert
        responses = Array.from(document.getElementsByClassName("response"));
        responses.forEach(quizz_response => {
            console.log(quizz_response)
            if (quizz_response.innerText == response) {
                quizz_response.classList.toggle("valid");
            }
        })

        question_counter++;
    })
    //#endregion
}