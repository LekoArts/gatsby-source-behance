const crypto = require(`crypto`)
const axios = require(`axios`)

exports.sourceNodes = async ({ boundActionCreators: { createNode } }, { username, apiKey }) => {
  if (!username || !apiKey) {
    throw 'You need to define username and apiKey'
  }

  const axiosClient = axios.create({
    baseURL: `https://api.behance.net/v2/`,
  })

  // Thanks to https://github.com/Jedidiah/gatsby-source-twitch/blob/master/src/gatsby-node.js
  // and https://stackoverflow.com/questions/43482639/throttling-axios-requests
  const rateLimit = 500
  let lastCalled = undefined

  const rateLimiter = (call) => {
    const now = Date.now()
    if (lastCalled) {
      lastCalled += rateLimit
      const wait = (lastCalled - now)
      if (wait > 0) {
        return new Promise((resolve) => setTimeout(() => resolve(call), wait))
      }
    }
    lastCalled = now
    return call
  }

  axiosClient.interceptors.request.use(rateLimiter)

  const { data: { projects } } = await axiosClient.get(`/users/${username}/projects?client_id=${apiKey}`)
  const { data: { user } } = await axiosClient.get(`/users/${username}?client_id=${apiKey}`)
  const jsonStringUser = JSON.stringify(user)

  // Collect all IDs of the projects
  const projectIDs = projects.map(project => project.id)

  // Request detailed information about each project
  const requests = projectIDs.map(id => axiosClient.get(`/projects/${id}?client_id=${apiKey}`))
  const projectsDetailed = await Promise.all(requests).map(request => request.data.project)

  // Create node for each project
  projectsDetailed.map(async project => {
    // Transform the properties that have numbers as keys
    project.covers = (
      Object.entries(project.covers)
      .map(cover => ({ dimension: cover[0], url: cover[1] }))
    )

    project.owners = project.owners.map(owner => ({
      ...owner,
      images: Object.entries(owner.images)
        .map(image => ({ dimension: image[0], url: image[1] }))
    }))

    project.modules = project.modules.map(module => {
      if (module.type === 'image') {
        return {
          ...module,
          sizes: Object.entries(module.sizes)
            .map(size => ({ dimension: size[0], url: size[1] })),
          dimensions: Object.entries(module.dimensions)
            .map(dimension => ({ dimension: dimension[0], ...dimension[1] })),
          }
        } else if (module.type === 'media_collection') {
          return {
            ...module,
            components: module.components.map(component => ({
              ...component,
              sizes: Object.entries(component.sizes)
                .map(size => ({ dimension: size[0], url: size[1] })),
              dimensions: Object.entries(component.dimensions)
                .map(dimension => ({ dimension: dimension[0], ...dimension[1] })),
          }))
        }
      } else {
        return module
      }
    })

    const jsonString = JSON.stringify(project)

    // List out all the fields
    const projectListNode = {
      projectID: project.id,
      name: project.name,
      published: project.published_on,
      created: project.created_on,
      modified: project.modified_on,
      url: project.url,
      privacy: project.privacy,
      areas: project.fields,
      covers: project.covers,
      matureContent: project.mature_content,
      matureAccess: project.mature_access,
      owners: project.owners,
      stats: project.stats,
      conceived: project.conceived_on,
      canvasWidth: project.canvas_width,
      tags: project.tags,
      description: project.description,
      editorVersion: project.editor_version,
      allowComments: project.allow_comments,
      modules: project.modules,
      shortURL: project.short_url,
      copyright: project.copyright,
      tools: project.tools,
      styles: project.styles,
      creatorID: project.creator_id,

      children: [],
      id: project.id.toString(),
      parent: `__SOURCE__`,
      internal: {
        type: `BehanceProjects`,
        contentDigest: crypto.createHash(`md5`).update(jsonString).digest(`hex`),
      },
    }

    createNode(projectListNode)
  })

  const userNode = {
    userID: user.id,
    names: {
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      displayName: user.display_name,
    },
    url: user.url,
    website: user.website,
    avatar: user.images['276'],
    company: user.company,
    place: {
      city: user.city,
      state: user.state,
      country: user.country,
      location: user.location,
    },
    areas: user.fields,
    stats: user.stats,
    links: user.links,
    sections: user.sections,
    socialMedia: user.social_links,
    children: [],
    id: user.id.toString(),
    parent: `__SOURCE__`,
    internal: {
      type: `BehanceUser`,
      contentDigest: crypto.createHash(`md5`).update(jsonStringUser).digest(`hex`)
    }
  }

  createNode(userNode)
}
