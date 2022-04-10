const express = require('express')
const cors = require('cors')

// modules
const story = require('./getStory')
const posts = require('./getPosts')
const tags = require('./getTagInfo')

const PORT = process.env.PORT || 3000

// initialize express
const app = express()
app.use(cors())

// routes
app.get('/api/story/:id/:handle/', async (req, res) => {
  try {
    const id = req.params.id
    const handle = req.params.handle
    const query = `${id}/${handle}`
    const results = await story.getStory(query)
    const data = results
    res.status(200).json(data)
  }
  catch (err) {
    res.status(500).json({ error: err })
  }
})
app.get('/api/posts', async (req, res) => {
  try {
    const params = {
      "include_tags": req.query.include_tags,
      "exclude_tags": req.query.exclude_tags,
      "page_num": req.query.page_num,
      "min_user_rating": req.query.min_user_rating,
      "order": req.query.order,
      "dir": req.query.dir,
      "search": req.query.search,
      "ratings": req.query.ratings,
      "hide_wip": req.query.hide_wip,
      "ratings": req.query.ratings,
    }

    const results = await posts.getPosts(params)
    res.status(200).json(results)
  }
  catch {
    res.status(500).json({ error: err })
  }
})
app.get('/api/tag/:tagId', async (req, res) => {
  try {
    const tagId = req.params.tagId
    const result = await tags.getTagInfo(tagId)
    res.status(200).json(result)
  }
  catch {
    res.status(500).json({ error: err })
  }
})

app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`))
