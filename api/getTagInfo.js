const axios = require('axios')
const { JSDOM } = require('jsdom')

const targetUrl = 'https://docs-lab.com'

const getTagInfo = async (tagId) => {
  const tagsUrl = `${targetUrl}/browse/tags`

  const { data: html } = await axios.get(tagsUrl)
  const dom = new JSDOM(html)

  const id = +tagId

  const tagsTableElement = dom.window.document.querySelector('table.table.datatable')
  const tagsTableRows = Array.from(tagsTableElement?.querySelectorAll('tbody > tr'))
  const tagElement = tagsTableRows.find((tagElement) => {
    const tagElementTd = tagElement.querySelector('td')
    const tagElementHref = tagElementTd?.querySelector('a')?.getAttribute('href')
    return tagElementHref?.includes(id) ?? null
  })
  let tagName
  let submissionsCount
  if (!tagId) {
    throw new Error(`Tag ID is required`)
  } else if (!tagElement) {
    throw new Error(`Tag with id ${id} not found`)
  } else {
    tagName = tagElement?.querySelector('td')?.querySelector('a')?.innerHTML.trim()
    submissionsCount = +tagElement?.querySelectorAll('td')[1].innerHTML.trim()
  }

  const result = {
    id: id,
    name: tagName,
    submissions: submissionsCount,
  }
  return {
    data: result,
  }
}

module.exports = {
  getTagInfo,
}
