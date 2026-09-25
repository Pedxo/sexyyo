import { RouterProvider } from 'react-router'
import AppRoutes from './routes/AppRoutes'

function App() {
  return <RouterProvider router={AppRoutes} />
}

export default App