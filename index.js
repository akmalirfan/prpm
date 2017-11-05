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
                // Bilangan makna
                for (word of element.children[0].children[0].children) {
                    maknaperkataan.push({
                        perkataan: word.textContent
                    })
                }
                
                // Makna, sebutan dan sumber
                let kata = element.children[1].children[0].children
                for (let i = 0, j = 0; i < kata.length; i++, j++) {
                    let padanan = kata[i].textContent.match(/(\[.*\])?.*Definisi : (.+)\((.+)\)$/i)
                
                    if (padanan[3] === 'Kamus Pelajar Edisi Kedua') {
                        maknaperkataan.splice(j, 1)
                        j--
                    } else {
                        maknaperkataan[j].sebutan = padanan[1]
                        maknaperkataan[j].makna = padanan[2].trim()
                    }
                }
                
                // Sort
                maknaperkataan.sort((a, b) => {
                    if (a.perkataan < b.perkataan) return -1
                    return 1
                })
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