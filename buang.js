let element = document.querySelector('.panelDBP')
let woi = []
let meanings = {}

// Bilangan makna
for (word of element.children[0].children[0].children) {
    woi.push(word.textContent)
}

// Makna dan sumber
let i = 0
for (word of element.children[1].children[0].children) {
    let padanan = word.textContent.match(/(\[.*\])?.*Definisi : (.+)\((.+)\)$/i)
    let sebutan = padanan[1]
    let makna = padanan[2].trim()
    let sumber = padanan[3]

    if (sumber != 'Kamus Pelajar Edisi Kedua') {
        meanings[woi[i]] = {
            sebutan,
            makna
        }
    } else {
        // Overwrite the value without removing the allocated space
        // 0 is a random value. It can be anything but a valid word
        woi[i] = 0
    }

    i++
}

// Sort
woi.sort()
let maknaperkataan = []

for (let i = 0; i < woi.length; i++) {
    let kata = {}

    if (meanings[woi[i]] != undefined) {
        kata.perkataan = woi[i]
        kata.sebutan = meanings[woi[i]].sebutan
        kata.makna = meanings[woi[i]].makna

        maknaperkataan.push(kata)
    }
}

console.log(maknaperkataan)