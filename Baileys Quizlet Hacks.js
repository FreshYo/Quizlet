var defaultExtensionSettings = {
	"developer": "Bailey Pitt",
        "gravity": {
            "score": 0
        },
        "learn": {
            "speed": 700
        },
        "live": {
            "answerDelay": 100,
            "autoAnswer": 1,
            "displayAnswer": 1,
            "key": "c"
        },
        "match": {
            "time": 0.5
        },
        "night": false,
        "test": {
            "key": "c"
        }
    },
    gravityScore,
    href = window.location.href;

function obfuscate(msg, num) {
	var answer = "";
	for (let i = 0; i < msg.length; i++) {
		answer = answer + ("-" + (msg.charCodeAt(i) + num % (i + 1)));
	}
	return answer.slice(1);
}

function saveExtensionSettings(settings) {
    if (localStorage && typeof settings == 'object') localStorage.setItem('extensionSettings', JSON.stringify(settings));
}

function resetExtensionSettings() {
    if (localStorage) {
        localStorage.setItem('extensionSettings', JSON.stringify(defaultExtensionSettings));
        window.location.reload();
    }
}

function getExtensionSettings() {
    if (localStorage) {
        var savedExtensionSettings = localStorage.getItem('extensionSettings');
        if (!savedExtensionSettings) resetExtensionSettings();
        return JSON.parse(localStorage.getItem('extensionSettings'));
    }
    return defaultExtensionSettings;
}

(function () {
    var styles = document.createElement('style');
    styles.textContent = `
        #extensionSettingsContainer {
            border-top: 25px solid #d86d02;
            height: 350px; width: 300px;
            background-color: #000;
            border-radius: 5px;
            position: fixed;
            display: block;
            line-height: 1;
            padding: 10px;
            color: #fff;
        }

        #extensionSettingsContainer h2 {
            margin-top: 10px;
        }

        #extensionSettingsContainer input {
            background-color: rgba(255, 255, 255, .8);
            margin-right: 10px;
            border-radius: 2px;
            max-width: 150px;
            outline: none;
            float: right;
            color: #000;
        }

        #extensionSettingsContainer #saveSettings {
            width: 100%; height: 30px;
            border-radius: 5px;
            outline: none;
        }

        #extensionSettingsContainer .adaptKeyInput {
            width: 70px;
        }

        #extensionSettingsContainer .numberOnlyInput {
            width: 80px;
        }

        #extensionSettingsContainer .extensionMenuItem {
            margin-right: 5px;
            cursor: pointer;
            float: right;
        }

        #extensionSettingsContainer .extensionMenuItem:hover {
            color: #8c8c8c;
        }
    `.trim();

    var elem = document.createElement('div');
    elem.id = 'extensionSettingsContainer';
    elem.style.boxShadow = '0 5px 35px rgba(0, 0, 0, .65)';
    elem.style.backgroundColor = '#000';
    elem.style.zIndex = '999999999';
    elem.style.position = 'fixed';
    elem.style.display = 'block';
    elem.style.height = '380px';
    elem.style.width = '300px';
    elem.style.color = '#fff';
    elem.style.left = '0';
    elem.style.top = '0';

    elem.innerHTML = `
        <span class="extensionMenuItem" id="extensionExitButton">&times;</span>
        <span class="extensionMenuItem" id="extensionResetButton">&#8634;</span>
        <h2>Settings</h2>
        <div>Gravity Score<input id="gravityScoreInput" class="numberOnlyInput"></input></div><br>
        <div>Learn Speed<input id="learnSpeedInput" class="numberOnlyInput"></input></div><br>
        <div>Live Answer Delay<input id="liveDelayInput" class="numberOnlyInput"></input></div><br>
        <div>Live Auto-Answer<input id="liveAutoAnswerInput" type="checkbox"></input></div><br>
        <div>Live Show Answer<input id="liveShowAnswerInput" type="checkbox"></input></div><br>
        <div>Live Toggle Key<input name="live" class="adaptKeyInput" id="liveKeyInput"></input></div><br>
        <div>Match Time<input id="matchTimeInput" class="numberOnlyInput"></input></div><br>
        <div>Test Key<input name="test" class="adaptKeyInput" id="testKeyInput"></input></div><br>
        <button id='saveSettings'>Save</button>
    `.trim();

    document.body.appendChild(elem);
    document.head.appendChild(styles);

    let inputs = document.getElementsByClassName('adaptKeyInput');

    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input.onkeypress = changeSettingOnKey;
        input.onkeydown = changeSettingOnKey;
        input.onkeyup = changeSettingOnKey;
    }

    inputs = document.getElementsByClassName('numberOnlyInput');
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input.onkeydown = function (e) {
            if (!/^([0-9.,]|Backspace)$/i.test(e.key)) e.preventDefault();
        }
    }

    document.getElementById('extensionResetButton').onclick = resetExtensionSettings;

    document.getElementById('extensionExitButton').onclick = function () {
        this.parentElement.remove();
    }

    document.getElementById('saveSettings').onclick = () => {
        saveExtensionSettings({
            "gravity": {
                "score": parseInt(document.getElementById('gravityScoreInput').value)
            },
            "learn": {
                "speed": parseInt(document.getElementById('learnSpeedInput').value)
            },
            "live": {
                "answerDelay": parseInt(document.getElementById('liveDelayInput').value),
                "autoAnswer": document.getElementById('liveAutoAnswerInput').checked,
                "displayAnswer": document.getElementById('liveShowAnswerInput').checked,
                "key": document.getElementById('liveKeyInput').value
            },
            "match": {
                "time": Number(document.getElementById('matchTimeInput').value)
            },
            "night": false,
            "test": {
                "key": document.getElementById('testKeyInput').value
            }
        });
    };

    let settings = getExtensionSettings();
    document.getElementById('gravityScoreInput').value = settings.gravity.score;
    document.getElementById('learnSpeedInput').value = settings.learn.speed;
    document.getElementById('liveDelayInput').value = settings.live.answerDelay;
    document.getElementById('liveAutoAnswerInput').checked = settings.live.autoAnswer;
    document.getElementById('liveShowAnswerInput').checked = settings.live.displayAnswer;
    document.getElementById('liveKeyInput').value = settings.live.key;
    document.getElementById('matchTimeInput').value = settings.match.time;
    document.getElementById('testKeyInput').value = settings.test.key;
    console.log('Loaded Extension Settings!');

    function changeSettingOnKey(e) {
        e.preventDefault();
        this.value = e.key;
    }
})();

(function loadModule() {
    initLoad();
    function initLoad() {
        if (href.includes("quizlet.com")) {
            try {
                const email = window.Quizlet.coreData.user.email
                if (email.indexOf('sandi.net') != -1) alert('Mrs. Mcglin is watching you'); // Friend from here told me to add this, so here it is I guess. Mr West I think is teacher of IT for him. This shouldn't affect anything so OK...
            } catch (e) { console.log('Error getting email, but email isn\'t important so ignore this.'); }

            if (href.includes("/learn")) {
                cAlert('<h2>Game Mode: Learn</h2>Thank you for using Baileys Quzlet Hacks V.0.1.2 Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>Just wait for this script to finish!<br><br><button class="UIButton" id="learnButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("learnButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                    learn();
                });
            } else if (href.includes("/flashcards")) {
                cAlert('<h2>Game Mode: Flashcards</h2>Thank you for using Baileys Quzlet Hacks V.0.1.2 Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Changelog:</h4>+ Added Match time freeze for regular match and diagrams<br>+ Added Gravity score exploit to get ANY score you want!<br>+ Added custom alert box<br>+ Fixed graphics<br>- Removed useless alert boxes.<h4>Instructions:</h4>Umm why are you here? Go cheat somewhere else...<br><br><button class="UIButton" id="flashcardsButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("flashcardsButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                });
            } else if (href.includes("/write")) {
                cAlert('<h2>Game Mode: Write</h2>Thank you for using Baileys Quzlet Hacks V.0.1.2 Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>You dont even have to wait,<br> this is my favorite one to watch!<br><br><button class="UIButton" id="writeButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("writeButton").addEventListener("click", function () {
                    document.getElementById("customMessageContainer").remove();
                    write();
                });
            } else if (href.includes("/spell")) {
                cAlert('<h2>Game Mode: Spell</h2>Thank you for using Baileys Quzlet Hacks V.0.1.2 Quizlet Exploit<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>Nothing! Bypassed having to press enter!<br><br><button class="UIButton" id="spellButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
                getId("spellButton").addEventListener("click", function () {
     …