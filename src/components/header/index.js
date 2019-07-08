import "./index.scss"
import React, { Component } from "react"
import { Menu, Dropdown, Icon, Tooltip, AutoComplete, Button, Radio, Modal } from "antd"
import HttpUtil from "Common/http-util"
import HttpApi from "Common/http-api"
import SvgIcons from "Components/svg_icons"
const { AppMessage, NewFlag, FullScreen, ExitFullScreen } = SvgIcons
export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userType: 1,
      projectList: [],
      chooseProject: {
        webMonitorId: "",
        projectName: ""
      },
      starCount: 0,
      isFullScreen: false
    }
    this.choseProject = this.choseProject.bind(this)
    this.getApiDataFromCache = this.getApiDataFromCache.bind(this)
  }

  componentDidMount() {
    let cacheData
    // 首先使用缓存数据渲染
    this.getApiDataFromCache("api-0-1-3").then(function(data) {
      console.log(data)
      if (data) {
        console.log("========================")
        console.log(data)
        console.log("========================")
      }
      cacheData = data || {}
      return cacheData
    }).then( (data) => {
      if (JSON.stringify(data) !== JSON.stringify(cacheData)) {
        console.log("------------------------")
        console.log(data)
        console.log("------------------------")
      }
    })

    const chooseWebMonitorId = window.localStorage.chooseWebMonitorId
    HttpUtil.get(HttpApi.projectList).then( res => {
      const projectList = res.data
      let chooseProject = res.data[0]
      for (let i = 0; i < projectList.length; i ++) {
        if (chooseWebMonitorId === projectList[i].webMonitorId) {
          chooseProject = projectList[i]
          break
        }
      }
      this.setState({projectList: projectList, chooseProject})
      window.localStorage.chooseWebMonitorId = chooseProject.webMonitorId
      if (typeof this.props.loadedProjects === "function") this.props.loadedProjects(chooseProject)
    }, () => {
      throw new Error("未能成功获取应用列表")
    })
    $(window).scroll(() => {
      const top = $(document).scrollTop()
      if (top > 100) {
        $(".header-container").fadeOut()
      } else if (top < 20) {
        $(".header-container").fadeIn()
      }
    })
    document.getElementById("progress_bar").style.display = "none"

    // 获取git数据
    HttpUtil.get("//api.github.com/repos/a597873885/webfunny_monitor/stargazers", {per_page: 300}).then( (res) => {
      this.setState({starCount: res.length})
    })
  }
  render() {
    const { pageLocation, switchHomeMenuFlag } = this.props
    const { projectList, chooseProject, starCount, isFullScreen } = this.state
    const projectNameList = []
    const chooseProjectName = chooseProject.projectName
    projectList.forEach((item) => {
      projectNameList.push(item.projectName)
    })
    const errorNameList = [
      {
        name: <span>Js错误统计<b style={{color: "#e37b66", fontSize: 12}}>足迹定位</b></span>,
        url: "javascriptError",
        icon: <Icon style={{color: "#e37b66"}} type="eye" theme="filled" />
      },
      {
        name: "静态资源错误统计",
        url: "resourceError",
        icon: <Icon type="file-text" />
      },
      {
        name: "接口请求错误统计",
        url: "httpError",
        icon: <Icon type="export" />
      },
    ]
    const performanceNameList = [
      {
        name: "页面加载性能分析（待发布）",
        // url: "pagePerformance",
        icon: <Icon type="line-chart" />
      },
      {
        name: "接口请求性能分析（待发布）",
        // url: "httpPerformance",
        icon: <Icon type="file-text" />
      },
    ]

    const performanceMenu =
      <Menu>
        {
          performanceNameList.map((errorName, index) => {
            return <Menu.Item key={ index }>
              <a onClick={this.turnToErrorPage.bind(this, errorName)}>{errorName.icon} {errorName.name}</a>
            </Menu.Item>
          })
        }
      </Menu>
    const errorMenu =
      <Menu>
        {
          errorNameList.map((errorName, index) => {
            return <Menu.Item key={ index }>
              <a onClick={this.turnToErrorPage.bind(this, errorName)}>{errorName.icon} {errorName.name}</a>
            </Menu.Item>
          })
        }
      </Menu>
    return <div className="header-container">
      <section className="sub-header">
        <span className="home-icon" onClick={pageLocation === "home" ? this.switchHomeMenu.bind(this) : this.turnToHome.bind(this)}>
          {pageLocation === "home" ? <Icon component={switchHomeMenuFlag === true ? SvgIcons.MenuOut : SvgIcons.MenuIn} /> : null}<b>WEB</b><label>funny</label>
        </span>
        <div className="project-select-box">
          {
            projectNameList.length > 0 &&
            <span>
              <AutoComplete
                backfill
                style={{ width: 180 }}
                dataSource={projectNameList}
                placeholder="试着输入你的项目名称"
                defaultValue={chooseProjectName}
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                onSelect={(value) => {
                  projectList.forEach((item) => {
                    if (item.projectName === value) {
                      this.choseProject(item)
                    }
                  })
                }}
              /><div className="search-icon"><Icon type="search"/></div>
            </span>
          }
          <Button type="primary" icon="plus" onClick={this.turnToCreateNewProject.bind(this)}>一键部署</Button>
        </div>
        <span className="menu-right" style={{color: "#ea6947", fontWeight: "bold"}} onClick={this.turnTo.bind(this, "home")}>实时监控</span>
        <span className="menu-right">
          <Dropdown overlay={errorMenu} trigger={["hover"]}>
            <a className="ant-dropdown-link" href="#">
              错误统计 <Icon type="down" /><Icon className="new-flag" component={NewFlag}/>
            </a>
          </Dropdown>
        </span>
        <span className="menu-right" onClick={this.turnTo.bind(this, "behaviors")}>记录回放<Icon className="new-flag" component={NewFlag}/></span>
        <span className="menu-right">
          <Dropdown overlay={performanceMenu} trigger={["click"]}>
            <a className="ant-dropdown-link" style={{color: "#999"}} href="#">
              性能分析 <Icon type="down" />
            </a>
          </Dropdown>
          <label className="not">待发布</label>
        </span>
        <Radio.Group className="github-container" value="small">
          <Radio.Button onClick={this.turnToBlog.bind(this)} style={{background: "#f8fafb"}} ><Icon type="star" theme="filled" />Star</Radio.Button>
          <Radio.Button onClick={this.turnToBlog.bind(this)}>{starCount}</Radio.Button>
        </Radio.Group>
      </section>
      <div className="message-box" >
        { isFullScreen ?
          <Tooltip placement="left" title="退出全屏">
            <Icon component={ExitFullScreen} onClick={this.exitFullScreen.bind(this)}/>
          </Tooltip>
          :
          <Tooltip placement="left" title="全屏">
            <Icon component={FullScreen} onClick={this.fullScreen.bind(this)}/>
          </Tooltip>
        }
        <Tooltip placement="left" title="有问题，欢迎给我留言">
          <Icon component={AppMessage} onClick={this.turnToZhihu.bind(this)}/>
        </Tooltip>
      </div>
    </div>
  }
  fullScreen() {
    const el = document.documentElement
    const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
    if (typeof rfs !== "undefined" && rfs) {
        rfs.call(el)
    }
    this.setState({isFullScreen: true})
  }
  exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
    }
    if (typeof cfs !== "undefined" && cfs) {
        cfs.call(el)
    }
    this.setState({isFullScreen: false})
  }
  turnToZhihu() {
    window.open("https://zhuanlan.zhihu.com/webfunny")
  }
  turnTo(url) {
    this.props.parentProps.history.push(url)
  }
  turnToBlog() {
    window.open("https://github.com/a597873885/webfunny_monitor")
  }
  turnToHome() {
    const {parentProps} = this.props
    parentProps.history.push("home")
  }
  choseProject(project) {
    this.setState({chooseProject: project})
    window.localStorage.chooseWebMonitorId = project.webMonitorId
    if (typeof this.props.chooseProject === "function") {
      this.props.chooseProject(project)
    }
  }
  turnToErrorPage(errorName) {
    if (!errorName.url) return
    const {parentProps} = this.props
    parentProps.history.push(errorName.url)
  }
  changeUserType() {
    const { userType } = this.state
    if (userType === 1) {
      this.setState({userType: 2})
    } else {
      this.setState({userType: 1})
    }
  }
  turnToCreateNewProject() {
    Modal.confirm({
      title: "提示",
      content: <span><b>随意</b>生成探针会增加更多的维护时间，<br/>希望能够认真创建，谢谢！</span>,
      okText: "继续创建",
      cancelText: "不了，谢谢",
      iconType: "info",
      onOk: () => {
        const {parentProps} = this.props
        parentProps.history.push("createProject")
      }
    })
  }
  switchHomeMenu() {
    if ( typeof this.props.switchHomeMenu === "function") {
      this.props.switchHomeMenu()
    }
  }
  getApiDataFromCache(url) {
    if ("caches" in window) {
      return caches.match(url).then((cache) => {
        if (!cache) {
          return null
        }
        return cache.json()
      })
    }
    return Promise.resolve()
  }
}
// function getApiDataFromCache(url) {
//   if ("caches" in window) {
//     return caches.match(url).then((cache) => {
//       if (!cache) {
//         return null
//       }
//       return cache.json()
//     })
//   }
//   return Promise.resolve()
// }
// getApiDataFromCache("api-0-1-3").then((data) => {
//   console.log(data)
// })
