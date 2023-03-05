$(document).ready(function () {

    $("#character").focus();

    $("#character").keydown(function (event) {
        if (event.code === 'Enter') {
            getCharacter();
        }
    });

    $("#answer").keydown(function (event) {
        if (event.code === 'Enter') {
            checkAnswer();
        }
    });
});

let character = '';
let dataCharactere = '';
let category = [];
let nbCategory = 0;
let theme = '';
let trying = 0;
let gameOn;

function alert(msgTitle, msg, imgLink) {
    $("#alertTitle").text(msgTitle);
    $("#alertMsg").html(msg);
    $("#mickeyEmotions").attr('src', imgLink);
    $("#alert").toggleClass('hide');
    $("#close").focus();
}

function getCharacter() {
    character = $("#character").val();
    let url = "https://api.disneyapi.dev/character?name=" + encodeURI(character)
    //GET Data from API Disney
    $.get(url, function (dataDisney) {
        if (dataDisney.count == 1) {
            dataCharactere = dataDisney.data['0'];
        }
        //If more than 2 charactere we will check which one is correct
        else if (dataDisney.count > 1) {
            for (let i = 0; i < dataDisney.data.length; i++) {
                if (dataDisney.data[i].name == character) {
                    dataCharactere = dataDisney.data[i];
                }
            }
        }
        else {
            alert("We are really sorry", "<p>We didn't find your character</p>", "/pictures/mickey_sad.png");
        }
        $("#menu").addClass('hide')
        $("#menuQuestion").fadeIn(2000);
        randomQuestion(dataCharactere);
    }, "json");
}

function randomQuestion(infoCharacter) {
    if (!gameOn) {
        $.each(infoCharacter, function (indexChara, valueChara) {
            if (indexChara == 'films' || indexChara == 'parkAttractions' || indexChara == 'tvShows' || indexChara == 'videoGames' && valueChara.length != 0) {
                category.push(indexChara);
                nbCategory++;
            }
        });
    }
    let randomValue = Math.floor(Math.random() * nbCategory);
    theme = category[randomValue];
    $("#typeQuestion").text(theme.replace(/([a-z])([A-Z])/g, '$1 $2'));
    $("#question").text('In which ' + theme.replace(/([a-z])([A-Z])/g, '$1 $2') + ' do we see ' + character + '?');
    $("#help").addClass('show');
    $("#answer").focus();
    gameOn = true;
}

function checkAnswer() {
    let answer = $("#answer").val();
    let responses = [];
    let goodAnswer;
    if (answer.length > 0) {
        $.each(dataCharactere[theme], function (themeIndex, themeTitle) {
            if (answer.split(' ').some(item => themeTitle.includes(item))) {
                goodAnswer = true;
                return false;
            }
            else {
                goodAnswer = false;
            }
            responses.push(themeTitle);
        });
    }
    else {
        alert("We are really sorry", "<p>Your answer is not complete</p>", "/pictures/mickey_sad.png");
    }
    if (goodAnswer) {
        alert("Congratulations", "You got the right answer", "/pictures/mickey_happy.png");
        trying = 0
    }
    else{
        alert("We are really sorry", "<p>Your answer is not complete</p>", "/pictures/mickey_sad.png");
        trying++
        if (trying == 2) {
            let html = '<ul>';
            $("#category").text(theme.replace(/([a-z])([A-Z])/g, '$1 $2'));
            for (let i = 0; i < responses.length; i++) {
                html += '<li>'+responses[i]+'</li>';
            }
            html += '</ul>';
            $("#solutions").html(html)
        }
    }
}

function helpQuestion() {
    if ($("#helpingDiv").hasClass('show')) {
        $("#helpingDiv").removeClass('show');
        $("#helpingDiv").addClass('hide');
    }
    else{
        $("#helpingDiv").addClass('show');
        $("#helpingDiv").removeClass('hide');
    }
}

function resetQuestion() {
    location.reload()
}

function showRules() {
    alert(
        'Rules',
        `<ul>
            <li>
                Select the Disney character you want to play with.
            </li>
            <li>
                A series of questions will be asked.
            </li>
            <li>
                Maximum 4 questions (1 per category).
            </li>
            <li>
                Films, park attractions, TV Shows, Video Games.
            </li>
        </ul>`,
        '/pictures/mickey_pointing_up.png'
    );
}