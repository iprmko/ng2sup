
// Import only what we need from express
import { Router, Request, Response } from 'express';

// Assign router to the express.Router() instance
const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  let query = parseInt(req.params.id);

  let data = loadData();
  if (data) {
    res.status(200)
      .send({
        message: 'Success',
        res: 'ok',
        data: data
      });
  } else {
    res.status(404)
      .send({
        message: 'No item found with the given given adjectives.',
        res: 'nok',
      });
  }
});

router.get('/:name', (req: Request, res: Response) => {
  // Extract the name from the request parameters
  let { name } = req.params;
  let data = loadData();

  let respData = (data || []).find(item => item.title === name);

  if (respData) {
    res.status(200)
      .send({
        message: 'Success',
        res: 'ok',
        data: respData
      });
  } else {
    res.status(404)
      .send({
        message: 'No item found with the given adjectives.',
        res: 'nok',
      });
  }
});

let loadData: any = () => {
  const path = __dirname + '/../../data/pages.json';
  let json = JSON.parse(require('fs').readFileSync(path, 'utf8'));
  return json;
}

// Export the express.Router() instance to be used by server.ts
export const PagesRouter: Router = router;
