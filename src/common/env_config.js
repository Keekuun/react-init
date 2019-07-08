const envUrls = {
  local: {
    apiServerUrl: "http://localhost:8011",
    nodeApiServerUrl: "http://localhost:8011",
    uri: "http://172.16.48.57"
  },
  dev: {
    apiServerUrl: "https://www.webfunny.cn",
    nodeApiServerUrl: "https://www.webfunny.cn",
    assetsUrl: "https://local.webfunny.cn",
    uri: "https://local.webfunny.cn:9100"
  },
  qa: {
    apiServerUrl: "https://www.webfunny.cn",
    assetsUrl: "https://www.webfunny.cn",
    nodeApiServerUrl: "https://www.webfunny.cn",
    uri: "https://www.webfunny.cn"
  },
  staging: {
    apiServerUrl: "https://www.webfunny.cn",
    assetsUrl: "https://www.webfunny.cn",
    nodeApiServerUrl: "https://www.webfunny.cn",
    uri: "https://www.webfunny.cn"
  },
  prod: {
    apiServerUrl: "//www.webfunny.cn",
    assetsUrl: "//www.webfunny.cn",
    nodeApiServerUrl: "//www.webfunny.cn",
    uri: "//www.webfunny.cn"
  }
}

const getApiHost = () => {
  return envUrls[BUILD_ENV].apiServerUrl
}

const getNodeApiHost = () => {
  return envUrls[BUILD_ENV].nodeApiServerUrl
}
//  relativePath   eg: "/ltvfe/cl/"
const getAssetsUrl = (env = BUILD_ENV, relativePath) => {
  const assetsUrl = envUrls[env].assetsUrl || ""
  const suffix = env === "local" ? "/webfunny/" : relativePath
  return assetsUrl + suffix
}

const getUri = () => {
  return envUrls[BUILD_ENV].uri
}

module.exports = {
  getApiHost,
  getNodeApiHost,
  getAssetsUrl,
  getUri
}
