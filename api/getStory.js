const axios = require('axios')
const { JSDOM } = require('jsdom')

const targetUrl = 'https://docs-lab.com'

const getStory = async (storyUrl) => {

  const fullStoryUrl = `${targetUrl}/submissions/${storyUrl}`

  const { data: html } = await axios.get(fullStoryUrl)
  const dom = new JSDOM(html)
  const $ = (selector) => dom.window.document.querySelector(selector)

  const headerBox = dom.window.document.querySelectorAll('.main-box')[0]

  // Id
  const storyId = storyUrl.split('/')[0]
  // Handle
  const storyHandle = storyUrl.split('/')[1]
  // Title
  const storyTitle = headerBox.querySelector('.main-box-header h2').innerHTML.replaceAll("(?i)<td[^>]*>", " ").replaceAll("\\s+", " ").trim()
  // Published At

  // Author
  const storyAuthor = {
    name: headerBox.querySelector('.main-box-body .row a[href^="/profiles/"] strong')?.innerHTML,
    url: targetUrl + headerBox.querySelector('.main-box-body .row a[href^="/profiles/"]')?.getAttribute('href'),
  }
  // Description
  const storyDescription = headerBox.querySelectorAll('.main-box-body .row')[1].querySelector('div').innerHTML.trim()
  // Tags
  const storyTagsList = headerBox.querySelectorAll('.main-box-body .row')[2].querySelector('div')
  const storyTagsElements = storyTagsList?.querySelectorAll('span.label')
  const storyTags = []
  storyTagsElements && storyTagsElements.forEach((storyTagElement) => {
    const storyTag = storyTagElement.innerHTML.replace(/[()0 - 9]+/g, '').trim()
    storyTags.push(storyTag)
  })
  // Rating
  const storyRating = dom.window.document.querySelectorAll('.main-box.infographic-box')[0]?.querySelector('.value')?.innerHTML.trim()
  // Favorites
  const storyFavorites = dom.window.document.querySelectorAll('.main-box.infographic-box')[1]?.querySelector('.value')?.innerHTML.trim()
  // Story HTML
  const storyHtml = Array.from(dom.window.document.querySelectorAll('.main-box')).find((box) => box.querySelector('h2')?.innerHTML == 'Story')?.querySelector('.main-box-body')?.innerHTML
  // Comments
  const storyCommentsList = dom.window.document.querySelector('#comments').querySelector('.conversation-inner')
  const storyCommentsElements = storyCommentsList?.querySelectorAll('.conversation-item')
  const storyComments = []
  storyCommentsElements && storyCommentsElements.forEach((storyCommentElement) => {
    const name = storyCommentElement.querySelector('.name a')?.innerHTML.trim()
    const body = storyCommentElement.querySelector('.text')?.innerHTML.trim()
    const date = storyCommentElement.querySelector('.time')?.innerHTML.trim()
    storyComments.push({
      name,
      body,
      date,
    })
  })

  const result = {
    id: storyId,
    handle: storyHandle,
    title: storyTitle,
    url: fullStoryUrl,
    author: storyAuthor,
    rating: storyRating,
    favoritesCount: storyFavorites,
    description: storyDescription,
    tags: storyTags,
    storyHtml,
    comments: storyComments,
  }

  return {
    data: result,
  }
}

module.exports = {
  getStory,
}
