import { useRoutes } from "react-router-dom";
import routes from "./routes/index.jsx";

function App() {
  //根据路由表生成对应的路由规则
  const element = useRoutes(routes);


  return (
    <>
      {/* 注册路由 */}
      {element}
    </>
  );
}

export default App;
