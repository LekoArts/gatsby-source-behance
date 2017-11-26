"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const crypto = require(`crypto`);
const axios = require(`axios`);
const format = require(`date-fns/format`);

exports.sourceNodes = (() => {
  var _ref = _asyncToGenerator(function* ({ boundActionCreators: { createNode } }, { username, apiKey, dateFormat }) {
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


    function convertDate(date) {
      let legible = new Date(1000 * date);
      legible = legible.toString();
      return legible;
    }

    projects.map((() => {
      var _ref3 = _asyncToGenerator(function* (project) {
        const projectData = (yield axiosClient.get(`/projects/${project.id}?client_id=${apiKey}`)).data;

        const jsonString = JSON.stringify(project);

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
            contentDigest: crypto.createHash(`md5`).update(jsonString).digest(`hex`)
          }
        };
        createNode(projectListNode);
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