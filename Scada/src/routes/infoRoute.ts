
// Import only what we need from express
import { Router, Request, Response, RequestHandler } from 'express';

let create = (baseUrl: string, router: Router) => {
  var reqHandler: RequestHandler = (req: Request, res: Response) => {
    let endpoints = router.stack
      .filter(layer => (layer.path || layer.regexp))
      .map(layer => {
        return layer.name + ':' + baseUrl + (layer.path || layer.regexp);
      })
    // console.log(router.stack);
    res.status(200)
      .send({
        message: 'Success',
        res: 'ok',
        data: endpoints
      });
  };
  return reqHandler;
}

export const InfoRouter: (baseUrl: string, router: Router) => RequestHandler = create;
