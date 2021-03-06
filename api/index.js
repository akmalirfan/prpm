const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = (req, res) => {
    if (req.query.perkataan) {
        JSDOM.fromURL(`http://prpm.dbp.gov.my/Cari1?keyword=${req.query.perkataan}`).then(dom => {
            let element = dom.window.document.querySelector('.panelDBP')
            let words = []

            if (element != undefined) {
                // Bilangan makna
                for (word of element.children[0].children[0].children) {
                    words.push({
                        perkataan: word.textContent
                    })
                }
                
                // Makna, sebutan dan sumber
                let kata = element.children[1].children[0].children
                for (let i = 0, j = 0; i < kata.length; i++, j++) {
                    let padanan = kata[i].textContent.match(/(\[.*\])?.*Definisi : (.+)\((.+)\)$/i)
                
                    if (padanan[3] === 'Kamus Pelajar Edisi Kedua') {
                        words.splice(j, 1)
                        j--
                    } else {
                        words[j].sebutan = padanan[1]
                        words[j].makna = padanan[2].trim()
                    }
                }
                
                // Sort
                words.sort((a, b) => {
                    if (a.perkataan < b.perkataan) return -1
                    return 1
                })
            }

	    res.send({
		query: req.query.perkataan,
		words
	    })
        })
    } else {
	res.send({})
    }
}
