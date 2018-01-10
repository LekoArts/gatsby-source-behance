'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const crypto = require(`crypto`);
const axios = require(`axios`);

exports.sourceNodes = (() => {
  var _ref = _asyncToGenerator(function* ({ boundActionCreators: { createNode } }, { username, apiKey }) {
    if (!username || !apiKey) {
      throw 'You need to define username and apiKey';
    }

    const axiosClient = axios.create({
      baseURL: `https://api.behance.net/v2/`
    });

    // Thanks to https://github.com/Jedidiah/gatsby-source-twitch/blob/master/src/gatsby-node.js
    // and https://stackoverflow.com/questions/43482639/throttling-axios-requests
    const rateLimit = 500;
    let lastCalled = undefined;

    const rateLimiter = function rateLimiter(call) {
      const now = Date.now();
      if (lastCalled) {
        lastCalled += rateLimit;
        const wait = lastCalled - now;
        if (wait > 0) {
          return new Promise(function (resolve) {
            return setTimeout(function () {
              return resolve(call);
            }, wait);
          });
        }
      }
      lastCalled = now;
      return call;
    };

    axiosClient.interceptors.request.use(rateLimiter);

    var _ref2 = yield axiosClient.get(`/users/${username}/projects?client_id=${apiKey}`);

    const projects = _ref2.data.projects;

    var _ref3 = yield axiosClient.get(`/users/${username}?client_id=${apiKey}`);

    const user = _ref3.data.user;


    const jsonStringUser = JSON.stringify(user);

    projects.map(function (project) {
      /* 
      * Sadly this is not working as intended. Help on this part is much appreciated!
      * 
      * const projectResponse = await axiosClient.get(`/projects/${project.id}?client_id=${apiKey}`)
      * const projectData = projectResponse.data.project
      */

      const jsonString = JSON.stringify(project);

      const projectListNode = {
        name: project.name,
        projectID: project.id,
        published: project.published_on,
        created: project.created_on,
        modified: project.modified_on,
        conceived: project.conceived_on,
        url: project.url,
        areas: project.fields,
        cover: project.covers.original,
        stats: project.stats,
        children: [],
        id: project.id.toString(),
        parent: `__SOURCE__`,
        internal: {
          type: `BehanceProjects`,
          contentDigest: crypto.createHash(`md5`).update(jsonString).digest(`hex`)
        }
      };
      createNode(projectListNode);
    });

    const userNode = {
      userID: user.id,
      names: {
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        displayName: user.display_name
      },
      url: user.url,
      website: user.website,
      avatar: user.images['276'],
      company: user.company,
      place: {
        city: user.city,
        state: user.state,
        country: user.country,
        location: user.location
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
    };

    createNode(userNode);
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();