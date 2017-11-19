"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const crypto = require(`crypto`);
const axios = require(`axios`);

exports.sourceNodes = (() => {
  var _ref = _asyncToGenerator(function* ({ boundActionCreators: { createNode } }, { username, apiKey }) {
    const axiosClient = axios.create({
      baseURL: `https://api.behance.net/v2/`
    });

    var _ref2 = yield axiosClient.get(`/users/${username}/projects?client_id=${apiKey}`);

    const projects = _ref2.data.projects;


    projects.map((() => {
      var _ref3 = _asyncToGenerator(function* (project) {
        const jsonString = JSON.stringify(project);
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
            contentDigest: crypto.createHash(`md5`).update(jsonString).digest(`hex`)
          }
        };
        createNode(projectsNode);
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();