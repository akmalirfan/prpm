const jsdom = require('jsdom')
const { JSDOM } = jsdom
const express = require('express')
const app = express()

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    if (req.query.perkataan) {
        JSDOM.fromURL(`http://prpm.dbp.gov.my/Cari1?keyword=${req.query.perkataan}`).then(dom => {
            let element = dom.window.document.querySelector('.panelDBP')
            let maknaperkataan = []

            if (element != undefined) {
                let temp = []
                let meanings = {}
                
                // Bilangan makna
                for (word of element.children[0].children[0].children) {
                    temp.push(word.textContent)
                }
                
                // Makna dan sumber
                let i = 0
                for (word of element.children[1].children[0].children) {
                    let padanan = word.textContent.match(/(\[.*\])?.*Definisi : (.+)\((.+)\)$/i)
                    let sebutan = padanan[1]
                    let makna = padanan[2].trim()
                    let sumber = padanan[3]
                
                    if (sumber != 'Kamus Pelajar Edisi Kedua') {
                        meanings[temp[i]] = {
                            sebutan,
                            makna
                        }
                    } else {
                        // Overwrite the value without removing the allocated space
                        // 0 is a random value. It can be anything but a valid word
                        temp[i] = 0
                    }
                
                    i++
                }
                
                // Sort
                temp.sort()
                
                for (perkataan of temp) {
                    if (meanings[perkataan] != undefined) {
                        maknaperkataan.push({
                            perkataan,
                            sebutan: meanings[perkataan].sebutan,
                            makna: meanings[perkataan].makna
                        })
                    }
                }
            }

            res.render('index', {
                query: req.query.perkataan,
                maknaperkataan
            })
        })
    } else {
        res.render('index')
    }
})

app.listen(80, console.log('Listening on port 80!'))