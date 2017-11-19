const crypto = require(`crypto`)
const axios = require(`axios`)

exports.sourceNodes = async ({ boundActionCreators: { createNode } }, { username, apiKey }) => {
  const axiosClient = axios.create({
    baseURL: `https://api.behance.net/v2/`,
  })

  const { data: { projects } } = await axiosClient.get(`/users/${username}/projects?client_id=${apiKey}`)

  projects.map( async (project) => {
    const jsonString = JSON.stringify(project)
    const projectsNode = {
      name: project.name,
      published: project.published_on,
      created: project.created_on,
      modified: project.modified_on,
      url: project.url,
      cover: project.covers.original,
      views: project.stats.views,
      appreciations: project.stats.appreciations,
      comments: project.stats.comments,
      children: [],
      id: project.id.toString(),
      parent: `__SOURCE__`,
      internal: {
        type: `BeProjects`,
        contentDigest: crypto.createHash(`md5`).update(jsonString).digest(`hex`),
      },
    }
    createNode(projectsNode)
  })
}
