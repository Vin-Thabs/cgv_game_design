var statsArray = [];
var volume = 0.5;
var difficulty = 'MEDIUM';
var waveLength = 5


async function displayMenu(){
    document.getElementById('menuScreen').style.display = 'flex';
    showMenuOptions();
    await getStats();
}

async function showMenuOptions(){
    document.getElementById('menu-list').style.display = 'flex';

    waveLength = Number(window.localStorage.getItem('wave')) || 5;
    difficulty = window.localStorage.getItem('difficaulty') || 'MEDIUM';
    volume = Number(window.localStorage.getItem('volume')) || 0.5;
    
}

function showCredits(){
    //ShowingCredits
    document.getElementById('menu-list').style.display = 'none';
    const statsList = document.getElementById('credits-list');
    statsList.style.display ='flex';
}


function showStats(){
    //Getting Stats
    document.getElementById('menu-list').style.display = 'none';
    const statsList = document.getElementById('stats-list');
    statsList.style.display ='flex';

    // Remove all the contents of the stats so we can rebuild
    if(document.getElementById('stats-names')){
        document.getElementById('stats-names').remove()
        document.getElementById('stats-time').remove()
        document.getElementById('stats-waves').remove()
    }
    

    // Rebuild the stats
    // Name Div
    const statsName = document.createElement('div');
    statsName.id = 'stats-names';
    statsName.className = 'stats-names';
    const nameHeader = document.createElement('h1');
    nameHeader.innerText = 'Name';
    statsName.appendChild(nameHeader);
    const divider1 = document.createElement('div');
    divider1.className = 'divider';
    statsName.appendChild(divider1)
    statsList.appendChild(statsName)

    // Time Div
    const timerStatsDiv = document.createElement('div');
    timerStatsDiv.id = 'stats-time';
    timerStatsDiv.className = 'stats-time';
    const timerStats = document.createElement('h1');
    timerStats.innerText = 'Time';
    timerStatsDiv.appendChild(timerStats);
    const divider2 = document.createElement('div');
    divider2.className = 'divider';
    timerStatsDiv.appendChild(divider2)
    statsList.appendChild(timerStatsDiv);

    // Wave DIv
    const waveStatsDiv = document.createElement('div');
    waveStatsDiv.id = 'stats-waves';
    waveStatsDiv.className = 'stats-waves';
    const waveStats = document.createElement('h1');
    waveStats.innerText = 'Wave';
    waveStatsDiv.appendChild(waveStats);
    const divider3 = document.createElement('div');
    divider3.className = 'divider';
    waveStatsDiv.appendChild(divider3)
    statsList.appendChild(waveStatsDiv);
    

    statsArray.forEach(elem =>{
        const name = document.createElement('p');
        name.innerText = elem.name;

        const time = document.createElement('p');
        time.innerText = elem.time;

        const wave = document.createElement('p');
        wave.innerText = elem.waves;

        document.getElementById('stats-names').appendChild(name);
        document.getElementById('stats-time').appendChild(time);
        document.getElementById('stats-waves').appendChild(wave);
    })
}

function getStats(){
    //ShowingCredits
    statsArray = []
    for(let i = 0; i<10; i++){
        statsArray.push({name:'Daniel Mokone',time:'15:00', waves:16 })
    }
}

function showSettings(){
    //ShowingCredits
    document.getElementById('menu-list').style.display = 'none';
    const statsList = document.getElementById('settings-List');
    statsList.style.display ='flex';

    //Remove the divs for displaying if they are ther
    if(document.getElementById('firstSetting')){
        document.getElementById('settingsSettings').remove();
        document.getElementById('firstSetting').remove();
        document.getElementById('secondSetting').remove();
        document.getElementById('thirdSetting').remove();
    }

    // The heading for the settings
    const settingsHeader = document.createElement('div');
    settingsHeader.id = 'settingsSettings';
    settingsHeader.className = 'settingsSettings';
    const settingsH2Heading = document.createElement('h2');
    settingsH2Heading.innerText = 'Settings';
    settingsHeader.appendChild(settingsH2Heading);
    document.getElementById('settings-List').appendChild(settingsHeader);

    // Div for the wavelength
    const waveLengthDiv = document.createElement('div');    
    waveLengthDiv.id = 'firstSetting';
    waveLengthDiv.className = 'Setting';
    const waveLengthH2Div = document.createElement('h3');
    waveLengthH2Div.innerText = 'Wave Length:';
    waveLengthDiv.appendChild(waveLengthH2Div);
    const fourMinWaveDiv = document.createElement('div');   // 4min Wave
    fourMinWaveDiv.id = '4min';
    if(waveLength == 4)fourMinWaveDiv.className = 'pickOption active';
    else fourMinWaveDiv.className = 'pickOption'
    const fourMineWavePTag = document.createElement('p');
    fourMineWavePTag.innerText = '4:00';
    fourMinWaveDiv.appendChild(fourMineWavePTag);
    waveLengthDiv.appendChild(fourMinWaveDiv);
    const fiveMinWaveDiv = document.createElement('div');   // 5min Wave
    fiveMinWaveDiv.id = '5min';
    if(waveLength == 5)fiveMinWaveDiv.className = 'pickOption active';
    else fiveMinWaveDiv.className = 'pickOption'
    const fiveMineWavePTag = document.createElement('p');
    fiveMineWavePTag.innerText = '5:00';
    fiveMinWaveDiv.appendChild(fiveMineWavePTag);
    waveLengthDiv.appendChild(fiveMinWaveDiv);
    const sixMinWaveDiv = document.createElement('div');   // 6min Wave
    sixMinWaveDiv.id = '6min';
    if(waveLength == 6)sixMinWaveDiv.className = 'pickOption active';
    else sixMinWaveDiv.className = 'pickOption'
    const sixMineWavePTag = document.createElement('p');
    sixMineWavePTag.innerText = '6:00';
    sixMinWaveDiv.appendChild(sixMineWavePTag);
    waveLengthDiv.appendChild(sixMinWaveDiv);
    const sevenMinWaveDiv = document.createElement('div');   // 7min Wave
    sevenMinWaveDiv.id = '7min';
    if(waveLength == 7)sevenMinWaveDiv.className = 'pickOption active';
    else sevenMinWaveDiv.className = 'pickOption'
    const sevenMineWavePTag = document.createElement('p');
    sevenMineWavePTag.innerText = '7:00';
    sevenMinWaveDiv.appendChild(sevenMineWavePTag);
    waveLengthDiv.appendChild(sevenMinWaveDiv);
    document.getElementById('settings-List').appendChild(waveLengthDiv);

    // Div for Difficulty
    const difficultySettingDiv = document.createElement('div');
    difficultySettingDiv.id = 'secondSetting';
    difficultySettingDiv.className = 'Setting';
    const difficultyH2Heading = document.createElement('h3');
    difficultyH2Heading.innerText = 'Difficulty:';
    difficultySettingDiv.appendChild(difficultyH2Heading);
    const easyOptionDiv = document.createElement('div');    // EASY
    easyOptionDiv.id = 'EASY';
    if(difficulty == 'EASY')easyOptionDiv.className = 'pickOption active';
    else easyOptionDiv.className = 'pickOption'
    const easyOptionPTag = document.createElement('p');
    easyOptionPTag.innerText = 'EASY';
    easyOptionDiv.appendChild(easyOptionPTag);
    difficultySettingDiv.appendChild(easyOptionDiv);
    const mediumOptionDiv = document.createElement('div');    // medium
    mediumOptionDiv.id = 'MEDIUM';
    if(difficulty == 'MEDIUM')mediumOptionDiv.className = 'pickOption active';
    else mediumOptionDiv.className = 'pickOption'
    const mediumOptionPTag = document.createElement('p');
    mediumOptionPTag.innerText = 'MEDIUM';
    mediumOptionDiv.appendChild(mediumOptionPTag);
    difficultySettingDiv.appendChild(mediumOptionDiv);
    const hardOptionDiv = document.createElement('div');    // hard
    hardOptionDiv.id = 'HARD';
    if(difficulty == 'HARD')hardOptionDiv.className = 'pickOption active';
    else hardOptionDiv.className = 'pickOption'
    const hardOptionPTag = document.createElement('p');
    hardOptionPTag.innerText = 'HARD';
    hardOptionDiv.appendChild(hardOptionPTag);
    difficultySettingDiv.appendChild(hardOptionDiv);
    document.getElementById('settings-List').appendChild(difficultySettingDiv);

    // Volume input
    const volumeInputDiv = document.createElement('div');
    volumeInputDiv.id = 'thirdSetting';
    volumeInputDiv.className = 'Setting';
    const volumeH3Header = document.createElement('h3');
    volumeH3Header.innerText = 'Volume:';
    volumeInputDiv.appendChild(volumeH3Header);
    const rangeVolumeInput = document.createElement('input');
    rangeVolumeInput.type = 'range';
    rangeVolumeInput.id = 'rangeInput';
    rangeVolumeInput.min = '0';
    rangeVolumeInput.max = '1';
    rangeVolumeInput.step = '0.01';
    rangeVolumeInput.value = volume;
    rangeVolumeInput.oninput = 'output.value = this.value';
    volumeInputDiv.appendChild(rangeVolumeInput);
    document.getElementById('settings-List').appendChild(volumeInputDiv);
    

    document.getElementById('rangeInput').addEventListener('change', ()=>{
        volume = Number(document.getElementById('rangeInput').value)
        window.localStorage.setItem('volume', volume)
    })
    
    
    document.getElementById('EASY').addEventListener('click', ()=>{
        if(difficulty === 'EASY'){
            return;
        }
    
        const currentDiffucultyDiv = document.getElementById(difficulty);
        currentDiffucultyDiv.className = 'pickOption';
    
        const changeDifficultyDiv = document.getElementById('EASY');
        changeDifficultyDiv.className = 'pickOption active';
    
        difficulty = 'EASY';
        //console.log('EASY button clicked');
        // Set attributes for EASY mode for each monster
        window.localStorage.setItem('difficulty', 'EASY');
        window.localStorage.setItem('ghost_health', '70');
        window.localStorage.setItem('ghost_strength', '1');
        window.localStorage.setItem('alien_health', '60');
        window.localStorage.setItem('alien_strength', '1');
        window.localStorage.setItem('skull_health', '50');
        window.localStorage.setItem('skull_strength', '1');
        window.localStorage.setItem('greendemon_health', '100');
        window.localStorage.setItem('greendemon_strength', '2');
        window.localStorage.setItem('cyclops_health', '80');
        window.localStorage.setItem('cyclops_strength', '2');
        window.localStorage.setItem('cactus_health', '60');
        window.localStorage.setItem('cactus_strength', '1');
        
    })
    
    document.getElementById('MEDIUM').addEventListener('click', ()=>{
        if(difficulty === 'MEDIUM'){
            return;
        }
    
        const currentDiffucultyDiv = document.getElementById(difficulty);
        currentDiffucultyDiv.className = 'pickOption';
    
        const changeDifficultyDiv = document.getElementById('MEDIUM');
        changeDifficultyDiv.className = 'pickOption active';
    
        difficulty = 'MEDIUM'
        //console.log('Med button clicked');
        window.localStorage.setItem('difficulty', 'MEDIUM')
        window.localStorage.setItem('ghost_health', '105');
        window.localStorage.setItem('ghost_strength', '1.5');
        window.localStorage.setItem('alien_health', '90');
        window.localStorage.setItem('alien_strength', '1.5');
        window.localStorage.setItem('skull_health', '75');
        window.localStorage.setItem('skull_strength', '1.5');
        window.localStorage.setItem('greendemon_health', '150');
        window.localStorage.setItem('greendemon_strength', '3');
        window.localStorage.setItem('cyclops_health', '120');
        window.localStorage.setItem('cyclops_strength', '3');
        window.localStorage.setItem('cactus_health', '90');
        window.localStorage.setItem('cactus_strength', '1.5');
    })
    
    document.getElementById('HARD').addEventListener('click', ()=>{
        if(difficulty === 'HARD'){
            return;
        }
    
        const currentDiffucultyDiv = document.getElementById(difficulty);
        currentDiffucultyDiv.className = 'pickOption';
    
        const changeDifficultyDiv = document.getElementById('HARD');
        changeDifficultyDiv.className = 'pickOption active';
    
        difficulty = 'HARD'
        //console.log('Hard button clicked');
        window.localStorage.setItem('difficulty', 'HARD');
        window.localStorage.setItem('ghost_health', '140');
        window.localStorage.setItem('ghost_strength', '2');
        window.localStorage.setItem('alien_health', '120');
        window.localStorage.setItem('alien_strength', '2');
        window.localStorage.setItem('skull_health', '100');
        window.localStorage.setItem('skull_strength', '2');
        window.localStorage.setItem('greendemon_health', '200');
        window.localStorage.setItem('greendemon_strength', '4');
        window.localStorage.setItem('cyclops_health', '160');
        window.localStorage.setItem('cyclops_strength', '4');
        window.localStorage.setItem('cactus_health', '120');
        window.localStorage.setItem('cactus_strength', '2');
    })
    
    
    document.getElementById('4min').addEventListener('click', ()=>{
        if(waveLength == 4) return;
    
        const currentActive = document.getElementById(`${waveLength}min`);
        currentActive.className = 'pickOption';
    
        waveLength = 4;
        window.localStorage.setItem('wave', 4)
    
        const changeDifficultyDiv = document.getElementById(`${waveLength}min`);
        changeDifficultyDiv.className = 'pickOption active';
    })
    
    document.getElementById('5min').addEventListener('click', ()=>{
        if(waveLength == 5) return;
    
        const currentActive = document.getElementById(`${waveLength}min`);
        currentActive.className = 'pickOption';
    
        waveLength = 5;
        window.localStorage.setItem('wave', 5)
    
        const changeDifficultyDiv = document.getElementById(`${waveLength}min`);
        changeDifficultyDiv.className = 'pickOption active';
    })
    
    document.getElementById('6min').addEventListener('click', ()=>{
        if(waveLength == 6) return;
    
        const currentActive = document.getElementById(`${waveLength}min`);
        currentActive.className = 'pickOption';
    
        waveLength = 6;
        window.localStorage.setItem('wave', 6)
    
        const changeDifficultyDiv = document.getElementById(`${waveLength}min`);
        changeDifficultyDiv.className = 'pickOption active';
    })
    
    document.getElementById('7min').addEventListener('click', ()=>{
        if(waveLength == 7) return;
    
        const currentActive = document.getElementById(`${waveLength}min`);
        currentActive.className = 'pickOption';
    
        waveLength = 7;
        window.localStorage.setItem('wave', 7)
    
        const changeDifficultyDiv = document.getElementById(`${waveLength}min`);
        changeDifficultyDiv.className = 'pickOption active';
    })
}

/*
document.getElementById('SinglePlayerBtn').addEventListener('click', ()=>{
    document.getElementById('menuScreen').style.display = 'none';
})*/


document.getElementById('SettingsBtn').addEventListener('click', ()=>{
    showSettings();
})

document.getElementById('Statbtn').addEventListener('click', ()=>{
    showStats();
})

document.getElementById('Creditbtn').addEventListener('click', ()=>{
    showCredits();
})


document.getElementById('Exitbtn').addEventListener('click', ()=>{
    console.log('Exiting');
})


document.getElementById('backbuttonDiv').addEventListener('click', ()=>{
    document.getElementById('stats-list').style.display ='none';
    document.getElementById('menu-list').style.display = 'flex';
})

document.getElementById('backButtonCreditsDiv').addEventListener('click', ()=>{
    document.getElementById('credits-list').style.display ='none';
    document.getElementById('menu-list').style.display = 'flex';
})

document.getElementById('backButtonSettingsDiv').addEventListener('click', ()=>{
    document.getElementById('settings-List').style.display ='none';
    document.getElementById('menu-list').style.display = 'flex';
})





//window.onload = getStats
window.onload = displayMenu
//window.onload = getStats

export { displayMenu, volume, difficulty, waveLength};