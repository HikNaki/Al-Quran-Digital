function getURL(e){
    const pageURL = window.location.search.substring(1);
    const urlVariabel = pageURL.split('&');

    for(let i=0; i < urlVariabel.length; i++){
        const parameterName = urlVariabel[i].split('=');
        if(parameterName[0] == e){
            return parameterName[1];
        };
    };
};

const nomorSurat = getURL('nomorsurat');

const judulSurat = document.querySelector('.judul-surat');
const cardIsiSurat = document.querySelector('.card-isi-surat');
const cardInfo = document.querySelector('.card');

const loader = document.querySelector('.loader');
const error = `<div class="loader text-danger"> Oops Ada Masalah Nihh!</div>`;

async function getSurat(){

    try {
        cardInfo.classList.add('hidden-loader');
        await getUiDetail(nomorSurat);
        cardInfo.classList.remove('hidden-loader');
        loader.classList.add('hidden-loader');
    } catch (err) {
        loader.classList.add('hidden-loader');
        cardIsiSurat.innerHTML = error;
        console.log(err);
        
    };
};

function getUiDetail(nomorSurat){
    return fetch(`https://equran.id/api/surat/${nomorSurat}`)
    .then(response => response.json())
    .then(response => {

        //Title Surat
        const titleSurat = document.querySelector('#title-surat');
        titleSurat.textContent = `Surat ${response.nama_latin}`;
        
        const cardJudulSurat = `
            <strong>${response.nama_latin} - ${response.nama}</strong>
            <p>Jumlahh ayat: ${response.jumlah_ayat} ${response.arti}</p>
            <button class="btn btn-primary audio-button-play">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
            </svg> Dengarkan
            </button>
            <button class="btn btn-danger hidden-button audio-button-pause">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5h-3z"/>
            </svg> Stop
            </button>
            <audio id="audio-tag" src="${response.audio}"></audio>
        `;
        judulSurat.innerHTML = cardJudulSurat;
        //End Judul Surat

        //Isi Surat
        const surat = response.ayat;
        let isiSurat = '';
        surat.forEach(s => {
            isiSurat += `
            <div class="card mb-3">
                <div class="card-body">
                    <p>${s.nomor}</p>
                    <h3 class="text-end mb-3">${s.ar}</h3>
                    <p>${s.tr}</p>
                    <p>${s.idn}</p>
                </div>
            </div>

            `;
        });
        
        cardIsiSurat.innerHTML = isiSurat;

        // ketika button audio diklik
        const buttonPlay = document.querySelector('.audio-button-play');
        const buttonPause = document.querySelector('.audio-button-pause');
        const audioSurat = document.querySelector('#audio-tag');

        buttonPlay.addEventListener('click', function(){
            buttonPlay.classList.add('hidden-button');
            buttonPause.classList.remove('hidden-button');
            audioSurat.play();
        });

        buttonPause.addEventListener('click', function(){
            buttonPlay.classList.remove('hidden-button');
            buttonPause.classList.add('hidden-button');
            audioSurat.pause();
        })

    });
}

getSurat();