$(document).ready(function () {

    $("#character").focus();
});

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

let character = '';
let dataCharactere = '';
let category = [];
let nbCategory = 0;
let theme = '';
let trying = 0;
let gameOn;

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
    }, "json");
    if (dataCharactere.length != 0) {
        $("#menu").addClass('hide');
        $("#menuQuestion").fadeIn(2000);
        randomQuestion();
    }
}

function randomQuestion() {
    if (!gameOn) {
        $.each(dataCharactere, function (indexChara, valueChara) {
            if (indexChara == 'films' || indexChara == 'parkAttractions' || indexChara == 'tvShows' || indexChara == 'videoGames' && valueChara.length != 0) {
                category.push(indexChara);
                nbCategory++;
            }
        });
    }
    if (category.length > 0) {
        let randomValue = Math.floor(Math.random() * nbCategory);
        nbCategory--;
        theme = category[randomValue];
        category.splice(randomValue, 1);
        $("#typeQuestion").text(theme.replace(/([a-z])([A-Z])/g, '$1 $2'));
        $("#question").text('In which ' + theme.replace(/([a-z])([A-Z])/g, '$1 $2') + ' do we see ' + character + '?');
        $("#help").addClass('show');
        $("#answer").val('');
        $("#answer").focus();
        gameOn = true;
    }
    else{
        setTimeout(() => {
            location.reload();
         }, 5000);
    }
}

function checkAnswer() {
    let answer = $("#answer").val();
    let responses = [];
    let goodAnswer;
    //Check if answer is not empty
    if (answer.length >= 1) {
        $.each(dataCharactere[theme], function (themeIndex, themeTitle) {
            //check if player answer AND answer length is superior than 2 (So if the answer for "The lion king" is "Lion" that will not work)
            if (themeTitle.split(' ').length >= 2 && answer.split(' ').length >= 2) {
                if (answer.split(' ').some(item => themeTitle.includes(item))) {
                    goodAnswer = true;
                    return false;
                }
                else {
                    goodAnswer = false;
                }
            }
            else if (themeTitle.split(' ').length == 1 && answer.split(' ').length == 1) {
                if (answer.split(' ').some(item => themeTitle.includes(item))) {
                    goodAnswer = true;
                    return false;
                }
                else {
                    goodAnswer = false;
                }
            }
            else{
                goodAnswer = false;
            }
            responses.push(themeTitle);
        });

        if (goodAnswer) {
            if (nbCategory == 0) {
                alert("Congratulations !" , 
                `
                    <p>You are a Disney connoisseur!</p><br>
                    <p>The page will auto refresh</p>
                `,
                "/pictures/mickey_happy.gif")
                $("#menuQuestion").fadeOut(2000)
            }
            else{
                alert("Congratulations", "<p>You got the right answer</p>", "/pictures/mickey_happy.gif");
            }
            trying = 0;
            $("#category").text("Not unlocked yet");
            $("#solutions").empty()
            randomQuestion();
        }
        else{
            alert("We are really sorry", "<p>Your answer is not correct</p>", "/pictures/mickey_sad.png");
            trying++
            if (trying == 3) {
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
    else {
        alert("We are really sorry", "<p>Your answer is not complete</p>", "/pictures/mickey_sad.png");
    }
}

function alert(msgTitle, msg, imgLink) {
    $("#alertTitle").text('');
    $("#alertTitle").text(msgTitle);
    $("#alertMsg").empty();
    $("#alertMsg").html(msg);
    $("#mickeyEmotions").attr('src', imgLink);
    $("#alert").toggleClass('hide');
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
    location.reload();
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