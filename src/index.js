// 直接调用启动
import React from "react"
import ReactDOM from "react-dom"
import { Route, BrowserRouter } from "react-router-dom"
import Home from "./modules/home"
import Description from "./modules/des"

ReactDOM.render(
    <BrowserRouter >
        <Route path="/demo/home" component={Home}/>
        <Route path="/demo/description" component={Description}/>
    </BrowserRouter>,
    document.getElementById("app")
)