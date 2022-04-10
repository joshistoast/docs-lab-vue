const axios = require('axios')
const { JSDOM } = require('jsdom')

const targetUrl = 'https://docs-lab.com'

const getPosts = async (variables) => {
  const browseBaseUrl = `${targetUrl}/browse`

  // return modified url with variables
  const getUrl = () => {
    let url = browseBaseUrl
    // append variables to url as query params
    if (variables) {
      const includeTags = variables.include_tags || []
      const excludeTags = variables.exclude_tags || []
      const pageNum = variables.page_num || 1
      const minRating = variables.min_user_rating || ''
      const order = variables.order || 'publish_date'
      const direction = variables.dir || 'DESC'
      const search = variables.search || ''
      const ratings = variables.ratings || []
      const hideWip = variables.hide_wip || 0

      url += `?include_tags=${includeTags}&exclude_tags=${excludeTags}&page_num=${pageNum}&min_user_rating=${minRating}&order=${order}&dir=${direction}&search=${search}&hide_wip=${hideWip}`
      // add ratings to url
      if (ratings.length) {
        ratings.forEach((rating) => {
          url += `&rating%5B%5D=${rating}`
        })
      }
    }
    return url
  }

  const { data: html } = await axios.get(getUrl())
  const dom = new JSDOM(html)
  let stories = []

  const paginationElement = dom.window.document.querySelector('div.text-center > ul.pagination')
  const paginationElementItems = Array.from(paginationElement?.querySelectorAll('li'))
  const activePaginationElementItem = paginationElementItems?.find((paginationElementItem) => paginationElementItem.classList.contains('active'))
  const activePageNum = +activePaginationElementItem?.querySelector('span')?.innerHTML
  const totalPages = +paginationElementItems[paginationElementItems.length - 2].querySelector('a').innerHTML
  const hasNextPage = activePageNum < totalPages
  const hasPreviousPage = activePageNum > 1

  const pagination = {
    hasNextPage,
    hasPreviousPage,
    activePageNum,
    totalPages,
  }

  const submissionElementsList = dom.window.document.querySelectorAll('.browse-submission-container')
  submissionElementsList.forEach((storyElement) => {

    const id = storyElement.querySelector('h2 > a')?.getAttribute('href').split('/')[2]
    const handle = storyElement.querySelector('h2 > a')?.getAttribute('href').split('/')[3]
    const url = `${targetUrl}/submissions/${id}/${handle}`
    const title = storyElement.querySelector('h2 > a')?.innerHTML.trim()
    const author = {
      name: storyElement.querySelector('.browse-author > strong')?.innerHTML.trim(),
      url: `${browseBaseUrl}/profiles/${this.name}`
    }
    const rating = storyElement.querySelector('.rating')?.innerHTML.trim()
    const publishedAt = storyElement.querySelectorAll('.bottom-line .col-xs-6 ul li')[0]?.innerHTML.trim().replace('Published: ', '')
    const updatedAt = storyElement.querySelectorAll('.bottom-line .col-xs-6 ul li')[1]?.innerHTML.trim().replace('Last Updated: ', '') || publishedAt

    let tags = []
    const tagsList = storyElement.querySelectorAll('.browse-tag.label')
    tagsList.forEach((tag) => {
      tags.push({
        id: tag.getAttribute('href').replace('/browse?include_tags=', '').trim(),
        label: tag.innerHTML.trim().replace(/[()0 - 9]+/g, ''),
      })
    })
    const description = storyElement.querySelector('.main-box-body > .row > .col-xs-9')?.innerHTML.trim()
    const commentsCount = +storyElement.querySelector('.main-box-body > .row > .col-xs-3 > .row > .col-sm-4')?.innerHTML.trim().replace('Comments: ', '') ?? 0
    const favoritesCount = storyElement.querySelector('.main-box-body > .row > .col-xs-3 > .row > .col-sm-3')[1]?.innerHTML.trim().replace('Favorites: ', '') ?? 0
    const score = storyElement.querySelector('.main-box-body > .row > .col-xs-3 > .row > .col-sm-3')[2]?.innerHTML.trim().replace('Score: ', '') ?? 0

    stories.push({
      id,
      handle,
      url,
      title,
      author,
      rating,
      tags,
      description,
      publishedAt,
      updatedAt,
      commentsCount,
      favoritesCount,
      score,
    })
  })

  const result = {
    pagination,
    stories,
  }
  return {
    data: result,
  }
}

module.exports = {
  getPosts,
}
