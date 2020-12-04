import * as cheerio from 'cheerio'
import * as express from 'express'
import * as puppeteer from 'puppeteer'
const app = express()

const browser: Promise<puppeteer.Browser> = puppeteer.launch()

app.post('/login', async (req, res) => {
    const email = req.query.email.toString()
    const password = req.query.password.toString()

    const page = await (await browser).newPage()
    await page.goto('https://promilitares.com.br/login')

    await page.type('input[name="_username"]', email)
    await page.type('input[name="_password"]', password)

    await Promise.all([
        await page.click('button[type="submit"]'),
        await page.waitForNavigation()
    ])

    if (page.url() === 'https://promilitares.com.br/cursos') {
        await page.close()
        res.send({
            "email": email
        })
    }

    await page.close()
    res.status(401).send({
        "error": "Incorrect email or password"
    })
})

app.get('/course', async (req, res) => {
    const page = await (await browser).newPage()
    const response = await page.goto('https://promilitares.com.br/cursos')
    const $ = cheerio.load(await response.text())

    let courses = $('a').map((index, element) => {
        return $(element).attr('href')
    }).get()

    const regex = new RegExp('^\/[a-z\-]{0,}\/[0-9]{4}$')

    courses = courses.filter(value => {
        return regex.test(value)
    })

    courses = courses.filter((value, index, array) => {
        return array.indexOf(value) === index
    })

    courses = courses.map(value => {
        return {
            "title": value.replace(/\//g, ' ').trim(),
            "href": value
        }
    })

    await page.close()
    res.send(courses)
})

app.get('/module', async (req, res) => {
    const course = req.query.course.toString()

    const page = await (await browser).newPage()
    const response = await page.goto('https://promilitares.com.br' + course)
    const $ = cheerio.load(await response.text())

    let modules = $('a').map((index, element) => {
        return $(element).attr('href')
    }).get()

    const regex = new RegExp('^\/[a-z\-]{0,}\/[0-9]{4}\/[a-z0-9\-]{0,}$')

    modules = modules.filter(value => {
        return regex.test(value)
    })

    modules = modules.map(value => {
        return {
            "title": value.split('/')[3],
            "href": value
        }
    })

    await page.close()
    res.send(modules)
})

app.get('/season', async (req, res) => {
    const module = req.query.module.toString()

    const page = await (await browser).newPage()
    const response = await page.goto('https://promilitares.com.br' + module)
    const $ = cheerio.load(await response.text())

    let seasons = $('a').map((index, element) => {
        return $(element).attr('href')
    }).get()

    const regex = new RegExp('^\/[a-z\-]{0,}\/[a-z0-9\-]{0,}\/[0-9]{4}\/[a-z0-9\-\%]{0,}$')

    seasons = seasons.filter(value => {
        return regex.test(value)
    })

    seasons = seasons.map(value => {
        return {
            "title": value.split('/')[4],
            "href": value
        }
    })

    await page.close()
    res.send(seasons)
})

app.get('/lesson', async (req, res) => {
    const season = req.query.season.toString()

    const page = await (await browser).newPage()
    const response = await page.goto('https://promilitares.com.br' + season)
    const $ = cheerio.load(await response.text())

    let lessons = $('a').map((index, element) => {
        return $(element).attr('href')
    }).get()

    const regex = new RegExp('^\/[a-z\-]{0,}\/[a-z0-9\-]{0,}\/[0-9]{4}\/[a-z0-9\-\%]{0,}\/[a-z0-9\-\%]{0,}$')

    lessons = lessons.filter(value => {
        return regex.test(value)
    })

    lessons = lessons.map(value => {
        return {
            "title": value.split('/')[5],
            "href": value
        }
    })

    await page.close()
    res.send(lessons)
})

app.get('/source', async (req, res) => {
    const lesson = req.query.lesson.toString()

    const page = await (await browser).newPage()
    await page.goto('https://promilitares.com.br' + lesson)

    const regex = new RegExp('\/\/view\.vzaar\.com\/[0-9]{0,}\/player')

    if (regex.test(await page.content())) {
        const source = 'https:' + regex.exec(await page.content())[0].replace('player', 'download')

        await page.close()
        res.send({
            "src": source,
        })
    }

    await page.close()
    res.status(401).send({
        "error": "Unauthorized"
    })
})

app.listen(3000)
