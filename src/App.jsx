import { useRoutes } from "react-router-dom";
import routes from "./routes/index.jsx";
import "./App.css";

function App() {
  //根据路由表生成对应的路由规则
  const element = useRoutes(routes);


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
