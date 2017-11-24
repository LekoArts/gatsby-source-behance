const crypto = require(`crypto`)
const axios = require(`axios`)
const format = require(`date-fns/format`)

exports.sourceNodes = async ({ boundActionCreators: { createNode } }, { username, apiKey, dateFormat }) => {
  const axiosClient = axios.create({
    baseURL: `https://api.behance.net/v2/`,
  })

  const { data: { projects } } = await axiosClient.get(`/users/${username}/projects?client_id=${apiKey}`)

  function convertDate (date) {
    let legible = new Date(1000*date)
    legible = legible.toString()
    return legible
  }

  projects.map(async (project) => {
    const projectData = (await axiosClient.get(`/projects/${project.id}?client_id=${apiKey}`)).data

    const jsonString = JSON.stringify(project)

    const projectListNode = {
      name: project.name,
      projectID: project.id,
      published: format(convertDate(project.published_on), dateFormat),
      created: format(convertDate(project.created_on), dateFormat),
      modified: format(convertDate(project.modified_on), dateFormat),
      conceived: format(convertDate(project.conceived_on), dateFormat),
      url: project.url,
      cover: project.covers.original,
      views: project.stats.views,
      appreciations: project.stats.appreciations,
      comments: project.stats.comments,
      description: projectData.description,
      children: [],
      id: project.id.toString(),
      parent: `__SOURCE__`,
      internal: {
        type: `Behance`,
        contentDigest: crypto.createHash(`md5`).update(jsonString).digest(`hex`),
      },
    }
    createNode(projectListNode)
  })
}