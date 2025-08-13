import { NavLink, useRoutes } from "react-router-dom";
import GdMap from "@/pages/gdMap/index.jsx";
// import routes from "./routes/index.js";
import "./App.css";

function App() {
  // console.log(routes, "routes");
  //根据路由表生成对应的路由规则
  // const element = useRoutes(routes);

  let element = useRoutes([
    {
      path: "/",
      element: <GdMap />,
    },
  ]);
  return (
    <>
      <div className="col-xs-7">
        <div className="panel">
          <div className="panel-body">
            {/* 注册路由 */}
            {element}
            {/* <div className="text-red-500 text-2xl">hello</div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
