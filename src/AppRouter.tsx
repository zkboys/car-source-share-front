import {useRoutes} from 'react-router-dom';
import {routes} from "~pages-config";
import Error404 from "@/pages/error-404";

const _routes = [
  ...routes,
  {path: '*', element: <Error404/>}
]

console.log(routes);

export default function AppRouter() {
  return (
    <>
      {useRoutes(_routes)}
    </>
  )
}
