import { BrowserRouter } from 'react-router-dom';
import AnimatedRoutes from '../src/pages/Components/AnimatedRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default App;
