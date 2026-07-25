var mockData = require('./data.js');

var dbInstance = null;

function init() {
  if (!dbInstance) {
    try {
      if (wx.cloud) {
        dbInstance = wx.cloud.database();
      }
    } catch (e) {
      console.log('[db] 云数据库初始化失败，将使用本地mock数据:', e);
      dbInstance = null;
    }
  }
  return dbInstance;
}

function getHeritages(category) {
  return new Promise(function (resolve) {
    var db = init();
    if (db) {
      var query = db.collection('heritages');
      if (category && category !== 'all') {
        query = query.where({ category: category });
      }
      query.get()
        .then(function (res) {
          var list = res.data || [];
          list.sort(function (a, b) {
            return (b.views || 0) - (a.views || 0);
          });
          resolve(list);
        })
        .catch(function (e) {
          console.log('[db] getHeritages 查询失败，降级使用mock:', e);
          resolve(filterMockHeritages(category));
        });
    } else {
      resolve(filterMockHeritages(category));
    }
  });
}

function filterMockHeritages(category) {
  var list = mockData.heritages || [];
  if (category && category !== 'all') {
    list = list.filter(function (item) {
      return item.category === category;
    });
  }
  return list;
}

function getHeritageById(id) {
  return new Promise(function (resolve) {
    var db = init();
    if (db) {
      db.collection('heritages').doc(id).get()
        .then(function (res) {
          resolve(res.data || null);
        })
        .catch(function (e) {
          console.log('[db] getHeritageById 查询失败，降级使用mock:', e);
          resolve(findMockHeritageById(id));
        });
    } else {
      resolve(findMockHeritageById(id));
    }
  });
}

function findMockHeritageById(id) {
  var list = mockData.heritages || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i]._id === id) {
      return list[i];
    }
  }
  return null;
}

function getRoutes() {
  return new Promise(function (resolve) {
    var db = init();
    if (db) {
      db.collection('routes').get()
        .then(function (res) {
          resolve(res.data || []);
        })
        .catch(function (e) {
          console.log('[db] getRoutes 查询失败，降级使用mock:', e);
          resolve(mockData.routes || []);
        });
    } else {
      resolve(mockData.routes || []);
    }
  });
}

function getPointsByRouteId(routeId) {
  return new Promise(function (resolve) {
    var db = init();
    if (db) {
      db.collection('points').where({ routeId: routeId }).get()
        .then(function (res) {
          var list = res.data || [];
          list.sort(function (a, b) {
            return (a.sortOrder || 0) - (b.sortOrder || 0);
          });
          resolve(list);
        })
        .catch(function (e) {
          console.log('[db] getPointsByRouteId 查询失败，降级使用mock:', e);
          resolve(filterMockPointsByRouteId(routeId));
        });
    } else {
      resolve(filterMockPointsByRouteId(routeId));
    }
  });
}

function filterMockPointsByRouteId(routeId) {
  var list = mockData.points || [];
  var result = list.filter(function (item) {
    return item.routeId === routeId;
  });
  result.sort(function (a, b) {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
  return result;
}

function getFavorites(userId) {
  return new Promise(function (resolve) {
    var db = init();
    if (db) {
      db.collection('favorites').where({
        _openid: userId
      }).get()
        .then(function (res) {
          resolve(res.data || []);
        })
        .catch(function (e) {
          console.log('[db] getFavorites 查询失败，降级使用mock:', e);
          resolve(mockData.mockFavorites || []);
        });
    } else {
      resolve(mockData.mockFavorites || []);
    }
  });
}

function addFavorite(data) {
  return new Promise(function (resolve, reject) {
    var db = init();
    if (db) {
      db.collection('favorites').add({
        data: {
          heritageId: data.heritageId,
          title: data.title,
          emoji: data.emoji,
          summary: data.summary,
          createTime: db.serverDate()
        }
      })
        .then(function (res) {
          resolve(res);
        })
        .catch(function (e) {
          console.log('[db] addFavorite 失败:', e);
          mockData.mockFavorites.push({
            _id: 'local_' + Date.now(),
            heritageId: data.heritageId,
            title: data.title,
            emoji: data.emoji,
            summary: data.summary,
            createTime: new Date()
          });
          reject(e);
        });
    } else {
      mockData.mockFavorites.push({
        _id: 'local_' + Date.now(),
        heritageId: data.heritageId,
        title: data.title,
        emoji: data.emoji,
        summary: data.summary,
        createTime: new Date()
      });
      resolve({ _id: 'local_' + Date.now() });
    }
  });
}

function removeFavorite(id) {
  return new Promise(function (resolve, reject) {
    var db = init();
    if (db) {
      db.collection('favorites').doc(id).remove()
        .then(function (res) {
          resolve(res);
        })
        .catch(function (e) {
          console.log('[db] removeFavorite 失败:', e);
          mockData.mockFavorites = mockData.mockFavorites.filter(function (item) {
            return item._id !== id;
          });
          reject(e);
        });
    } else {
      mockData.mockFavorites = mockData.mockFavorites.filter(function (item) {
        return item._id !== id;
      });
      resolve({});
    }
  });
}

function getCheckins(userId) {
  return new Promise(function (resolve) {
    var db = init();
    if (db) {
      db.collection('checkins').where({
        _openid: userId
      }).get()
        .then(function (res) {
          resolve(res.data || []);
        })
        .catch(function (e) {
          console.log('[db] getCheckins 查询失败，降级使用mock:', e);
          resolve(mockData.mockCheckins || []);
        });
    } else {
      resolve(mockData.mockCheckins || []);
    }
  });
}

function addCheckin(data) {
  return new Promise(function (resolve, reject) {
    var db = init();
    if (db) {
      db.collection('checkins').add({
        data: {
          pointId: data.pointId,
          pointName: data.pointName,
          routeId: data.routeId,
          routeName: data.routeName,
          latitude: data.latitude,
          longitude: data.longitude,
          checkinTime: db.serverDate()
        }
      })
        .then(function (res) {
          resolve(res);
        })
        .catch(function (e) {
          console.log('[db] addCheckin 失败:', e);
          mockData.mockCheckins.push({
            _id: 'local_' + Date.now(),
            pointId: data.pointId,
            pointName: data.pointName,
            routeId: data.routeId,
            routeName: data.routeName,
            latitude: data.latitude,
            longitude: data.longitude,
            checkinTime: new Date()
          });
          reject(e);
        });
    } else {
      mockData.mockCheckins.push({
        _id: 'local_' + Date.now(),
        pointId: data.pointId,
        pointName: data.pointName,
        routeId: data.routeId,
        routeName: data.routeName,
        latitude: data.latitude,
        longitude: data.longitude,
        checkinTime: new Date()
      });
      resolve({ _id: 'local_' + Date.now() });
    }
  });
}

function getUser(openid) {
  return new Promise(function (resolve) {
    var db = init();
    if (db) {
      db.collection('users').where({
        _openid: openid
      }).get()
        .then(function (res) {
          var list = res.data || [];
          resolve(list.length > 0 ? list[0] : null);
        })
        .catch(function (e) {
          console.log('[db] getUser 查询失败:', e);
          resolve(null);
        });
    } else {
      resolve(null);
    }
  });
}

function saveUser(userData) {
  return new Promise(function (resolve, reject) {
    var db = init();
    if (db) {
      getUser(userData._openid).then(function (existing) {
        if (existing) {
          db.collection('users').doc(existing._id).update({
            data: {
              nickName: userData.nickName,
              avatarUrl: userData.avatarUrl,
              signature: userData.signature,
              preferences: userData.preferences,
              updateTime: db.serverDate()
            }
          })
            .then(function (res) {
              resolve(res);
            })
            .catch(function (e) {
              console.log('[db] saveUser 更新失败:', e);
              reject(e);
            });
        } else {
          db.collection('users').add({
            data: {
              nickName: userData.nickName,
              avatarUrl: userData.avatarUrl,
              signature: userData.signature,
              preferences: userData.preferences,
              createTime: db.serverDate(),
              updateTime: db.serverDate()
            }
          })
            .then(function (res) {
              resolve(res);
            })
            .catch(function (e) {
              console.log('[db] saveUser 新增失败:', e);
              reject(e);
            });
        }
      });
    } else {
      reject(new Error('云数据库未初始化'));
    }
  });
}

module.exports = {
  init: init,
  getHeritages: getHeritages,
  getHeritageById: getHeritageById,
  getRoutes: getRoutes,
  getPointsByRouteId: getPointsByRouteId,
  getFavorites: getFavorites,
  addFavorite: addFavorite,
  removeFavorite: removeFavorite,
  getCheckins: getCheckins,
  addCheckin: addCheckin,
  getUser: getUser,
  saveUser: saveUser
};
